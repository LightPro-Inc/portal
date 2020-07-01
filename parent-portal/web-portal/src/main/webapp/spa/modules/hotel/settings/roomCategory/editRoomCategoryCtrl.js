(function(app){
	'use strict';
	
	app.controller('editRoomCategoryCtrl', editRoomCategoryCtrl);
	
	editRoomCategoryCtrl.$inject = ['data', '$uibModalInstance', 'apiService', 'notificationService'];
	function editRoomCategoryCtrl(data, $uibModalInstance, apiService, notificationService){
		var vm = this;
		
		vm.item = data.item ? angular.copy(data.item) : { nightPrice : 0, capacity : 1 };
		vm.isNewItem = data.item ? false : true;
		
		vm.cancelEdit = cancelEdit;
		vm.saveItem = saveItem;
		
		function saveItem(){
			if(vm.isNewItem){
				apiService.post('/web/api/roomCategory', vm.item,
						function(response){
							notificationService.displaySuccess('La catégorie de chambre a été créée avec succès!');
							$uibModalInstance.close(response.data);
						},
						function(error){
							
						});
			}else{
				apiService.put('/web/api/roomCategory/' + vm.item.id, vm.item,
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
				vm.title = "Créer une catégorie de chambre";
				vm.btnSaveLabel = "Créer";
			}else{
				vm.title = "Modifier une catégorie de chambre";
				vm.btnSaveLabel = "Modifier";
			}
		}
		
	}
})(angular.module('lightpro'));