(function(app){
	'use strict';
	
	app.controller('payOrderCtrl', payOrderCtrl);
	
	payOrderCtrl.$inject = ['data', '$uibModalInstance', 'apiService', 'notificationService', 'utilityService', 'Guid', '$scope', '$timeout', '$uibModal'];
	function payOrderCtrl(data, $uibModalInstance, apiService, notificationService, utilityService, Guid, $scope, $timeout, $uibModal){
		var vm = this;		
		
		vm.cancelEdit = cancelEdit;
		vm.saveItem = saveItem;
		vm.modeChanged = modeChanged;
		vm.montantVerseChanged = montantVerseChanged;
		
		function calculateAmount(){
			vm.receipt.montantRembourse = vm.receipt.montantVerse - vm.receipt.totalAmountTtc;
			if(vm.receipt.montantRembourse < 0)
				vm.receipt.montantRembourse = 0;
		}
		
		function montantVerseChanged(montantVerse){
			calculateAmount();
		}
		
		function modeChanged(modeId){
			if(!modeId)
				vm.isBankPaymentMode = false;
			
			vm.isBankPaymentMode = utilityService.findSingle(vm.paymentModes, 'id', modeId).typeId == 2;
		}

		function saveItem(){							
			apiService.post(String.format('/web/api/pdv/session/{0}/order/{1}', vm.sessionId, vm.orderId), vm.receipt,
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

			vm.sessionId = data.sessionId;
			vm.orderId = data.orderId;
			
			apiService.get(String.format(String.format('/web/api/pdv/session/{0}/order/{1}', vm.sessionId, vm.orderId)), {}, 
					function(response){
						vm.order = response.data;
						
						apiService.get(String.format('/web/api/sales/payment/mode'), {}, 
								function(response){
									vm.paymentModes = response.data;
																		
									vm.receipt = { paymentDate: new Date(), totalAmountTtc: vm.order.totalAmountTtc, montantVerse : 0, paymentModeId: vm.paymentModes[0].id, orderId: vm.orderId };	
									
									calculateAmount();
								}
						);												
					}
			);			
		}
	}
	
})(angular.module('lightpro'));