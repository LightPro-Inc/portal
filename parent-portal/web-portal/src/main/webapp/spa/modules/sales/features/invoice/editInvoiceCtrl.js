(function(app){
	'use strict';
	
	app.controller('editInvoiceCtrl', editInvoiceCtrl);
	
	editInvoiceCtrl.$inject = ['apiService', '$stateParams', 'notificationService', '$rootScope', '$state', '$previousState', '$uibModal', 'utilityService', '$timeout', '$confirm'];
	function editInvoiceCtrl(apiService, $stateParams, notificationService, $rootScope, $state, $previousState, $uibModal, utilityService, $timeout, $confirm){
		var vm = this;
		
		vm.invoiceId = $stateParams.invoiceId;
		
		vm.dateOptions = {
	            formatYear: 'yy',
	            startingDay: 1
	        };

	    vm.datepicker = { format: 'dd/MM/yyyy' };
	    
		vm.cancel = cancel;
		vm.saveItem = saveItem;
		vm.openDatePicker = openDatePicker;		
		
		function openDatePicker($event) {
            $event.preventDefault();
            $event.stopPropagation();

            vm.datepicker.opened = true;
        };
		
		function saveItem() {
			return apiService.put(String.format('/web/api/invoice/{0}', vm.item.id), vm.item,
					function(response){
						close();
						notificationService.displaySuccess("La facture a été modifiée avec succès !");
					},
					function(error){
						notificationService.displayError(error);
					});		
		}
		
		function close(){
			$previousState.go();
		}
		
		function cancel(){
			close();
		}		
		
		this.$onInit = function(){
			
			apiService.get(String.format('/web/api/quotation/payment-condition'), {}, 
					function(response){
						vm.paymentConditions = response.data;
					}
			);
			
			apiService.get(String.format('/web/api/invoice/{0}', vm.invoiceId), null, 
					function(response){
						vm.item = response.data;

						vm.title = String.format("Facture {0} ({1})", vm.item.reference, vm.item.status);
						
						apiService.get(String.format('/web/api/invoice/{0}/product', vm.invoiceId), null, 
								function(response1){
									vm.item.products = response1.data;
								}
						);
					}
			);
		}
	}
	
})(angular.module('lightpro'));