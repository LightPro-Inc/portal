
(function(app){
	'use strict';
	
	app.controller('editArticleCtrl', editArticleCtrl);
	
	editArticleCtrl.$inject = ['data', '$uibModalInstance', 'apiService', 'notificationService'];
	function editArticleCtrl(data, $uibModalInstance, apiService, notificationService){
		var vm = this;
				
		vm.isNewItem = data.item.id ? false : true;
		vm.item = angular.copy(data.item);			
		
		vm.cancelEdit = cancelEdit;
		vm.saveItem = saveItem;
		
		function saveItem(){
			if(vm.isNewItem){								
				apiService.post('/web/api/article/', vm.item,
						function(response){
							notificationService.displaySuccess("L'article a été créé avec succès!");
							$uibModalInstance.close(response.data);
						},
						function(error){
							notificationService.displayError(error);
						});
			}else{
				apiService.put('/web/api/article/' + vm.item.id, vm.item,
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
				vm.item.quantity = 1;
				vm.title = "Créer un article";
				vm.btnSaveLabel = "Créer";	
				
				apiService.get('/web/api/article-family/' + vm.item.familyId, null, 
						function(response){
							vm.item.family = response.data.name;
							
							apiService.get('/web/api/article-category/' + response.data.categoryId, null, 
									function(response){
										vm.item.mesureUnitShortName = response.data.mesureUnitShortName;				
									}
							);
						}
				);
					
			}else{
				vm.title = "Modifier un article";
				vm.btnSaveLabel = "Modifier";
			}	
		}		
	}
})(angular.module('lightpro'));