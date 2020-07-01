(function(app){
	'use strict';
	
	app.controller('editLocationCtrl', editLocationCtrl);
	
	editLocationCtrl.$inject = ['data', '$uibModalInstance', 'apiService', 'notificationService'];
	function editLocationCtrl(data, $uibModalInstance, apiService, notificationService){
		var vm = this;
		
		vm.warehouseId = data.warehouseId;
		vm.isNewItem = data.item ? false : true;
		vm.item = angular.copy(data.item);
		
		vm.cancelEdit = cancelEdit;
		vm.saveItem = saveItem;
		
		function saveItem(){
			if(vm.isNewItem){
				apiService.post(String.format('/web/api/warehouse/{0}/location', vm.warehouseId), vm.item,
						function(response){
							notificationService.displaySuccess("L'emplacement a été créé avec succès!");
							$uibModalInstance.close(response.data);
						},
						function(error){
							
						});
			}else{
				apiService.put(String.format('/web/api/location/{0}', vm.item.id), vm.item,
						function(response){
							notificationService.displaySuccess("La modification s'est effectuée avec succès!");
							$uibModalInstance.close(vm.item);
						},
						function(error){
							
						});
			}			
		}
		
		function cancelEdit(){
			$uibModalInstance.dismiss();
		}
		
		this.$onInit = function(){

			if(vm.isNewItem){
				vm.item = {active : true};
				vm.title = "Créer un emplacement";
				vm.btnSaveLabel = "Créer";					
			}else{
				vm.title = "Modifier un emplacement";
				vm.btnSaveLabel = "Modifier";
			}	
			
			apiService.get(String.format('/web/api/warehouse/{0}', vm.warehouseId), {}, 
					function(response){
						vm.warehouse = response.data;												
					}
			);					
		}
	}
	
})(angular.module('lightpro'));