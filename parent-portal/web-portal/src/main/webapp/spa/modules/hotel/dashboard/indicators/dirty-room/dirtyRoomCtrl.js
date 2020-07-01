(function(app){
    'use strict';

    app.directive('dirtyRoomHotelIndicator', dirtyRoomHotelIndicator);

    dirtyRoomHotelIndicator.$inject = ['$uibModal', 'apiService', '$q', 'notificationService']; 
    function dirtyRoomHotelIndicator($uibModal, apiService, $q, notificationService) {
        return {
            restrict: 'EA',
            templateUrl: "modules/hotel/dashboard/indicators/dirty-room/dirtyRoomView.html",
            link: function (scope, element, attrs) {

            	function loadRoomDirty(){
            		 scope.loadingRoomOccupied = true;
	       			 return apiService.get('/web/api/room/dirty', {},
	       				        function (response) {					            				            		                    
	       				 			scope.loadingRoomDirty = false;	
	       				 			scope.numberOfRoomDirty = response.data.length;
	       				        },
	       				        function(error){
	       				        	notificationService.displayError(error);
	       				        	scope.loadingRoomDirty = false;
	       				        }
	       			 );
	       		}
	       		
            	loadRoomDirty();
            }
        };
    }

})(angular.module('common.core'));