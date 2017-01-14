(function(app){
	'use strict';
	
	app.controller('stocksDashboardCtrl', stocksDashboardCtrl);
	
	stocksDashboardCtrl.$inject = ['apiService', '$scope', '$rootScope', 'notificationService', '$interval'];
	function stocksDashboardCtrl(apiService, $scope, $rootScope, notificationService, $interval){
		var vm = this;

		vm.getStockColor = getStockColor;
		
		function getStockColor(stockLocation) {
	        switch (stockLocation.alertId) {
	            case 3:
	                return 'red'; // minimum atteint
	            case 2:
	                return 'orangered'; // sécurité atteint
	            case 1:
	                return 'greenyellow'; // maximum atteint
	            default:
	                return 'green'; // aucune alerte
	        }
	    }
		
		$scope.$watch('vm.warehouseId', function () {
			if(!vm.warehouseId)
				return;
			
			apiService.get(String.format('/web/api/warehouse/{0}/stock', vm.warehouseId), {}, 
					function(response){						
						vm.stocks = response.data;
					}
			);
        });
		
		this.$onInit = function(){
			
			apiService.get(String.format('/web/api/warehouse'), {}, 
					function(response){
						vm.warehouses = response.data;	
						
						if(vm.warehouses.length > 0)
							vm.warehouseId = vm.warehouses[0].id;
					}
			);				
		}
	}
	
})(angular.module('lightpro'));