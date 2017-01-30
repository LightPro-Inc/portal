(function(app){
	'use strict';
	
	app.controller('editQuotationCtrl', editQuotationCtrl);
	
	editQuotationCtrl.$inject = ['apiService', '$stateParams', 'notificationService', '$rootScope', '$state', '$previousState', '$uibModal', 'utilityService', '$timeout', '$confirm'];
	function editQuotationCtrl(apiService, $stateParams, notificationService, $rootScope, $state, $previousState, $uibModal, utilityService, $timeout, $confirm){
		var vm = this;
		
		vm.quotationId = $stateParams.quotationId;
		vm.markSend = markSend;
		vm.markSold = markSold;
		
		vm.dateOptions = {
	            formatYear: 'yy',
	            startingDay: 1
	        };

	    vm.datepicker = { format: 'dd/MM/yyyy' };
	    vm.expirationDatepicker = { format: 'dd/MM/yyyy' };
	    
		vm.cancel = cancel;
		vm.saveItem = saveItem;
		vm.openDatePicker = openDatePicker;
		vm.openExpirationDatePicker = openExpirationDatePicker;
		vm.searchCustomer = searchCustomer;
		vm.modifyCustomer = modifyCustomer;
		vm.addNewOrderProduct = addNewOrderProduct;
		vm.modifyOrderProduct = modifyOrderProduct;
		vm.deleteOrderProduct = deleteOrderProduct;
		vm.getTotalAmountHt = getTotalAmountHt;
		vm.getTotalTaxAmount = getTotalTaxAmount;
		vm.getTotalAmountTtc = getTotalAmountTtc;
		
		function getTotalAmountHt(){
			if(!(vm.item && vm.item.products))
				return;
			
			var amount = 0;
			
			angular.forEach(vm.item.products, function(product){
				amount += product.totalAmountHt;
			});
			
			return amount;
		}
		
		function getTotalAmountTtc(){
			if(!(vm.item && vm.item.products))
					return;
			
			var amount = 0;
			
			angular.forEach(vm.item.products, function(product){
				amount += product.totalAmountTtc;
			});
			
			return amount;
		}
		
		function getTotalTaxAmount(){
			if(!(vm.item && vm.item.products))
				return;
			
			var amount = 0;
			
			angular.forEach(vm.item.products, function(product){
				amount += product.totalTaxAmount;
			});
			
			return amount;
		}
		
		function deleteOrderProduct(item){
			item.deleted = true;
		}
		
		function addNewOrderProduct(){
			editOrderProduct(null,function(itemAdded){
				vm.item.products.push(itemAdded);
			});
		}
		
		function modifyOrderProduct(item){
			editOrderProduct(item,function(itemModified){
				utilityService.replace(vm.item.products, item, itemModified, 'id');
			});
		}
		
		function editOrderProduct(item, callback){
			$uibModal.open({
                templateUrl: 'modules/sales/features/quotation/editOrderProductView.html',
                controller: 'editOrderProductCtrl as vm',
                resolve: {
                    data: {
                    	item : item,
                    	orderDate: vm.item.orderDate
                    }
                }
            }).result.then(function (itemEdited) {
            	if(callback)
            		callback(itemEdited);
            }, function () {

            });
		}
		
		function modifyCustomer(customerId){
			apiService.get(String.format('/web/api/customer/{0}', customerId), {}, 
					function(response){
						$uibModal.open({
			                templateUrl: 'modules/sales/features/customer/editCustomerView.html',
			                controller: 'editCustomerCtrl as vm',
			                size : 'lg',
			                resolve: {
			                    data: {item : response.data}
			                }
			            }).result.then(function (itemChoosed) {
			            	vm.item.customer = itemChoosed.fullName;
			            }, function () {
		
			            });
					},
					function(error){
						notificationService.displayError(error);
					}
			);			
		}
		
		function searchCustomer(){
			$uibModal.open({
                templateUrl: 'modules/sales/features/customer/customerSearchView.html',
                controller: 'customerSearchCtrl as vm',
                size : 'lg',
                resolve: {
                    data: {}
                }
            }).result.then(function (itemChoosed) {
            	vm.item.customer = itemChoosed.fullName;
            	vm.item.customerId = itemChoosed.id;
            }, function () {

            });
		}
		
		function openDatePicker($event) {
            $event.preventDefault();
            $event.stopPropagation();

            vm.datepicker.opened = true;
        };
        
        function openExpirationDatePicker($event) {
            $event.preventDefault();
            $event.stopPropagation();

            vm.expirationDatepicker.opened = true;
        };
		
		function saveItem() {
			if(vm.isNewItem){
				
				vm.item.sellerId = $rootScope.repository.loggedUser.id;					
				
				return apiService.post(String.format('/web/api/quotation/'), vm.item,
						function(response){
							close();
							notificationService.displaySuccess("Le dévis a été créé avec succès !");
						},
						function(error){							
							notificationService.displayError(error);
						});
			}else{
				return apiService.put(String.format('/web/api/quotation/{0}', vm.item.id), vm.item,
						function(response){
							close();
							notificationService.displaySuccess("Le dévis a été modifié avec succès !");
						},
						function(error){
							notificationService.displayError(error);
						});
			}		
		}
		
		function close(){
			$previousState.go();
		}
		
		function cancel(){
			close();
		}
		
		function markSend(){
			$confirm({ text: String.format("Souhaitez-vous marquer envoyé le dévis {0} ?", vm.item.reference), title: "Marquer un devis envoyé", ok: 'Oui', cancel: 'Non' })
        	.then(function () {

        		apiService.post(String.format('/web/api/quotation/{0}/mark-send', vm.quotationId), {},
    					function(response){
    						close();
    						notificationService.displaySuccess("Le dévis a été marqué envoyé avec succès !");
    					},
    					function(error){							
    						notificationService.displayError(error);
    					});
        	}); 			
		}
		
		function markSold(){
			$confirm({ text: String.format("Souhaitez-vous confirmer la vente pour le dévis {0} ?", vm.item.reference), title: "Confirmation de vente", ok: 'Oui', cancel: 'Non' })
        	.then(function () {

        		apiService.post(String.format('/web/api/quotation/{0}/mark-sold', vm.quotationId), {},
    					function(response){
    						close();
    						notificationService.displaySuccess("La confirmation de vente a été effectuée avec succès ! Pour poursuivre les opérations, rendez-vous dans le menu Bons de commande.");
    					},
    					function(error){							
    						notificationService.displayError(error);
    					});
        	}); 			
		}
		
		this.$onInit = function(){
			
			vm.isNewItem = vm.quotationId ? false : true;
			
			apiService.get(String.format('/web/api/quotation/payment-condition'), {}, 
					function(response){
						vm.paymentConditions = response.data;

						if(vm.isNewItem){							
							vm.title = "Nouveau devis";	

							vm.item = { products : [], orderDate: moment(new Date()).format('YYYY-MM-DD')};
						}else{														
							apiService.get(String.format('/web/api/quotation/{0}', vm.quotationId), null, 
									function(response){
										vm.item = response.data;

										vm.title = String.format("Modifier le devis {0} ({1})", vm.item.reference, vm.item.status);
										
										apiService.get(String.format('/web/api/quotation/{0}/product', vm.quotationId), null, 
												function(response1){
													vm.item.products = response1.data;
												}
										);
									}
							);
						}	
					}
			);
		}
	}
	
})(angular.module('lightpro'));