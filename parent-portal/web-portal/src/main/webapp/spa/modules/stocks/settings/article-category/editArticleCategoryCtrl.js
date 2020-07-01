(function(app){
	'use strict';
	
	app.controller('editArticleCategoryCtrl', editArticleCategoryCtrl);
	
	editArticleCategoryCtrl.$inject = ['data', '$uibModalInstance', 'apiService', 'notificationService'];
	function editArticleCategoryCtrl(data, $uibModalInstance, apiService, notificationService){
		var vm = this;
		
		vm.item = angular.copy(data.item);
		vm.isNewItem = data.item ? false : true;
		
		vm.cancelEdit = cancelEdit;
		vm.saveItem = saveItem;
		
		function saveItem(){
			if(vm.isNewItem){
				apiService.post('/web/api/article-category', vm.item,
						function(response){
							notificationService.displaySuccess("La catégorie d'article a été créée avec succès!");
							$uibModalInstance.close(response.data);
						},
						function(error){
							
						});
			}else{
				apiService.put('/web/api/article-category/' + vm.item.id, vm.item,
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
				vm.title = "Créer une catégorie d'articles";
				vm.btnSaveLabel = "Créer";
			}else{
				vm.title = "Modifier une catégorie d'articles";
				vm.btnSaveLabel = "Modifier";
			}
			
			apiService.get('/web/api/mesure-unit/quantity', null, 
					function(response){
						vm.mesureUnits = response.data;
					}
			);
		}
		
	}
})(angular.module('lightpro'));