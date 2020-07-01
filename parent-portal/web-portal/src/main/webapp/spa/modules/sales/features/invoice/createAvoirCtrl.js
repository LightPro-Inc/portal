(function(app){
	'use strict';
	
	app.controller('createAvoirCtrl', createAvoirCtrl);
	
	createAvoirCtrl.$inject = ['data', '$uibModalInstance', 'apiService', 'notificationService'];
	function createAvoirCtrl(data, $uibModalInstance, apiService, notificationService){
		var vm = this;
		
		vm.invoiceId = data.invoiceId;
		vm.cancelEdit = cancelEdit;
		vm.addNew = addNew;
		
		function addNew() {
			var successMsg = "La facture a été créée avec succès !";
			switch (vm.cmd.typeId) {
				case "1":
					apiService.post(String.format('/web/api/invoice/{0}/remise/percent', vm.invoiceId), vm.cmd,
	    					function (response){
								notificationService.displaySuccess(successMsg);
								$uibModalInstance.close(response.data);
	    					}, 
	    					function(error){
	    						
	    					}
	    			);
					break;
				case "2":
					apiService.post(String.format('/web/api/invoice/{0}/rabais', vm.invoiceId), vm.cmd,
	    					function (response){
								notificationService.displaySuccess(successMsg);
								$uibModalInstance.close(response.data);   
	    					}, 
	    					function(error){
	    						
	    					}
	    			);
					break;
				case "3":
					apiService.post(String.format('/web/api/invoice/{0}/ristourne/percent', vm.invoiceId), vm.cmd,
	    					function (response){								
								notificationService.displaySuccess(successMsg);
								$uibModalInstance.close(response.data);
	    					}, 
	    					function(error){
	    						
	    					}
	    			);
					break;
				case "4":
					apiService.post(String.format('/web/api/invoice/{0}/escompte', vm.invoiceId), vm.cmd,
	    					function (response){								
								notificationService.displaySuccess(successMsg);
								$uibModalInstance.close(response.data);
	    					}, 
	    					function(error){
	    						
	    					}
	    			);
					break;
				case "5":
					apiService.post(String.format('/web/api/invoice/{0}/avoir-annulation', vm.invoiceId), vm.cmd,
	    					function (response){								
								notificationService.displaySuccess(successMsg);
								$uibModalInstance.close(response.data);
	    					}, 
	    					function(error){
	    						
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
			vm.cmd = {typeId : "1", orderDate: new Date()};
			
			apiService.get(String.format('/web/api/invoice/{0}', vm.invoiceId), {}, function(response){
				vm.invoice = response.data;
				vm.cmd.baseHt = vm.invoice.totalAmountHt;
				vm.cmd.baseNetCommercial = vm.invoice.netCommercial;
			});
		}
	}
	
})(angular.module('lightpro'));