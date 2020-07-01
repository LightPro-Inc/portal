(function(app){
    'use strict';

    app.directive('repartitionSalesSalesIndicator', repartitionSalesSalesIndicator);

    repartitionSalesSalesIndicator.$inject = ['$uibModal', 'apiService', '$q', 'notificationService', '$rootScope', '$filter']; 
    function repartitionSalesSalesIndicator($uibModal, apiService, $q, notificationService, $rootScope, $filter) {
        return {
            restrict: 'EA',
            templateUrl: "modules/sales/dashboard/indicators/details-sales/detailsSalesView.html",
            link: function (scope, element, attrs) {

            	scope.loadResume = loadResume;
        		
        		function loadResume() {

        			var start, end;
        	    	
        	    	if(scope.criteriaResumeVente.monthSelected == 0){
        	    		
        	    		if(scope.criteriaResumeVente.daySelected == 0){
        	    			start = new Date(scope.criteriaResumeVente.yearSelected, 0, 1);
        		            end = new Date(scope.criteriaResumeVente.yearSelected, 11, scope.days[scope.days.length - 1].dayOfMonth);	    	
        	    		} else {
        	    			start = new Date(scope.criteriaResumeVente.yearSelected, 0, scope.criteriaResumeVente.daySelected);
        		            end = new Date(scope.criteriaResumeVente.yearSelected, 11, scope.criteriaResumeVente.daySelected);	    	
        	    		}	    	
        	    	}else{
        	    		if(scope.criteriaResumeVente.daySelected == 0){
        	    			start = new Date(scope.criteriaResumeVente.yearSelected, scope.criteriaResumeVente.monthSelected - 1, 1);
        		            end = new Date(scope.criteriaResumeVente.yearSelected, scope.criteriaResumeVente.monthSelected - 1, scope.days[scope.days.length - 1].dayOfMonth);
        	    		}else {
        	    			start = new Date(scope.criteriaResumeVente.yearSelected, scope.criteriaResumeVente.monthSelected - 1, scope.criteriaResumeVente.daySelected);
        		            end = new Date(scope.criteriaResumeVente.yearSelected, scope.criteriaResumeVente.monthSelected - 1, scope.criteriaResumeVente.daySelected);
        	    		}		    	
        	    	}
        	    	
                    
        	    	var config = {
        		            params: {
        		                start: moment(start).format("YYYY-MM-DD"),
        		                end: moment(end).format("YYYY-MM-DD")
        		            }
        		        };
        	    	
        	        scope.loadingResume = true;
        	        apiService.get('/web/api/sales/module/detail-sales', config,
        					        function (response) {		        					
        					            scope.sales = response.data;
        					            
        					            var data = [];
        					            var totalTurnover = 0;
        			                    angular.forEach(scope.sales, function (value) {
        			                        data.push({
        			                            label: value.pdv,
        			                            value: value.turnover
        			                        });
        			                        
        			                        totalTurnover += value.turnover;
        			                    });

        			                    scope.totalTurnover = totalTurnover;
        			                    
        			                    scope.salesByPdv = {
        			                        chart: {
        			                            caption: "Chiffres d'affaire par module de vente",
        			                            subcaption: "",
        			                            startingangle: "120",
        			                            showlabels: "0",
        			                            showlegend: "1",
        			                            enablemultislicing: "0",
        			                            slicingdistance: "15",
        			                            showpercentvalues: "1",
        			                            showpercentintooltip: "0",
        			                            plottooltext: "Module de vente : $label / Montant : $datavalue " + $rootScope.companyCurrency.symbol,
        			                            theme: "fint"
        			                        },
        			                        data: data
        			                    };
        			                    
        			                    scope.loadingResume = false;		                    
        					        },
        					        function(error){
        					        	notificationService.displayError(error);
        					        	scope.loadingResume = false;
        					        }
        	        );
        	    }
        		
        		scope.changeResumeVenteMonth = changeResumeVenteMonth;
        	    scope.changeResumeVenteYear = changeResumeVenteYear;
        	    scope.changeResumeVenteDay = changeResumeVenteDay;
        	    
        	    function changeResumeVenteDay(day) {

        	    }

        	    function changeResumeVenteMonth(month) {
        	        loadDays(month, scope.criteriaResumeVente.yearSelected, function (days) {
        	            scope.days = days;
        	            scope.criteriaResumeVente.daySelected = scope.days[0].dayOfMonth;
        	        });
        	    }

        	    function changeResumeVenteYear(year) {
        	        loadDays(scope.criteriaResumeVente.monthSelected, year, function (days) {
        	            scope.days = days;
        	            scope.criteriaResumeVente.daySelected = scope.days[0].dayOfMonth;
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
        	    
        	    function init(){        				
        		        var yearsOfWorkPromise = apiService.get('/web/api/dashboard-tool/year/work', {},
        	                function (response) {
        	                    scope.years = response.data;
        	                }, function () {
        	                });

        		        var monthsNamePromise = apiService.get('/web/api/dashboard-tool/month', {},
        	                function (response) {
        	                    scope.months = response.data;
        	                }, function () {
        	                });

        		        var todayPromise = apiService.get('/web/api/dashboard-tool/day/today', {},
        	                function (response) {
        	                    scope.today = response.data;
        	                }, function () {
        	                	
        	                });

        		        $q.all([yearsOfWorkPromise, todayPromise, monthsNamePromise]).then(function () {
        	                
        		            loadDays(scope.today.month, scope.today.year, function (days) {
        		                scope.days = days;

        		                scope.criteriaResumeVente = {
        		                    daySelected: 0,
        		                    monthSelected: scope.today.month,
        		                    yearSelected: scope.today.year
        		                };
        		                		           		                
        		                loadResume();
        		            });
        		        });			
        	    }
        	    
        	    init();
            }
        };
    }

})(angular.module('common.core'));