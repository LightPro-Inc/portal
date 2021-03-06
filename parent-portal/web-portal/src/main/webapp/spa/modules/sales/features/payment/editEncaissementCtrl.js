(function(app){
	'use strict';
	
	app.controller('editEncaissementCtrl', editEncaissementCtrl);
	
	editEncaissementCtrl.$inject = ['data', '$uibModalInstance', 'apiService', 'notificationService', 'utilityService', '$timeout', '$confirm'];
	function editEncaissementCtrl(data, $uibModalInstance, apiService, notificationService, utilityService, $timeout, $confirm){
		var vm = this;
		
		vm.dateOptions = {
	            formatYear: 'yy',
	            startingDay: 1
	        };

	    vm.datepicker = { format: 'dd/MM/yyyy' };
	        
		vm.invoiceId = angular.copy(data.invoiceId);	
		vm.item = data.item ? angular.copy(data.item) : {};
		
		vm.close = close;
		vm.saveItem = saveItem;
		vm.openDatePicker = openDatePicker;
		vm.modeChanged = modeChanged;
		vm.provisionChanged = provisionChanged;
		vm.validate = validate;
		vm.isValidated = isValidated;
		vm.deleteItem = deleteItem;
		
		function provisionChanged(provisionId){
			
			if(provisionId){
				var provision = utilityService.findSingle(vm.provisions, 'id', provisionId);
				vm.item.modeId = provision.modeId;
				vm.item.transactionReference = provision.transactionReference;
				modeChanged(vm.item.modeId);
			}else{				
				vm.item.modeId = undefined;
				vm.item.transactionReference = undefined;
				modeChanged(undefined);
			}			
		}
		
		function deleteItem(){
			$confirm({ text: String.format("Souhaitez-vous supprimer le paiement ?", vm.item.reference), title: "Supprimer un paiement", ok: 'Oui', cancel: 'Non' })
        	.then(function () {

        		apiService.remove(String.format("/web/api/sales/payment/{0}", vm.item.id), {},
    					function(response){    						
    						notificationService.displaySuccess(String.format("Le paiement a été supprimé avec succès !"));
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
			
			return vm.item.statusId == 2;
		}
		
		function validate(){
			$confirm({ text: String.format("Souhaitez-vous valider le paiement ?"), title: "Valider un paiement", ok: 'Oui', cancel: 'Non' })
        	.then(function () {
        		apiService.post(String.format('/web/api/invoice/cash-receipt/{0}/validate', vm.item.id), {forcePayment: vm.item.forcePayment},
    					function(response){
    						notificationService.displaySuccess("Le paiement a été validé avec succès!");
    						close();	
    					},
    					function(error){
    						
    					});
        	}, function(){
        		
        	}); 			
		}
		
		function modeChanged(modeId){
			
			vm.modeSelected = {typeId: undefined};
			
			if(modeId){
				$timeout(function(){
					vm.modeSelected = utilityService.findSingle(vm.paymentModes, "id", modeId);					
				});				
			}else{
				vm.item.transactionReference = undefined;
			}			
		}
		
		function saveItem() {
			if(vm.isNewItem){
				apiService.post(String.format('/web/api/invoice/{0}/payment/cash', vm.invoice.id), vm.item,
						function(response){
							vm.item = response.data;
							vm.$onInit();
							notificationService.displaySuccess("Le paiement a été créé avec succès!");							
						},
						function(error){
							
						});
			}else{
				apiService.put(String.format('/web/api/invoice/payment/{0}', vm.item.id), vm.item,
						function(response){
							vm.item = response.data;
							notificationService.displaySuccess("La modification s'est effectuée avec succès!");
						},
						function(error){
							
						});
			}			
		}
		
		function openDatePicker($event) {
            $event.preventDefault();
            $event.stopPropagation();

            vm.datepicker.opened = true;
        };
        
		function close(){
			$uibModalInstance.close();
		}
		
		this.$onInit = function(){

			vm.isNewItem = vm.item.id ? false : true;			
			
			if(vm.isNewItem){
				vm.title = "Créer un encaissement";
				vm.btnSaveLabel = "Créer";			
				
			}else{
				vm.title = "Modifier un encaissement";
				vm.btnSaveLabel = "Modifier";
			}	
			
			apiService.get(String.format('/web/api/invoice/{0}', vm.invoiceId), {}, function(response){
				vm.invoice = response.data;
				
				if(vm.isNewItem){
					vm.item.object = String.format("Encaissement {0}", vm.invoice.title);
					
					apiService.get(String.format('/web/api/customer/{0}/provision/available', vm.invoice.customerId), {}, 
							function(response1){
								vm.provisions = response1.data;		
								
								vm.totalAmountAvailable = 0;
								angular.forEach(vm.provisions, function(pro){
									vm.totalAmountAvailable += pro.availableAmount;
								});
								
							}
					);
				}
			});				
			
			apiService.get(String.format('/web/api/sales/payment/mode'), {}, 
					function(response){
						vm.paymentModes = response.data;
						
						if(vm.isNewItem)
							vm.item.modeId = vm.paymentModes[0].id;
							
						modeChanged(vm.item.modeId);
							
					}
			);	
		}
	}
	
})(angular.module('lightpro'));