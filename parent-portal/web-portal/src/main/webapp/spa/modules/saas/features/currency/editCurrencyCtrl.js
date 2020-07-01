(function(app){
	'use strict';
	
	app.controller('editCurrencyCtrl', editCurrencyCtrl);
	
	editCurrencyCtrl.$inject = ['data', '$uibModalInstance', 'apiService', 'notificationService'];
	function editCurrencyCtrl(data, $uibModalInstance, apiService, notificationService){
		var vm = this;
		
		vm.isNewItem = data.item ? false : true;
		vm.item = angular.copy(data.item);
		
		vm.cancelEdit = cancelEdit;
		vm.saveItem = saveItem;
		
		function saveItem(){
			if(vm.isNewItem){
				apiService.post('/web/api/currency', vm.item,
						function(response){
							notificationService.displaySuccess("La devise a été créée avec succès!");
							$uibModalInstance.close(response.data);
						},
						function(error){
							
						});
			}else{
				apiService.put(String.format('/web/api/currency/{0}', vm.item.id), vm.item,
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
				vm.item = {precision : 0, after: true};
				vm.title = "Créer une devise";
				vm.btnSaveLabel = "Créer";					
			}else{
				vm.title = "Modifier une devise";
				vm.btnSaveLabel = "Modifier";
			}	
		}
	}
	
})(angular.module('lightpro'));