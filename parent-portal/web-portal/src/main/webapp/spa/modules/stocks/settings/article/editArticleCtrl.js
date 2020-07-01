
(function(app){
	'use strict';
	
	app.controller('editArticleCtrl', editArticleCtrl);
	
	editArticleCtrl.$inject = ['data', '$uibModalInstance', 'apiService', 'notificationService', 'utilityService'];
	function editArticleCtrl(data, $uibModalInstance, apiService, notificationService, utilityService){
		var vm = this;
				
		vm.isNewItem = data.item.id ? false : true;
		vm.item = angular.copy(data.item);			
		
		vm.cancelEdit = cancelEdit;
		vm.saveItem = saveItem;
		vm.familyChanged = familyChanged;
		
		function familyChanged(familyId){
			
			if(!familyId) {
				vm.item.mesureUnitShortName = undefined;
				return;
			}
			
			var family = utilityService.findSingle(vm.families, "id", familyId);
			vm.item.mesureUnitShortName = family.mesureUnitShortName;
		}
		
		function saveItem(){
			if(vm.isNewItem){								
				apiService.post('/web/api/article/', vm.item,
						function(response){
							notificationService.displaySuccess("L'article a été créé avec succès!");
							$uibModalInstance.close(response.data);
						},
						function(error){
							
						});
			}else{
				apiService.put('/web/api/article/' + vm.item.id, vm.item,
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

			apiService.get('/web/api/article-family', {}, 
					function(response){
						vm.families = response.data;
						
						if(vm.isNewItem){
							vm.item.quantity = 1;
							vm.title = "Créer un article";
							vm.btnSaveLabel = "Créer";	
							
							familyChanged(vm.item.familyId);
								
						}else{
							vm.title = "Modifier un article";
							vm.btnSaveLabel = "Modifier";
						}	
					}
			);	
		}		
	}
})(angular.module('lightpro'));