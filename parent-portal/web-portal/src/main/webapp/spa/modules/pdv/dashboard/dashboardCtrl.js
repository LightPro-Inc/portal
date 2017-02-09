(function(app){
	'use strict';
	
	app.controller('pdvDashboardCtrl', pdvDashboardCtrl);
	
	pdvDashboardCtrl.$inject = ['apiService', '$scope', '$rootScope', 'notificationService', '$interval', 'membershipService', '$q'];
	function pdvDashboardCtrl(apiService, $scope, $rootScope, notificationService, $interval, membershipService, $q){
		var vm = this;
		
		vm.loadResume = loadResume;
		vm.resfreshData = resfreshData;
		
		function resfreshData(){
			restartLoadData();
		}
		
		function loadResume() {

			var start, end;
	    	
	    	if(vm.criteriaResumeVente.monthSelected == 0){
	    		
	    		if(vm.criteriaResumeVente.daySelected == 0){
	    			start = new Date(vm.criteriaResumeVente.yearSelected, 0, 1);
		            end = new Date(vm.criteriaResumeVente.yearSelected, 11, vm.days[vm.days.length - 1].dayOfMonth);	    	
	    		} else {
	    			start = new Date(vm.criteriaResumeVente.yearSelected, 0, vm.criteriaResumeVente.daySelected);
		            end = new Date(vm.criteriaResumeVente.yearSelected, 11, vm.criteriaResumeVente.daySelected);	    	
	    		}	    	
	    	}else{
	    		if(vm.criteriaResumeVente.daySelected == 0){
	    			start = new Date(vm.criteriaResumeVente.yearSelected, vm.criteriaResumeVente.monthSelected - 1, 1);
		            end = new Date(vm.criteriaResumeVente.yearSelected, vm.criteriaResumeVente.monthSelected - 1, vm.days[vm.days.length - 1].dayOfMonth);
	    		}else {
	    			start = new Date(vm.criteriaResumeVente.yearSelected, vm.criteriaResumeVente.monthSelected - 1, vm.criteriaResumeVente.daySelected);
		            end = new Date(vm.criteriaResumeVente.yearSelected, vm.criteriaResumeVente.monthSelected - 1, vm.criteriaResumeVente.daySelected);
	    		}		    	
	    	}
	    	
            
	    	var config = {
		            params: {
		                start: moment(start).format("YYYY-MM-DD"),
		                end: moment(end).format("YYYY-MM-DD")
		            }
		        };
	    	
	        vm.loadingResume = true;
	        apiService.get('/web/api/pdv/pdv/resume-sales', config,
					        function (response) {		        					
					            vm.sales = response.data;
					            
					            var data = [];
					            var totalTurnover = 0;
			                    angular.forEach(vm.sales, function (value) {
			                        data.push({
			                            label: value.pdv,
			                            value: value.turnover
			                        });
			                        
			                        totalTurnover += value.turnover;
			                    });

			                    vm.totalTurnover = totalTurnover;
			                    
			                    vm.salesByPdv = {
			                        chart: {
			                            caption: "Chiffres d'affaire par point de vente",
			                            subcaption: "",
			                            startingangle: "120",
			                            showlabels: "0",
			                            showlegend: "1",
			                            enablemultislicing: "0",
			                            slicingdistance: "15",
			                            showpercentvalues: "1",
			                            showpercentintooltip: "0",
			                            plottooltext: "Point de vente : $label / Montant : $datavalue " + $rootScope.companyCurrency,
			                            theme: "fint"
			                        },
			                        data: data
			                    };
			                    
			                    vm.loadingResume = false;		                    
					        },
					        function(error){
					        	notificationService.displayError(error);
					        	vm.loadingResume = false;
					        }
	        );
	    }
		
		vm.changeResumeVenteMonth = changeResumeVenteMonth;
	    vm.changeResumeVenteYear = changeResumeVenteYear;
	    vm.changeResumeVenteDay = changeResumeVenteDay;
	    vm.loadResumeVente = loadResumeVente;
	    vm.refreshData = refreshData;
	    
	    function refreshData(){
	    	restartLoadData();
	    }
	    
	    function loadResumeVente(){
	    	restartLoadData();
	    }
	    
	    function changeResumeVenteDay(day) {

	    }

	    function changeResumeVenteMonth(month) {
	        loadDays(month, vm.criteriaResumeVente.yearSelected, function (days) {
	            vm.days = days;
	            vm.criteriaResumeVente.daySelected = vm.days[0].dayOfMonth;
	        });
	    }

	    function changeResumeVenteYear(year) {
	        loadDays(vm.criteriaResumeVente.monthSelected, year, function (days) {
	            vm.days = days;
	            vm.criteriaResumeVente.daySelected = vm.days[0].dayOfMonth;
	        });
	    }
	    
	    function loadDays(month, year, callback) {
	        return apiService.get(String.format('/web/api/dashboard-tool/year/{0}/month/{1}/day', year, month), {},
                function (response) {
                    if(callback)
                        callback(response.data);
                }, function () {
                });
	    }
	    
	    function loadData(){
	    	loadResume();
	    }
	    
	    var stop;
	    function startLoadData() {
	    	
	    	loadData();
	    	
	    	if(angular.isDefined(stop)) return ;
	    	
	        stop = $interval(function () {
	        	if(membershipService.isUserLoggedIn()){
	        		try {
		                loadData();
		            } catch (e) {
		                console.log(e);
		            }	            
	        	}else{
	        		stopLoadData();
	        	}
	            
	        }, 1 * 60 * 1000);

	        if (!membershipService.isUserLoggedIn())
	            return;	        
	    }	    
	    
	    function restartLoadData(){
	    	stopLoadData();
	    	startLoadData();
	    }
	    
	    function stopLoadData(){
	    	if(angular.isDefined(stop)){
	    		$interval.cancel(stop);
	    		stop = undefined;
	    	}
	    }
	    
	    $scope.$on('$destroy', function() { 
	          stopLoadData();
	    });
	    
		this.$onInit = function(){
				var currencyPromise = apiService.get('/web/api/company', {}, 
					function(response){
						$rootScope.companyCurrency = response.data.currencyShortName;
					});
				
		        var yearsOfWorkPromise = apiService.get('/web/api/dashboard-tool/year/work', {},
	                function (response) {
	                    vm.years = response.data;
	                }, function () {
	                });

		        var monthsNamePromise = apiService.get('/web/api/dashboard-tool/month', {},
	                function (response) {
	                    vm.months = response.data;
	                }, function () {
	                });

		        var todayPromise = apiService.get('/web/api/dashboard-tool/day/today', {},
	                function (response) {
	                    vm.today = response.data;
	                }, function () {
	                	
	                });

		        $q.all([currencyPromise, yearsOfWorkPromise, todayPromise, monthsNamePromise]).then(function () {
	                
		            loadDays(vm.today.month, vm.today.year, function (days) {
		                vm.days = days;

		                vm.criteriaResumeVente = {
		                    daySelected: 0,
		                    monthSelected: vm.today.month,
		                    yearSelected: vm.today.year
		                };
		                		           		                
		                startLoadData();
		            });
		        });				
		}
	}
	
})(angular.module('lightpro'));