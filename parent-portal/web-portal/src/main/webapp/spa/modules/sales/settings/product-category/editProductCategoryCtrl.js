(function(app){
	'use strict';
	
	app.controller('editProductCategoryCtrl', editProductCategoryCtrl);
	
	editProductCategoryCtrl.$inject = ['data', '$uibModalInstance', 'apiService', 'notificationService', '$uibModal'];
	function editProductCategoryCtrl(data, $uibModalInstance, apiService, notificationService, $uibModal){
		var vm = this;
		
		vm.item = angular.copy(data.item);
		vm.isNewItem = data.item ? false : true;
		
		vm.cancelEdit = cancelEdit;
		vm.saveItem = saveItem;
		
		function saveItem(){
			if(vm.isNewItem){
				apiService.post('/web/api/product-category', vm.item,
						function(response){
							notificationService.displaySuccess("La catégorie a été créée avec succès!");
							$uibModalInstance.close(response.data);
						},
						function(error){
							
						});
			}else{
				apiService.put('/web/api/product-category/' + vm.item.id, vm.item,
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
				vm.title = "Créer une catégorie de produit";
				vm.btnSaveLabel = "Créer";
			}else{
				vm.title = "Modifier une catégorie de produit";
				vm.btnSaveLabel = "Modifier";
			}	
			
			apiService.get('/web/api/product-category/type', {}, 
					function(response){
						vm.types = response.data;
					}
			);
		}
		
	}
})(angular.module('lightpro'));