(function(app){
	'use strict';
	
	app.controller('editExerciseCtrl', editExerciseCtrl);
	
	editExerciseCtrl.$inject = ['data', '$uibModalInstance', 'apiService', 'notificationService', '$uibModal'];
	function editExerciseCtrl(data, $uibModalInstance, apiService, notificationService, $uibModal){
		var vm = this;
		
		vm.item = angular.copy(data.item);
		vm.isNewItem = data.item ? false : true;
		
		vm.cancelEdit = cancelEdit;
		vm.saveItem = saveItem;
		
		function saveItem(){
			if(vm.isNewItem){
				apiService.post('/web/api/compta/exercise', vm.item,
						function(response){
							notificationService.displaySuccess("L'exercice a été ouvert avec succès!");
							$uibModalInstance.close(response.data);
						},
						function(error){
							
						});
			}else{
				apiService.put('/web/api/compta/exercise/' + vm.item.id, vm.item,
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
				vm.title = "Ouvrir un exercice";
				vm.btnSaveLabel = "Ouvrir";
			}else{
				vm.title = "Modifier un exercice";
				vm.btnSaveLabel = "Modifier";
				
				vm.item.start = new Date(vm.item.start);
				vm.item.end = new Date(vm.item.end);
			}
		}
		
	}
})(angular.module('lightpro'));