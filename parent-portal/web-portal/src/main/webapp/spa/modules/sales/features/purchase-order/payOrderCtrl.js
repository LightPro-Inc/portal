(function(app){
	'use strict';
	
	app.controller('payPurchaseOrderCtrl', payPurchaseOrderCtrl);
	
	payPurchaseOrderCtrl.$inject = ['data', '$uibModalInstance', 'apiService', 'notificationService', 'utilityService', 'Guid', '$scope', '$timeout', '$uibModal'];
	function payPurchaseOrderCtrl(data, $uibModalInstance, apiService, notificationService, utilityService, Guid, $scope, $timeout, $uibModal){
		var vm = this;		
		
		vm.receipt = data.item ? angular.copy(data.item) : {};
		
		vm.cancelEdit = cancelEdit;
		vm.saveItem = saveItem;
		vm.modeChanged = modeChanged;
		vm.montantVerseChanged = montantVerseChanged;
		
		function calculateAmount(){
			vm.receipt.montantRembourse = vm.receipt.paidAmount - vm.receipt.totalAmountTtc;
			if(vm.receipt.montantRembourse < 0)
				vm.receipt.montantRembourse = 0;
		}
		
		function montantVerseChanged(paidAmount){
			calculateAmount();
		}
		
		function modeChanged(modeId){
			if(!modeId)
				vm.isBankPaymentMode = false;
			
			vm.isBankPaymentMode = utilityService.findSingle(vm.paymentModes, 'id', modeId).typeId == 2;
		}

		function saveItem(){							
			apiService.post(String.format('/web/api/purchase-order/{0}/payment/cash', vm.orderId), vm.receipt,
					  function(response){
					  	notificationService.displaySuccess("Paiement de la commande réalisée avec succès!");
					  	$uibModalInstance.close(response.data);
					  },function(error){
						  						  
					  }
			  );
		}
		
		function cancelEdit(){
			$uibModalInstance.dismiss();
		}		
		
		this.$onInit = function(){

			vm.orderId = data.orderId;
			
			vm.isNewItem = vm.receipt.id ? false : true;			
			
			if(vm.isNewItem){
				vm.title = "Régler la commande";
				vm.btnSaveLabel = "Créer";			
				
				apiService.get(String.format(String.format('/web/api/purchase-order/{0}', vm.orderId)), {}, 
						function(response){
							vm.order = response.data;
							
							apiService.get(String.format('/web/api/sales/payment/mode'), {}, 
									function(response){
										vm.paymentModes = response.data;
												
											vm.receipt = { object: String.format("Encaissement {0}", vm.order.title), paymentDate: new Date(), totalAmountTtc: vm.order.totalAmountTtc, paidAmount : 0, modeId: vm.paymentModes[0].id, orderId: vm.orderId };
										
										calculateAmount();
									}
							);												
						}
				);			
			}else{
				vm.title = "Ticket de caisse";
				vm.btnSaveLabel = "Modifier";
				
				apiService.get(String.format(String.format('/web/api/purchase-order/{0}', vm.orderId)), {}, 
						function(response){
							vm.order = response.data;
							vm.receipt.orderId = vm.order.id;
							vm.receipt.totalAmountTtc = vm.order.totalAmountTtc;
							calculateAmount();
							
							apiService.get(String.format('/web/api/sales/payment/mode'), {}, 
									function(response){
										vm.paymentModes = response.data;																			
									}
							);												
						}
				);			
			}				
		}
	}
	
})(angular.module('lightpro'));