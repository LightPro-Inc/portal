(function(app){
	'use strict';
	
	app.controller('editTeamCtrl', editTeamCtrl);
	
	editTeamCtrl.$inject = ['data', '$uibModalInstance', 'apiService', 'notificationService'];
	function editTeamCtrl(data, $uibModalInstance, apiService, notificationService){
		var vm = this;
		
		vm.item = angular.copy(data.item);
		vm.isNewItem = data.item ? false : true;
		
		vm.cancelEdit = cancelEdit;
		vm.saveItem = saveItem;
		
		function saveItem(){
			if(vm.isNewItem){
				apiService.post('/web/api/sales/team', vm.item,
						function(response){
							notificationService.displaySuccess("L'équipe commerciale a été créée avec succès!");
							$uibModalInstance.close(response.data);
						},
						function(error){
							
						});
			}else{
				apiService.put('/web/api/sales/team/' + vm.item.id, vm.item,
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
				vm.title = "Créer une équipe commerciale";
				vm.btnSaveLabel = "Créer";
			}else{
				vm.title = "Modifier une équipe commericale";
				vm.btnSaveLabel = "Modifier";
			}
		}
		
	}
})(angular.module('lightpro'));