(function(app){
    'use strict';

    app.directive('dayOccupationHotelIndicator', dayOccupationHotelIndicator);

    dayOccupationHotelIndicator.$inject = ['$uibModal', 'apiService', '$q', 'notificationService']; 
    function dayOccupationHotelIndicator($uibModal, apiService, $q, notificationService) {
        return {
            restrict: 'EA',
            templateUrl: "modules/hotel/dashboard/indicators/day-occupation/dayOccupationView.html",
            link: function (scope, element, attrs) {

            	function loadClientEnRecouche(){
	       			 apiService.get('/web/api/booking/day-occupation/client-en-recouche', {},
	       				        function (response) {					            				            		                    
	       				 			scope.numberOfClientEnRechouche = response.data.length;
	       				        },
	       				        function(error){
	       				        	notificationService.displayError(error);
	       				        }
	       			 );
	       		}
	       		
	       		function loadClientAttendu(){
	       			 apiService.get('/web/api/booking/day-occupation/client-attendu', {},
	       				        function (response) {					            				            		                    	
	       				 			scope.numberOfClientAttendu = response.data.length;
	       				        },
	       				        function(error){
	       				        	notificationService.displayError(error);
	       				        }
	       			 );
	       		}
	       		
	       		function loadClientArrive(){
	       			 return apiService.get('/web/api/booking/day-occupation/client-arrive', {},
	       				        function (response) {					            				            		                    	
	       				 			scope.numberOfClientArrive = response.data.length;
	       				        },
	       				        function(error){
	       				        	notificationService.displayError(error);
	       				        }
	       			 );
	       		}	
	       		
	       		function loadDayOccupation(){
	       			scope.loadingDayOccupation = true;
	    			$q.all([loadClientEnRecouche(), loadClientAttendu(), loadClientArrive()]).then(function(){
	    				scope.loadingDayOccupation = false;
	    			}, function(){
	    				scope.loadingDayOccupation = false;
	    			});
	    		}
	       		
	       		loadDayOccupation();
            }
        };
    }

})(angular.module('common.core'));