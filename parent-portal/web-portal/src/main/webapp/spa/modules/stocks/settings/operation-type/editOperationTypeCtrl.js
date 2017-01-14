(function(app){
	'use strict';
	
	app.controller('editOperationTypeCtrl', editOperationTypeCtrl);
	
	editOperationTypeCtrl.$inject = ['data', '$uibModalInstance', 'apiService', 'notificationService'];
	function editOperationTypeCtrl(data, $uibModalInstance, apiService, notificationService){
		var vm = this;
		
		vm.warehouseId = data.warehouseId;
		vm.isNewItem = data.item ? false : true;
		vm.item = angular.copy(data.item);
		
		vm.cancelEdit = cancelEdit;
		vm.saveItem = saveItem;
		
		function saveItem() {
			if(vm.isNewItem){
				apiService.post(String.format('/web/api/warehouse/{0}/operation-type', vm.warehouseId), vm.item,
						function(response){
							notificationService.displaySuccess("Le type d'opération a été créé avec succès!");
							$uibModalInstance.close(response.data);
						},
						function(error){
							notificationService.displayError(error);
						});
			}else{
				apiService.put(String.format('/web/api/operation-type/{0}', vm.item.id), vm.item,
						function(response){
							notificationService.displaySuccess("La modification s'est effectuée avec succès!");
							$uibModalInstance.close(vm.item);
						},
						function(error){
							notificationService.displayError(error);
						});
			}			
		}
		
		function cancelEdit(){
			$uibModalInstance.dismiss();
		}
		
		this.$onInit = function(){

			if(vm.isNewItem){
				vm.title = "Créer un type d'opération";
				vm.btnSaveLabel = "Créer";					
			}else{
				vm.title = "Modifier un type d'opération";
				vm.btnSaveLabel = "Modifier";
			}	
			
			apiService.get(String.format('/web/api/warehouse/{0}', vm.warehouseId), {}, 
					function(response){
						vm.warehouse = response.data;												
					}
			);	
			
			apiService.get(String.format('/web/api/warehouse/{0}/location/all', vm.warehouseId), {}, 
					function(response){
						vm.locations = response.data;												
					}
			);
			
			apiService.get(String.format('/web/api/operation-category'), {}, 
					function(response){
						vm.operationCategories = response.data;												
					}
			);
			
			apiService.get(String.format('/web/api/sequence'), {}, 
					function(response){
						vm.sequences = response.data;												
					}
			);
		}
	}
	
})(angular.module('lightpro'));