(function(app){
	'use strict';
	
	app.controller('editWarehouseCtrl', editWarehouseCtrl);
	
	editWarehouseCtrl.$inject = ['data', '$uibModalInstance', 'apiService', 'notificationService'];
	function editWarehouseCtrl(data, $uibModalInstance, apiService, notificationService){
		var vm = this;
		
		vm.isNewItem = data.item ? false : true;
		vm.item = angular.copy(data.item);
		
		vm.cancelEdit = cancelEdit;
		vm.saveItem = saveItem;
		
		function saveItem(){
			if(vm.isNewItem){
				apiService.post('/web/api/warehouse', vm.item,
						function(response){
							notificationService.displaySuccess("L'entrepôt a été créé avec succès!");
							$uibModalInstance.close(response.data);
						},
						function(error){
							
						});
			}else{
				apiService.put('/web/api/warehouse/' + vm.item.id, vm.item,
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
				vm.title = "Créer un entrepôt";
				vm.btnSaveLabel = "Créer";					
			}else{
				vm.title = "Modifier un entrepôt";
				vm.btnSaveLabel = "Modifier";
			}	
		}
	}
	
})(angular.module('lightpro'));