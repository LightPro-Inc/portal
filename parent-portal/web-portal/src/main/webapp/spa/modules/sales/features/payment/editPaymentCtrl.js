(function(app){
	'use strict';
	
	app.controller('editPaymentCtrl', editPaymentCtrl);
	
	editPaymentCtrl.$inject = ['data', '$uibModalInstance', 'apiService', 'notificationService'];
	function editPaymentCtrl(data, $uibModalInstance, apiService, notificationService){
		var vm = this;
		
		vm.dateOptions = {
	            formatYear: 'yy',
	            startingDay: 1
	        };

	    vm.datepicker = { format: 'dd/MM/yyyy' };
	        
		vm.invoiceId = data.item.invoiceId;
		vm.isNewItem = data.item.id ? false : true;
		vm.item = angular.copy(data.item);
		
		vm.cancelEdit = cancelEdit;
		vm.saveItem = saveItem;
		vm.openDatePicker = openDatePicker;
		
		function saveItem() {
			if(vm.isNewItem){
				apiService.post(String.format('/web/api/invoice/{0}/payment', vm.invoiceId), vm.item,
						function(response){
							notificationService.displaySuccess("Le paiement a été créé avec succès!");
							$uibModalInstance.close();
						},
						function(error){
							notificationService.displayError(error);
						});
			}else{
				apiService.put(String.format('/web/api/sales/payment/{0}', vm.item.id), vm.item,
						function(response){
							notificationService.displaySuccess("La modification s'est effectuée avec succès!");
							$uibModalInstance.close();
						},
						function(error){
							notificationService.displayError(error);
						});
			}			
		}
		
		function openDatePicker($event) {
            $event.preventDefault();
            $event.stopPropagation();

            vm.datepicker.opened = true;
        };
        
		function cancelEdit(){
			$uibModalInstance.dismiss();
		}
		
		this.$onInit = function(){

			if(vm.isNewItem){
				vm.title = "Créer un paiement";
				vm.btnSaveLabel = "Créer";					
			}else{
				vm.title = "Modifier un paiement";
				vm.btnSaveLabel = "Modifier";
			}	
			
			apiService.get(String.format('/web/api/invoice/{0}', vm.invoiceId), {}, 
					function(response){
						vm.invoice = response.data;												
					}
			);	
			
			apiService.get(String.format('/web/api/sales/payment/mode'), {}, 
					function(response){
						vm.paymentModes = response.data;												
					}
			);	
		}
	}
	
})(angular.module('lightpro'));