(function(app){
	'use strict';
	
	app.controller('editPdvSettingsCtrl', editPdvSettingsCtrl);
	
	editPdvSettingsCtrl.$inject = ['data', '$uibModalInstance', 'apiService', 'notificationService'];
	function editPdvSettingsCtrl(data, $uibModalInstance, apiService, notificationService){
		var vm = this;
		
		vm.isNewItem = data.item ? false : true;
		vm.item = angular.copy(data.item);
		
		vm.cancelEdit = cancelEdit;
		vm.saveItem = saveItem;
		
		function saveItem() {
			if(vm.isNewItem){
				apiService.post(String.format('/web/api/pdv/pdv'), vm.item,
						function(response){
							notificationService.displaySuccess("Le point de vente a été créé avec succès!");
							$uibModalInstance.close(response.data);
						},
						function(error){
							notificationService.displayError(error);
						});
			}else{
				apiService.put(String.format('/web/api/pdv/pdv/{0}', vm.item.id), vm.item,
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
				vm.title = "Créer un point de vente";
				vm.btnSaveLabel = "Créer";					
			}else{
				vm.title = "Modifier un point de vente";
				vm.btnSaveLabel = "Modifier";
			}	
		}
	}
	
})(angular.module('lightpro'));