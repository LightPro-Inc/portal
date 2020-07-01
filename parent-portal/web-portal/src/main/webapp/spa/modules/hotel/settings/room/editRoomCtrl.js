(function(app){
	'use strict';
	
	app.controller('editRoomCtrl', editRoomCtrl);
	
	editRoomCtrl.$inject = ['data', '$uibModalInstance', 'apiService', 'notificationService'];
	function editRoomCtrl(data, $uibModalInstance, apiService, notificationService){
		var vm = this;
				
		vm.isNewItem = data.item.id ? false : true;
		vm.item = angular.copy(data.item);			
		
		vm.cancelEdit = cancelEdit;
		vm.saveItem = saveItem;
		
		function saveItem(){
			if(vm.isNewItem){
				apiService.post('/web/api/roomCategory/' + vm.item.categoryId + '/room', vm.item,
						function(response){
							notificationService.displaySuccess('La chambre a été créée avec succès!');
							$uibModalInstance.close(response.data);
						},
						function(error){
							
						});
			}else{
				apiService.put('/web/api/room/' + vm.item.id, vm.item,
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
				vm.item.floorId = "RC";
				
				vm.title = "Créer une chambre";
				vm.btnSaveLabel = "Créer";	
				
				apiService.get('/web/api/roomCategory/' + vm.item.categoryId, null, 
						function(response){
							vm.item.category = response.data.name;
						}
				);
			}else{
				vm.title = "Modifier une chambre";
				vm.btnSaveLabel = "Modifier";
			}
			
			apiService.get('/web/api/room/floor', null, 
							function(response){
								vm.floors = response.data;
							}
			);
					
		}
		
	}
})(angular.module('lightpro'));