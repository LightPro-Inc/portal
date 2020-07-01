(function(app){
	'use strict';
	
	app.controller('editMesureUnitCtrl', editMesureUnitCtrl);
	
	editMesureUnitCtrl.$inject = ['data', '$uibModalInstance', 'apiService', 'notificationService'];
	function editMesureUnitCtrl(data, $uibModalInstance, apiService, notificationService){
		var vm = this;
		
		vm.isNewItem = data.item ? false : true;
		vm.item = angular.copy(data.item);
		
		vm.cancelEdit = cancelEdit;
		vm.saveItem = saveItem;
		
		function saveItem(){
			if(vm.isNewItem){
				apiService.post('/web/api/mesure-unit/', vm.item,
						function(response){
							notificationService.displaySuccess("L'unité de mesure a été créée avec succès!");
							$uibModalInstance.close(response.data);
						},
						function(error){
							
						});
			}else{
				apiService.put('/web/api/mesure-unit/' + vm.item.id, vm.item,
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
				vm.title = "Créer une unité de mesure";
				vm.btnSaveLabel = "Créer";					
			}else{
				vm.title = "Modifier une unité de mesure";
				vm.btnSaveLabel = "Modifier";
			}	
			
			apiService.get(String.format('/web/api/mesure-unit/type'), {}, 
					function(response){
						vm.mesureUnitTypes = response.data;
					}
			);
		}
	}
	
})(angular.module('lightpro'));