(function(app){
	'use strict';
	
	app.controller('dayOccupationCtrl', dayOccupationCtrl);
	
	dayOccupationCtrl.$inject = ['apiService', 'notificationService', '$state', '$scope'];
	function dayOccupationCtrl(apiService, notificationService, $state, $scope){
		var vm = this;
        
        function loadOccupations(){

                apiService.get('/web/api/booking/day-occupation', {},
                				function(response){            					                		              				            	
    								vm.items = response.data;            		            
                				}
                );           
        }
        
		this.$onInit = function(){
			loadOccupations();
		}
	}
})(angular.module('lightpro'));