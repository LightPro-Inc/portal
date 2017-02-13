(function(app){
	'use strict';
	
	app.controller('editJournalCtrl', editJournalCtrl);
	
	editJournalCtrl.$inject = ['data', '$uibModalInstance', 'apiService', 'notificationService'];
	function editJournalCtrl(data, $uibModalInstance, apiService, notificationService){
		var vm = this;
		
		vm.item = angular.copy(data.item);
		vm.isNewItem = data.item ? false : true;
		
		vm.cancelEdit = cancelEdit;
		vm.saveItem = saveItem;
		
		function saveItem(){
			if(vm.isNewItem){
				apiService.post('/web/api/compta/journal', vm.item,
						function(response){
							notificationService.displaySuccess("Le journal a été créé avec succès!");
							$uibModalInstance.close(response.data);
						},
						function(error){
							notificationService.displayError(error);
						});
			}else{
				apiService.put('/web/api/compta/journal/' + vm.item.id, vm.item,
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
				vm.title = "Créer un journal";
				vm.btnSaveLabel = "Créer";
			}else{
				vm.title = "Modifier un journal";
				vm.btnSaveLabel = "Modifier";
			}
			
			apiService.get('/web/api/compta/journal/type', null, 
					function(response){
						vm.types = response.data;
					}
			);
		}
		
	}
})(angular.module('lightpro'));