(function(app){
    'use strict';

    app.directive('occupationRateHotelIndicator', occupationRateHotelIndicator);

    occupationRateHotelIndicator.$inject = ['$uibModal', 'apiService', '$q', 'notificationService']; 
    function occupationRateHotelIndicator($uibModal, apiService, $q, notificationService) {
        return {
            restrict: 'EA',
            templateUrl: "modules/hotel/dashboard/indicators/occupation-rate/occupationRateView.html",
            link: function (scope, element, attrs) {

            	scope.selectMonthRatePeriod = selectMonthRatePeriod;
            	scope.selectWeekRatePeriod = selectWeekRatePeriod;
            	
            	function selectMonthRatePeriod(){			
        			$uibModal.open({
                        templateUrl: 'main/calendar/calendarView.html',
                        controller: 'calendarCtrl as vm',
                        size: 'md',
                        resolve: {
                            data: {
                                date: scope.currentMonthRateDate
                            }
                        }
                    }).result.then(function (dateSelected) {
                    	scope.currentMonthRateDate = dateSelected;
                    	loadMonthRateOccupation(dateSelected);
                    }, function () {
                    });
        		}
        		
        		function selectWeekRatePeriod(){			
        			$uibModal.open({
                        templateUrl: 'main/calendar/calendarView.html',
                        controller: 'calendarCtrl as vm',
                        size: 'md',
                        resolve: {
                            data: {
                                date: scope.currentWeekRateDate
                            }
                        }
                    }).result.then(function (dateSelected) {
                    	scope.currentWeekRateDate = dateSelected;
                    	loadWeekRateOccupation(dateSelected);
                    }, function () {
                    });
        		}
        		
        		function loadMonthRateOccupation(date){
        		 scope.monthRate = {};
        		 scope.monthRate.loadingData = true;
       			 return apiService.post('/web/api/booking/rate-occupation/month', date,
       				        function (response) {					            				            		                    
       				 			scope.monthRate.loadingData = false;
       				 			scope.monthRate.periodFormatted = response.data.periodFormatted;
       				 			scope.monthRate.rate = response.data.rateInPercentFormatted;
       				        },
       				        function(error){
       				        	notificationService.displayError(error);
       				        	scope.monthRate.loadingData = false;
       				        }
       			 );
        		}
       		
	       		function loadWeekWorkDayRateOccupation(date){			 			
	       			 return apiService.post('/web/api/booking/rate-occupation/week-work-day', date,
	       				        function (response) {
	       				 		    scope.weekWorkDayRate = {};
	       				 		    scope.weekWorkDayRate.periodFormatted = response.data.periodFormatted;
	       				 		    scope.weekWorkDayRate.rate = response.data.rateInPercentFormatted;
	       				        },
	       				        function(error){
	       				        	notificationService.displayError(error);
	       				        }
	       			 );
	       		}
       		
	       		function loadWeekendRateOccupation(date){
	       			 return apiService.post('/web/api/booking/rate-occupation/weekend', date,
	       				        function (response) {	
	       				 			scope.weekendRate = {};
	       				 			scope.weekendRate.periodFormatted = response.data.periodFormatted;
	       				 			scope.weekendRate.rate = response.data.rateInPercentFormatted;
	       				        },
	       				        function(error){
	       				        	notificationService.displayError(error);
	       				        }
	       			 );
	       		}
       		
	       		function loadWeekRateOccupation(date){
	       			scope.weekLoadingData = true;
	       			$q.all([loadWeekWorkDayRateOccupation(date), loadWeekendRateOccupation(date)]).then(function(){
	       				scope.weekLoadingData = false;
	       			}, function(){
	       				scope.weekLoadingData = false;
	       			});
	       		}
	       		
	       		scope.currentMonthRateDate = new Date();
	       		scope.currentWeekRateDate = new Date();
	       		loadMonthRateOccupation(scope.currentMonthRateDate);						
    			loadWeekRateOccupation(scope.currentWeekRateDate);
            }
        };
    }

})(angular.module('common.core'));