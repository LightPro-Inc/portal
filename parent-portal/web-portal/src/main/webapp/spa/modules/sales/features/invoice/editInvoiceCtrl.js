(function(app){
	'use strict';
	
	app.controller('editInvoiceCtrl', editInvoiceCtrl);
	
	editInvoiceCtrl.$inject = ['apiService', '$stateParams', 'notificationService', '$rootScope', '$state', '$previousState', '$uibModal', 'utilityService', '$timeout', '$confirm'];
	function editInvoiceCtrl(apiService, $stateParams, notificationService, $rootScope, $state, $previousState, $uibModal, utilityService, $timeout, $confirm){
		var vm = this;
		
		vm.invoiceId = $stateParams.id;
		vm.validate = validate;
		
		vm.dateOptions = {
	            formatYear: 'yy',
	            startingDay: 1
	        };

	    vm.datepicker = { format: 'dd/MM/yyyy' };
	    
		vm.cancel = cancel;
		vm.saveItem = saveItem;
		vm.openDatePicker = openDatePicker;
		vm.searchCustomer = searchCustomer;
		vm.modifyCustomer = modifyCustomer;
		vm.addNewOrderProduct = addNewOrderProduct;
		vm.modifyOrderProduct = modifyOrderProduct;
		vm.deleteOrderProduct = deleteOrderProduct;
		vm.searchSeller = searchSeller;
		vm.isModeCreated = isModeCreated;
		vm.getNumberOfColumns = getNumberOfColumns;
		vm.getTotalRows = getTotalRows;
		vm.markPaid = markPaid;
		vm.doEncaissement = doEncaissement;
		vm.doRemboursement = doRemboursement;
		vm.deleteItem = deleteItem;
		vm.showPayments = showPayments;
		vm.addNewAvoir = addNewAvoir;
		vm.getRid = getRid;
		
		function getRid(){
			$confirm({ text: String.format("Souhaitez-vous abandonner l'effet '{0}' ?", vm.item.title), title: "Abandonner une facture", ok: 'Oui', cancel: 'Non' })
        	.then(function () {

        		apiService.post(String.format('/web/api/invoice/{0}/get-rid', vm.invoiceId), {},
    					function(response){
    						notificationService.displaySuccess("La facture a été abandonnée avec succès !");
    						vm.$onInit();   						
    					});
        	}); 
		}
		
		function addNewAvoir(){
			$uibModal.open({
                templateUrl: 'modules/sales/features/invoice/createAvoirView.html',
                controller: 'createAvoirCtrl as vm',
                resolve: {
                    data: {
                    	invoiceId : vm.invoiceId
                    }
                }
            }).result.then(function (avoir) {
            	vm.invoiceId = avoir.id;
            	vm.$onInit();
            }, function () {

            });
		}
		
		function showPayments(){
			$state.go('main.sales.payment', {invoiceId: vm.invoiceId}, {location: false});
		}
		
		function deleteItem(){
			$confirm({ text: String.format("Souhaitez-vous supprimer la facture ?"), title: "Supprimer une facture", ok: 'Oui', cancel: 'Non' })
        	.then(function () {

        		apiService.remove(String.format("/web/api/invoice/{0}", vm.item.id), {},
    					function(response){    						
    						notificationService.displaySuccess(String.format("La facture a été supprimée avec succès !"));
    						close();
    					},
    					function(error){
    						
    					}
    			);
        	});  	
		}
		
		function doEncaissement(){
			$uibModal.open({
                templateUrl: 'modules/sales/features/payment/editEncaissementView.html',
                controller: 'editEncaissementCtrl as vm',
                resolve: {
                    data: {
                    	invoiceId : vm.invoiceId
                    }
                }
            }).result.then(function (itemEdited) {
            	vm.$onInit();
            }, function () {

            });
		}
		
		function doRemboursement(){
			$uibModal.open({
                templateUrl: 'modules/sales/features/payment/editRemboursementView.html',
                controller: 'editRemboursementCtrl as vm',
                resolve: {
                    data: {
                    	invoiceId : vm.invoiceId
                    }
                }
            }).result.then(function (itemEdited) {
            	vm.$onInit();
            }, function () {

            });
		}
		
		function markPaid(){
			$confirm({ text: String.format("Souhaitez-vous classer la facture {0} 'payée' ?", vm.item.reference), title: "Classer une facture payée", ok: 'Oui', cancel: 'Non' })
        	.then(function () {

        		apiService.post(String.format('/web/api/invoice/{0}/mark-paid', vm.invoiceId), {},
    					function(response){
    						notificationService.displaySuccess("La facture a été classée 'payée' avec succès !");
    						vm.$onInit();   						
    					});
        	}); 
		}
		
		function getTotalRows(){
			if(!vm.item)
				return 0;
			
			var number = vm.item.taxes.length == 0 ? 10 : vm.item.taxes.length + 9;
			
			if(vm.item.typeId != 1)
			{
				number-=2;
			}
			
			return number;
		}
		
		function getNumberOfColumns(){
			if(!vm.item)
				return;
			
			var number = 10;
			
			if(!isModeCreated())
				number--;
	
			return number;
		}
		
		function isModeCreated(){
			if(!vm.item)
				return true;
			
			return !vm.item.statusId || vm.item.statusId == 4;
		}
		
		function searchSeller(){
			$uibModal.open({
                templateUrl: 'modules/sales/settings/seller/sellerSearchView.html',
                controller: 'sellerSearchCtrl as vm',
                size: 'lg',
                resolve: {
                    data: { }
                }
            }).result.then(function (sellerSelected) {
            	vm.item.seller = sellerSelected.name;   
            	vm.item.sellerId = sellerSelected.id;
            }, function () {

            }); 
		}
		
		function deleteOrderProduct(item){
			$confirm({ text: String.format("Souhaitez-vous supprimer l'article '{0}' ?", item.name), title: "Supprimer un article", ok: 'Oui', cancel: 'Non' })
        	.then(function () {

        		apiService.remove(String.format('/web/api/invoice/{0}/product/{1}', vm.invoiceId, item.id), {},
    					function(response){
        					notificationService.displaySuccess("Suppression de l'article effectuée avec succès !");
        					utilityService.remove(vm.item.products, 'id', item.id);
        					updateAmounts();
    					},
    					function(error){							
    						
    					});
        	}, function(){
        		
        	}); 
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
		
		function updateAmounts(){
			apiService.get(String.format('/web/api/invoice/{0}', vm.invoiceId), null, 
					function(response){
						vm.item.totalAmountHt = response.data.totalAmountHt;
						vm.item.reduceAmount = response.data.reduceAmount;
						vm.item.netCommercial = response.data.netCommercial;
						vm.item.totalTaxAmount = response.data.totalTaxAmount;
						vm.item.totalAmountTtc = response.data.totalAmountTtc;
						vm.item.totalAmountPaid = response.data.totalAmountPaid;
						vm.item.totalAmountRembourse = response.data.totalAmountRembourse;
						vm.item.leftAmountToPay = response.data.leftAmountToPay;
						vm.item.avoirAmount = response.data.avoirAmount;
						vm.item.solde = response.data.solde;
						vm.item.taxes = response.data.taxes;							
					}
			);
		}
		
		function editOrderProduct(item, callback){
			$uibModal.open({
                templateUrl: 'modules/sales/features/invoice/editInvoiceProductView.html',
                controller: 'editInvoiceProductCtrl as vm',
                resolve: {
                    data: {
                    	item : item,
                    	orderDate: vm.item.orderDate,
                    	orderId: vm.item.id
                    }
                }
            }).result.then(function (itemEdited) {
            	updateAmounts();
            	            	
            	if(callback)
            		callback(itemEdited);
            }, function () {

            });
		}
		
		function modifyCustomer(customerId){
			apiService.get(String.format('/web/api/contact/{0}', customerId), {}, 
					function(response){
						var customer = response.data;
						
						var templateUrl, controller;
						
						switch(customer.natureId){
						case 1:
							templateUrl = 'modules/contacts/features/contact/editContactPersonView.html';
							controller = 'editContactPersonCtrl as vm';
							break;
						case 2:
							templateUrl = 'modules/contacts/features/contact/editContactSocietyView.html';
							controller = 'editContactSocietyCtrl as vm';
							break;
						}
						
						$uibModal.open({
			                templateUrl: templateUrl,
			                controller: controller,
			                size: "lg",
			                resolve: {
			                    data: {
			                    	id : customer.id
			                    }
			                }
			            }).result.then(function (itemEdited) {
			            	vm.item.customer = itemEdited.name;
			            }, function () {

			            });
					},
					function(error){
						
					}
			);			
		}
		
		function searchCustomer(){
			$uibModal.open({
                templateUrl: 'modules/contacts/features/contact/contactSearchView.html',
                controller: 'contactSearchCtrl as vm',
                size: 'lg',
                resolve: {
                    data: {
                        filter: ''
                    }
                }
            }).result.then(function (person) {
            	vm.item.customerId = person.id;
                vm.item.customer = person.name;
            }, function () {
            	
            });
		}
		
		function openDatePicker($event) {
            $event.preventDefault();
            $event.stopPropagation();

            vm.datepicker.opened = true;
        };
		
		function saveItem() {
			if(vm.isNewItem){									
				switch (vm.item.typeId) {
				case "1":
					apiService.post(String.format('/web/api/invoice/final'), vm.item,
	    					function (response){
								vm.invoiceId = response.data.id;
								vm.$onInit();
						
								notificationService.displaySuccess("La facture a été créée avec succès !");
	    					}, 
	    					function(error){
	    						
	    					}
	    			);
					break;
				case "2":
					apiService.post(String.format('/web/api/invoice/down-payment/amount'), vm.item,
	    					function (response){
								vm.invoiceId = response.data.id;
								vm.$onInit();
						
								notificationService.displaySuccess("La facture a été créée avec succès !");   
	    					}, 
	    					function(error){
	    						
	    					}
	    			);
					break;
				case "3":
					apiService.post(String.format('/web/api/invoice/down-payment/percent'), vm.item,
	    					function (response){								
								vm.invoiceId = response.data.id;
								vm.$onInit();
						
								notificationService.displaySuccess("La facture a été créée avec succès !");   
	    					}, 
	    					function(error){
	    						
	    					}
	    			);
					break;
				default:
					break;
			}
			}else{
				return apiService.put(String.format('/web/api/invoice/{0}', vm.item.id), vm.item,
						function(response){
					
							if(vm.closeAfterSaved)
								close();
							else
								vm.$onInit();
							notificationService.displaySuccess("La facture a été modifiée avec succès !");
						},
						function(error){
							
						});
			}		
		}
		
		function close(){
			$previousState.go();
		}
		
		function cancel(){
			close();
		}
		
		function validate(){
			$confirm({ text: String.format("Souhaitez-vous valider la facture {0} ?", vm.item.reference), title: "Valider une facture", ok: 'Oui', cancel: 'Non' })
        	.then(function () {

        		apiService.post(String.format('/web/api/invoice/{0}/validate', vm.invoiceId), {},
    					function(response){
        					notificationService.displaySuccess("La facture a été validée avec succès !");
        					vm.$onInit();
    					},
    					function(error){							
    						
    					});
        	}); 			
		}
		
		this.$onInit = function(){
						
			vm.isNewItem = vm.invoiceId ? false : true;									
			
			apiService.get(String.format('/web/api/purchase-order/payment-condition'), {}, 
					function(response){
						vm.paymentConditions = response.data;

						if(vm.isNewItem){							
							vm.title = "Nouvelle facture";	
							
							vm.item = {livraisonDelayInDays: 15, products : [], orderDate: moment(new Date()).format('YYYY-MM-DD'), taxes: []};
							vm.item.typeId = $stateParams.typeId;
							vm.item.purchaseOrderId = $stateParams.purchaseOrderId;							
							vm.item.percent = $stateParams.percent;
							vm.item.amount = $stateParams.amount;
							vm.item.base = $stateParams.base;
							
							if(vm.item.purchaseOrderId){
								saveItem();
							}else{
								apiService.get(String.format('/web/api/sales/seller/{0}/is-seller', $rootScope.repository.loggedUser.id), {},
										function(response){
											if(response.data){
												
												apiService.get(String.format('/web/api/sales/seller/{0}', $rootScope.repository.loggedUser.id), {},
														function(response1){
															if(response1.data){
																vm.item.sellerId = response1.data.id;
																vm.item.seller = response1.data.name;											
															}
														}
												);
											}
										}
								);
							}							
							
						}else{														
							apiService.get(String.format('/web/api/invoice/{0}', vm.invoiceId), null, 
									function(response){
										vm.item = response.data;

										vm.title = String.format("{0} ({1})", vm.item.title, vm.item.status);
										
										apiService.get(String.format('/web/api/invoice/{0}/product', vm.invoiceId), null, 
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