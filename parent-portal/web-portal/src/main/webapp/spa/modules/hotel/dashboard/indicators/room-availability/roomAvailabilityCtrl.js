(function(app){
    'use strict';

    app.directive('roomAvailabilityHotelIndicator', roomAvailabilityHotelIndicator);

    roomAvailabilityHotelIndicator.$inject = ['$uibModal', 'apiService', '$q', 'notificationService']; 
    function roomAvailabilityHotelIndicator($uibModal, apiService, $q, notificationService) {
        return {
            restrict: 'EA',
            templateUrl: "modules/hotel/dashboard/indicators/room-availability/roomAvailabilityView.html",
            link: function (scope, element, attrs) {

            	function loadRoomAvailable(){
	       			 return apiService.get('/web/api/room/free', {},
	       				        function (response) {					            				            		                    
	       				 			scope.numberOfFreeRooms = response.data.length;
	       				        },
	       				        function(error){
	       				        	notificationService.displayError(error);
	       				        }
	       			 );
	       		}
       		
	       		function loadRoomOccupied(){
	       			 return apiService.get('/web/api/room/occupied', {},
	       				        function (response) {					            				            		                    
	       				 			scope.numberOfRoomOccupied = response.data.length;
	       				        },
	       				        function(error){
	       				        	notificationService.displayError(error);
	       				        }
	       			 );
	       		}
	       		
	       		function loadRoomAvailability(){
	       			scope.loadingRoomAvailability = true;
	    			$q.all([loadRoomAvailable(), loadRoomOccupied()]).then(function(){
	    				scope.loadingRoomAvailability = false;
	    			}, function(){
	    				scope.loadingRoomAvailability = false;
	    			});
	    		}
	       		
	       		loadRoomAvailability();
            }
        };
    }

})(angular.module('common.core'));