(function(app){
	'use strict';
	
	app.controller('editPaymentModeCtrl', editPaymentModeCtrl);
	
	editPaymentModeCtrl.$inject = ['data', '$uibModalInstance', 'apiService', 'notificationService'];
	function editPaymentModeCtrl(data, $uibModalInstance, apiService, notificationService){
		var vm = this;
		
		vm.isNewItem = data.item ? false : true;
		vm.item = angular.copy(data.item);
		
		vm.cancelEdit = cancelEdit;
		vm.saveItem = saveItem;
		
		function saveItem(){
			if(vm.isNewItem){
				apiService.post('/web/api/payment-mode', vm.item,
						function(response){
							notificationService.displaySuccess("Le mode de paiement a été créé avec succès!");
							$uibModalInstance.close(response.data);
						},
						function(error){
							
						});
			}else{
				apiService.put(String.format('/web/api/payment-mode/{0}', vm.item.id), vm.item,
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
				vm.item = {rate : 100};
				vm.title = "Créer un mode de paiement";
				vm.btnSaveLabel = "Créer";					
			}else{
				vm.title = "Modifier un mode de paiement";
				vm.btnSaveLabel = "Modifier";
			}	
			
			apiService.get('/web/api/payment-mode/type', {},
					function(response){
						vm.paymentModeTypes = response.data;
					}
			);
		}
	}
	
})(angular.module('lightpro'));