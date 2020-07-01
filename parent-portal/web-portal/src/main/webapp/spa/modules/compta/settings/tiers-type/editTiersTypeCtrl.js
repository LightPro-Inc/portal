(function(app){
	'use strict';
	
	app.controller('editTiersTypeCtrl', editTiersTypeCtrl);
	
	editTiersTypeCtrl.$inject = ['data', '$uibModalInstance', 'apiService', 'notificationService', '$uibModal'];
	function editTiersTypeCtrl(data, $uibModalInstance, apiService, notificationService, $uibModal){
		var vm = this;
		
		vm.item = angular.copy(data.item);
		vm.isNewItem = data.item ? false : true;
		
		vm.cancelEdit = cancelEdit;
		vm.saveItem = saveItem;
		vm.searchAccount = searchAccount;
		vm.searchSequence = searchSequence;
		vm.searchSequenceLettrage = searchSequenceLettrage;
		vm.modifySequence = modifySequence;
		vm.modifySequenceLettrage = modifySequenceLettrage;
		
		function modifySequenceLettrage(sequenceId){
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
			            	vm.item.sequenceLettrage = itemChoosed.name;
			            }, function () {
		
			            });
					},
					function(error){
						
					}
			);			
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
		
		function searchSequenceLettrage(){
			$uibModal.open({
                templateUrl: 'modules/admin/settings/sequence/sequenceSearchView.html',
                controller: 'sequenceSearchCtrl as vm',
                size : 'lg',
                resolve: {
                    data: {}
                }
            }).result.then(function (itemChoosed) {
            	vm.item.sequenceLettrage = itemChoosed.name;
            	vm.item.sequenceLettrageId = itemChoosed.id;
            }, function () {

            });
		}
		
		function searchAccount(){
			$uibModal.open({
                templateUrl: 'modules/compta/settings/chart/accountSearchView.html',
                controller: 'accountSearchCtrl as vm',
                size: 'lg',
                resolve: {
                    data: { }
                }
            }).result.then(function (selected) {
            	vm.item.generalAccount = selected.fullName; 
            	vm.item.generalAccountId = selected.id;
            }, function () {

            }); 
		}
		
		function saveItem(){
			if(vm.isNewItem){
				apiService.post('/web/api/compta/tiers/type', vm.item,
						function(response){
							notificationService.displaySuccess("Le type de tiers a été créé avec succès!");
							$uibModalInstance.close(response.data);
						},
						function(error){
							
						});
			}else{
				apiService.put('/web/api/compta/tiers/type/' + vm.item.id, vm.item,
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
				vm.title = "Créer un type de tiers";
				vm.btnSaveLabel = "Créer";
			}else{
				vm.title = "Modifier un type de tiers";
				vm.btnSaveLabel = "Modifier";
			}
		}
		
	}
})(angular.module('lightpro'));