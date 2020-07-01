(function(app){
	'use strict';
	
	app.controller('teamStockCtrl', teamStockCtrl);
	
	teamStockCtrl.$inject = ['apiService', 'notificationService', '$q'];
	function teamStockCtrl(apiService, notificationService, $q){
		var vm = this;
		
		vm.warehouseChanged = warehouseChanged;
		vm.save = save;			
		
		function warehouseChanged(item, warehouseId){
			
			if(!warehouseId){
				item.operationTypes = [];
				return;
			}
			
			loadDeliveryOperations(warehouseId, function(items){
				item.operationTypes = items;
			});
		}
		
		function save(){			
			apiService.post('/web/api/sales/interfacage/team-stock-interface', {teamsStock: vm.teamStocksInterfaces},
					function(response){
						notificationService.displaySuccess("La configuration des stocks des équipes commerciales a été enregistrée avec succès!");
					});
		}		
		
		function loadWarehouses(callback){
			apiService.get(String.format('/web/api/sales/interfacage/team-stock-interface/warehouse'), {}, function(response){
								
				if(callback)
					callback(response.data)				
			});
		}
		
		function loadDeliveryOperations(warehouseId, callback){
			apiService.get(String.format('/web/api/sales/interfacage/team-stock-interface/warehouse/{0}/delivery-operation', warehouseId), {}, function(response){
								
				if(callback)
					callback(response.data)				
			});
		}
		
		this.$onInit = function() {
			
			loadWarehouses(function(items){
				vm.warehouses = items;
			});
			
			apiService.get('/web/api/sales/interfacage/team-stock-interface', {}, function(response){
				
				vm.teamStocksInterfaces = response.data;
				
				angular.forEach(vm.teamStocksInterfaces, function(item){
					
					if(item.warehouseId){
						loadDeliveryOperations(item.warehouseId, function(items){
							item.operationTypes = items;
						});
					}
				});
			});
		}
		
	}
})(angular.module('lightpro'));