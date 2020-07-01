(function(app){
	'use strict';
	
	app.controller('editPieceTypeCtrl', editPieceTypeCtrl);
	
	editPieceTypeCtrl.$inject = ['data', '$uibModalInstance', 'apiService', 'notificationService', '$uibModal'];
	function editPieceTypeCtrl(data, $uibModalInstance, apiService, notificationService, $uibModal){
		var vm = this;
		
		vm.item = angular.copy(data.item);
		vm.isNewItem = data.item ? false : true;
		
		vm.cancelEdit = cancelEdit;
		vm.saveItem = saveItem;
		vm.modifySequence = modifySequence;
		vm.searchSequence = searchSequence;
		
		function searchSequence(){
			$uibModal.open({
                templateUrl: 'modules/admin/settings/sequence/sequenceSearchView.html',
                controller: 'sequenceSearchCtrl as vm',
                size : 'lg',
                resolve: {
                    data: {}
                }
            }).result.then(function (itemChoosed) {
            	vm.item.sequence = itemChoosed.name;
            	vm.item.sequenceId = itemChoosed.id;
            }, function () {

            });
		}
		
		function modifySequence(sequenceId){
			apiService.get(String.format('/web/api/sequence/{0}', sequenceId), {}, 
					function(response){
						$uibModal.open({
			                templateUrl: 'modules/admin/settings/sequence/editSequenceView.html',
			                controller: 'editSequenceCtrl as vm',
			                size : 'md',
			                resolve: {
			                    data: {item : response.data}
			                }
			            }).result.then(function (itemChoosed) {
			            	vm.item.sequence = itemChoosed.name;
			            }, function () {
		
			            });
					},
					function(error){
						
					}
			);			
		}
		
		function saveItem(){
			if(vm.isNewItem){
				apiService.post('/web/api/compta/piece-type', vm.item,
						function(response){
							notificationService.displaySuccess("Le type de pièce a été créé avec succès!");
							$uibModalInstance.close(response.data);
						},
						function(error){
							
						});
			}else{
				apiService.put('/web/api/compta/piece-type/' + vm.item.id, vm.item,
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
				vm.title = "Créer un type de pièce";
				vm.btnSaveLabel = "Créer";
			}else{
				vm.title = "Modifier un type de pièce";
				vm.btnSaveLabel = "Modifier";
				
				apiService.get(String.format('/web/api/compta/piece-type/{0}/trame', vm.item.id), {}, 
						function(response){
							vm.trames = response.data;
						}
				);
			}
						
			apiService.get('/web/api/compta/tiers/type', {}, 
					function(response){
						vm.tiersTypes = response.data;
					}
			);
			
			apiService.get('/web/api/compta/piece-type/nature', {}, 
					function(response){
						vm.natures = response.data;
					}
			);
		}
		
	}
})(angular.module('lightpro'));