(function(app){
	'use strict';
	
	app.controller('editTaxCtrl', editTaxCtrl);
	
	editTaxCtrl.$inject = ['data', '$uibModalInstance', 'apiService', 'notificationService'];
	function editTaxCtrl(data, $uibModalInstance, apiService, notificationService){
		var vm = this;
		
		vm.isNewItem = data.item ? false : true;
		vm.item = angular.copy(data.item);
		
		vm.cancelEdit = cancelEdit;
		vm.saveItem = saveItem;
		
		function saveItem(){
			if(vm.isNewItem){
				apiService.post('/web/api/tax', vm.item,
						function(response){
							notificationService.displaySuccess("La taxe a été créée avec succès!");
							$uibModalInstance.close(response.data);
						},
						function(error){
							notificationService.displayError(error);
						});
			}else{
				apiService.put(String.format('/web/api/tax/{0}', vm.item.id), vm.item,
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
				vm.item = {rate : 100};
				vm.title = "Créer une taxe";
				vm.btnSaveLabel = "Créer";					
			}else{
				vm.title = "Modifier une taxe";
				vm.btnSaveLabel = "Modifier";
			}	
		}
	}
	
})(angular.module('lightpro'));