(function(app){
	'use strict';
	
	app.controller('chooseInvoiceTypeCtrl', chooseInvoiceTypeCtrl);
	
	chooseInvoiceTypeCtrl.$inject = ['data', '$uibModalInstance', 'apiService', 'notificationService'];
	function chooseInvoiceTypeCtrl(data, $uibModalInstance, apiService, notificationService){
		var vm = this;
		
		vm.purchaseOrderId = data.purchaseOrderId;
		vm.cancelEdit = cancelEdit;
		vm.confirm = confirm;
		
		function confirm() {
			switch (vm.cmd.typeId) {
				case "1":
					apiService.post(String.format('/web/api/purchase-order/{0}/invoice/final', vm.purchaseOrderId), {},
	    					function (response){
								$uibModalInstance.close(response.data);
	    						notificationService.displaySuccess("La facture a été créée avec succès !");   
	    					}, 
	    					function(error){
	    						notificationService.displayError(error);
	    					}
	    			);
					break;
				case "2":
					apiService.post(String.format('/web/api/purchase-order/{0}/invoice/down-payment/amount', vm.purchaseOrderId), vm.cmd,
	    					function (response){
								$uibModalInstance.close(response.data);
	    						notificationService.displaySuccess("La facture a été créée en mode Brouillon !");   
	    					}, 
	    					function(error){
	    						notificationService.displayError(error);
	    					}
	    			);
					break;
				case "3":
					apiService.post(String.format('/web/api/purchase-order/{0}/invoice/down-payment/percent', vm.purchaseOrderId), vm.cmd,
	    					function (response){								
								$uibModalInstance.close(response.data);
	    						notificationService.displaySuccess("La facture a été créée en mode Brouillon !");   
	    					}, 
	    					function(error){
	    						notificationService.displayError(error);
	    					}
	    			);
					break;
				default:
					break;
			}
		}
		
		function cancelEdit(){
			$uibModalInstance.dismiss();
		}
		
		this.$onInit = function(){
			vm.cmd = {typeId : "1", withTax: false};
		}
	}
	
})(angular.module('lightpro'));