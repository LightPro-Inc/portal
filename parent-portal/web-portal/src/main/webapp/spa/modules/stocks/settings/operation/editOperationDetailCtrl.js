(function(app){
	'use strict';
	
	app.controller('editOperationDetailCtrl', editOperationDetailCtrl);
	
	editOperationDetailCtrl.$inject = ['data', '$uibModalInstance', 'apiService', 'notificationService', 'utilityService', 'Guid'];
	function editOperationDetailCtrl(data, $uibModalInstance, apiService, notificationService, utilityService, Guid){
		var vm = this;
		
		vm.isNewItem = data.item ? false : true;
		vm.item = angular.copy(data.item);
		
		vm.cancelEdit = cancelEdit;
		vm.saveItem = saveItem;
		
		function saveItem(){
			vm.item.articleId = vm.articleSelected.id;
			vm.item.article = vm.articleSelected.name;			
			$uibModalInstance.close(vm.item);			
		}
		
		function cancelEdit(){
			$uibModalInstance.dismiss();
		}
		
		this.$onInit = function(){

			if(vm.isNewItem){
				vm.item = {id:Guid.newGuid()};
				vm.title = "Ajouter une ligne d'article";
				vm.btnSaveLabel = "Créer";					
			}else{
				vm.title = "Modifier une ligne d'article";
				vm.btnSaveLabel = "Modifier";
			}	
			
			apiService.get(String.format('/web/api/article'), {}, 
					function(response){
						vm.articles = response.data;	
						
						if(!vm.isNewItem){
							vm.articleSelected = utilityService.findSingle(vm.articles, "id", vm.item.articleId);
						}
					}
			);					
		}
	}
	
})(angular.module('lightpro'));