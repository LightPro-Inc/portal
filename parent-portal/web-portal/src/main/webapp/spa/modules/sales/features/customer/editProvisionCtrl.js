(function(app){
	'use strict';
	
	app.controller('editProvisionCtrl', editProvisionCtrl);
	
	editProvisionCtrl.$inject = ['data', '$uibModalInstance', 'apiService', 'notificationService', 'utilityService', '$timeout', '$confirm', '$uibModal'];
	function editProvisionCtrl(data, $uibModalInstance, apiService, notificationService, utilityService, $timeout, $confirm, $uibModal){
		var vm = this;
	        
		vm.customerId = data.customerId;		
		vm.item = angular.copy(data.item);
		
		vm.close = close;
		vm.saveItem = saveItem;
		vm.validate = validate;
		vm.isValidated = isValidated;
		vm.deleteItem = deleteItem;
		vm.searchPayment = searchPayment;
		
		function searchPayment(){
			$uibModal.open({
                templateUrl: 'modules/sales/features/payment/paymentSearchView.html',
                controller: 'paymentSearchCtrl as vm',
                size: 'lg',
                resolve: {
                    data: {
                    	customerId: vm.customerId
                    }
                }
            }).result.then(function (itemSelected) {
            	vm.item.originPayment = itemSelected.reference;
            	vm.item.originPaymentId = itemSelected.id;
            }, function () {

            });
		}
		
		function deleteItem(){
			$confirm({ text: String.format("Souhaitez-vous supprimer la provision ?"), title: "Supprimer une provision", ok: 'Oui', cancel: 'Non' })
        	.then(function () {

        		apiService.remove(String.format("/web/api/sales/provision/{0}", vm.item.id), {},
    					function(response){    						
    						notificationService.displaySuccess(String.format("La provision a été supprimée avec succès !"));
    						close();
    					},
    					function(error){
    						
    					}
    			);
        	});  	
		}
		
		function isValidated(){
			if(!vm.item)
				return;
			
			return vm.item.statusId > 1;
		}
		
		function validate(){
			$confirm({ text: String.format("Souhaitez-vous valider la provision ?"), title: "Valider une provision", ok: 'Oui', cancel: 'Non' })
        	.then(function () {
        		apiService.post(String.format('/web/api/sales/provision/{0}/validate', vm.item.id), {},
    					function(response){
    						notificationService.displaySuccess("La provision a été validée avec succès!");
    						close();	
    					},
    					function(error){
    						
    					});
        	}, function(){
        		
        	}); 			
		}
		
		function saveItem() {
			if(vm.isNewItem){
				apiService.post(String.format('/web/api/sales/payment/{0}/provision', vm.item.originPaymentId), {amount: vm.item.amount},
						function(response){
							vm.item = response.data;
							
							vm.$onInit();
							notificationService.displaySuccess("La provision a été créée avec succès!");							
						},
						function(error){
							
						});
			}else{
				apiService.put(String.format('/web/api/sales/provision/{0}', vm.item.id), {amount: vm.item.amount},
						function(response){
							vm.item = response.data;
							notificationService.displaySuccess("La modification s'est effectuée avec succès!");
						},
						function(error){
							
						});
			}			
		}
        
		function close(){
			$uibModalInstance.close();
		}
		
		this.$onInit = function(){
			vm.isNewItem = vm.item ? false : true;
			
			if(vm.isNewItem){
				vm.title = "Créer une provision";
				vm.btnSaveLabel = "Créer";	
				vm.item = {};
				
			}else{
				vm.title = "Modifier une provision";
				vm.btnSaveLabel = "Modifier";
			}	
		}
	}
	
})(angular.module('lightpro'));