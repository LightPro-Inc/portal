(function(app){
	'use strict';
	
	app.controller('editSequenceCtrl', editSequenceCtrl);
	
	editSequenceCtrl.$inject = ['data', '$uibModalInstance', 'apiService', 'notificationService'];
	function editSequenceCtrl(data, $uibModalInstance, apiService, notificationService){
		var vm = this;
		
		vm.isNewItem = data.item ? false : true;
		vm.item = angular.copy(data.item);
		
		vm.cancelEdit = cancelEdit;
		vm.saveItem = saveItem;
		
		function saveItem(){
			if(vm.isNewItem){
				apiService.post('/web/api/sequence', vm.item,
						function(response){
							notificationService.displaySuccess("La séquence a été créée avec succès!");
							$uibModalInstance.close(response.data);
						},
						function(error){
							notificationService.displayError(error);
						});
			}else{
				apiService.put(String.format('/web/api/sequence/{0}', vm.item.id), vm.item,
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
				vm.item = {size : 5, step: 1, nextNumber: 1};
				vm.title = "Créer une séquence";
				vm.btnSaveLabel = "Créer";					
			}else{
				vm.title = "Modifier un séquence";
				vm.btnSaveLabel = "Modifier";
			}	
		}
	}
	
})(angular.module('lightpro'));