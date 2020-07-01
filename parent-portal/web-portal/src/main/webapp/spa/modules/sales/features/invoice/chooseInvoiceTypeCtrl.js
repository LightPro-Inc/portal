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
			$uibModalInstance.close(vm.cmd);
		}
		
		function cancelEdit(){
			$uibModalInstance.dismiss();
		}
		
		this.$onInit = function(){
			vm.cmd = {typeId : "1", percent: 50, purchaseOrderId: vm.purchaseOrderId};
			
			if(vm.purchaseOrderId){
				apiService.get(String.format('/web/api/purchase-order/{0}', vm.purchaseOrderId), {}, function(response){
					vm.purchaseOrder = response.data;
					vm.cmd.base = vm.purchaseOrder.netCommercial;
				});
			}
		}
	}
	
})(angular.module('lightpro'));