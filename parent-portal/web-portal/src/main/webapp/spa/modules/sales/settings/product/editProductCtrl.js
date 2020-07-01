(function(app){
	'use strict';
	
	app.controller('editProductCtrl', editProductCtrl);
	
	editProductCtrl.$inject = ['data', '$uibModalInstance', 'apiService', 'notificationService', '$uibModal'];
	function editProductCtrl(data, $uibModalInstance, apiService, notificationService, $uibModal){
		var vm = this;
		
		vm.item = angular.copy(data.item);
		vm.isNewItem = data.item ? false : true;
		
		vm.cancelEdit = cancelEdit;
		vm.saveItem = saveItem;
		vm.productTypeChanged = productTypeChanged;
		
		function productTypeChanged(typeId){
			vm.item.id = null;
			vm.item.name = "";
			vm.item.mesureUnitId = "";
			vm.item.barCode = "";
		}
		
		function saveItem(){
			if(vm.isNewItem){
				apiService.post('/web/api/product', vm.item,
						function(response){
							notificationService.displaySuccess("Le produit a été créé avec succès!");
							$uibModalInstance.close(response.data);
						},
						function(error){
							
						});
			}else{
				apiService.put('/web/api/product/' + vm.item.id, vm.item,
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
				vm.item = {typeId : 1, categoryId: data.categoryId};
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
			
			apiService.get('/web/api/product-category', {}, 
					function(response){
						vm.categories = response.data;						
					});
		}
		
	}
})(angular.module('lightpro'));