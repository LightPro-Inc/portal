(function(app){
    'use strict';

    app.directive('salesResumeSalesIndicator', salesResumeSalesIndicator);

    salesResumeSalesIndicator.$inject = ['$uibModal', 'apiService', '$q', 'notificationService']; 
    function salesResumeSalesIndicator($uibModal, apiService, $q, notificationService) {
        return {
            restrict: 'EA',
            templateUrl: "modules/sales/dashboard/indicators/sales-resume/salesResumeView.html",
            link: function (scope, element, attrs) {

            	scope.changeResumeVenteMonth = changeResumeVenteMonth;
        	    scope.changeResumeVenteYear = changeResumeVenteYear;
        	    scope.changeResumeVenteDay = changeResumeVenteDay;
        	    scope.loadResumeSales = loadResumeSales;
        	    
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
        	    
        	    function loadResumeSales(){
        	    	
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

        	    	scope.loadingResumeSales = true;
        	        return apiService.get("/web/api/product/resume-sales", config,
                        function (response) {
        	        		scope.loadingResumeSales = false;
                            scope.resume = response.data;
                        },
                        function (response) {
                        	scope.loadingResumeSales = false;
                            notificationService.displayError(response.data);
                        });
        	    }
        	    
        	    function init() {
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
        		                
        		                loadResumeSales();
        		            });
        		        });	
        	    }
        	    
        	    init();
            }
        };
    }

})(angular.module('common.core'));