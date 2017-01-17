(function(app){
	'use strict';
	
	app.controller('editProductCtrl', editProductCtrl);
	
	editProductCtrl.$inject = ['data', '$uibModalInstance', 'apiService', 'notificationService'];
	function editProductCtrl(data, $uibModalInstance, apiService, notificationService){
		var vm = this;
		
		vm.item = angular.copy(data.item);
		vm.isNewItem = data.item ? false : true;
		
		vm.cancelEdit = cancelEdit;
		vm.saveItem = saveItem;
		
		function saveItem(){
			if(vm.isNewItem){
				apiService.post('/web/api/product', vm.item,
						function(response){
							notificationService.displaySuccess("Le produit a été créé avec succès!");
							$uibModalInstance.close(response.data);
						},
						function(error){
							notificationService.displayError(error);
						});
			}else{
				apiService.put('/web/api/product/' + vm.item.id, vm.item,
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
				vm.title = "Créer un produit";
				vm.btnSaveLabel = "Créer";
			}else{
				vm.title = "Modifier un produit";
				vm.btnSaveLabel = "Modifier";
			}
			
			apiService.get('/web/api/mesure-unit', null, 
					function(response){
						vm.mesureUnits = response.data;
					}
			);
		}
		
	}
})(angular.module('lightpro'));