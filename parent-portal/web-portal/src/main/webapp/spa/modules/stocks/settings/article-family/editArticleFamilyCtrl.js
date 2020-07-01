
(function(app){
	'use strict';
	
	app.controller('editArticleFamilyCtrl', editArticleFamilyCtrl);
	
	editArticleFamilyCtrl.$inject = ['data', '$uibModalInstance', 'apiService', 'notificationService'];
	function editArticleFamilyCtrl(data, $uibModalInstance, apiService, notificationService){
		var vm = this;
				
		vm.isNewItem = data.item.id ? false : true;
		vm.item = angular.copy(data.item);			
		
		vm.cancelEdit = cancelEdit;
		vm.saveItem = saveItem;
		
		function saveItem(){
			if(vm.isNewItem){
				apiService.post('/web/api/article-family', vm.item,
						function(response){
							notificationService.displaySuccess("La famille d'article a été créée avec succès!");
							$uibModalInstance.close(response.data);
						},
						function(error){
							
						});
			}else{
				apiService.put('/web/api/article-family/' + vm.item.id, vm.item,
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
				vm.title = "Créer une famille d'article";
				vm.btnSaveLabel = "Créer";	
					
			}else{
				vm.title = "Modifier une famille d'article";
				vm.btnSaveLabel = "Modifier";
			}
			
			apiService.get('/web/api/article-category', {}, 
					function(response){
						vm.categories = response.data;
					}
			);
		}
		
	}
})(angular.module('lightpro'));