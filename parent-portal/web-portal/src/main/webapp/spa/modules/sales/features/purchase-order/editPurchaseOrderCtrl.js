(function(app){
	'use strict';
	
	app.controller('editPurchaseOrderCtrl', editPurchaseOrderCtrl);
	
	editPurchaseOrderCtrl.$inject = ['apiService', '$stateParams', 'notificationService', '$rootScope', '$state', '$previousState', '$uibModal', 'utilityService', '$timeout', '$confirm'];
	function editPurchaseOrderCtrl(apiService, $stateParams, notificationService, $rootScope, $state, $previousState, $uibModal, utilityService, $timeout, $confirm){
		var vm = this;
		
		vm.purchaseOrderId = $stateParams.purchaseOrderId;
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
		vm.searchSeller = searchSeller;
		vm.isModeCreated = isModeCreated;
		vm.getNumberOfColumns = getNumberOfColumns;
		vm.getTotalRows = getTotalRows;
		vm.showInvoices = showInvoices;
		vm.addNewInvoice = addNewInvoice;
		vm.doEncaissement = doEncaissement;
		
		function doEncaissement(){
			$uibModal.open({
                templateUrl: 'modules/sales/features/purchase-order/payOrderView.html',
                controller: 'payPurchaseOrderCtrl as vm',
                resolve: {
                    data: {
                    	orderId : vm.purchaseOrderId                    	
                    }
                }
            }).result.then(function (itemEdited) {
            	vm.$onInit();
            }, function () {

            });
		}
		
		function addNewInvoice(){
			$uibModal.open({
                templateUrl: 'modules/sales/features/invoice/chooseInvoiceTypeView.html',
                controller: 'chooseInvoiceTypeCtrl as vm',
                resolve: {
                    data: {
                    	purchaseOrderId : vm.purchaseOrderId
                    }
                }
            }).result.then(function (invoice) {
            	$state.go('main.sales.edit-invoice', invoice, {location: false});           	
            }, function () {

            });  			
		}
		
		function showInvoices(){
			$state.go('main.sales.invoice', {purchaseOrderId: vm.purchaseOrderId}, {location: false});
		}
		
		function getTotalRows(){
			if(!vm.item)
				return 0;
			
			return vm.item.taxes.length == 0 ? 7 : vm.item.taxes.length + 6;
		}
		
		function getNumberOfColumns(){
			if(isModeCreated())
				return 10;
			else
				return 9;
		}
		
		function isModeCreated(){
			if(!vm.item)
				return true;
			
			return !vm.item.statusId || vm.item.statusId == 1;
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

        		apiService.remove(String.format('/web/api/purchase-order/{0}/product/{1}', vm.purchaseOrderId, item.id), {},
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
			apiService.get(String.format('/web/api/purchase-order/{0}', vm.purchaseOrderId), null, 
					function(response){
						vm.item.totalAmountHt = response.data.totalAmountHt;
						vm.item.reduceAmount = response.data.reduceAmount;
						vm.item.netCommercial = response.data.netCommercial;
						vm.item.totalTaxAmount = response.data.totalTaxAmount;
						vm.item.totalAmountTtc = response.data.totalAmountTtc;
						vm.item.taxes = response.data.taxes;							
					}
			);
		}
		
		function editOrderProduct(item, callback){
			$uibModal.open({
                templateUrl: 'modules/sales/features/purchase-order/editOrderProductView.html',
                controller: 'editOrderProductCtrl as vm',
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
        
        function openExpirationDatePicker($event) {
            $event.preventDefault();
            $event.stopPropagation();

            vm.expirationDatepicker.opened = true;
        };
		
		function saveItem() {
			if(vm.isNewItem){									
				return apiService.post(String.format('/web/api/purchase-order'), vm.item,
						function(response){
							vm.purchaseOrderId = response.data.id;
							vm.$onInit();
							
							notificationService.displaySuccess("Le devis a été créé avec succès !");
						},
						function(error){							
							
						});
			}else{
				return apiService.put(String.format('/web/api/purchase-order/{0}', vm.item.id), vm.item,
						function(response){
					
							if(vm.closeAfterSaved)
								close();
							else
								vm.$onInit();
							notificationService.displaySuccess("Le devis a été modifié avec succès !");
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
		
		function markSold(){
			$confirm({ text: String.format("Souhaitez-vous confirmer la vente pour le devis {0} ?", vm.item.reference), title: "Confirmation de vente", ok: 'Oui', cancel: 'Non' })
        	.then(function () {

        		$uibModal.open({
                    templateUrl: 'main/calendar/calendarView.html',
                    controller: 'calendarCtrl as vm',
                    size: 'md',
                    resolve: {
                        data: { 
                        	title : 'Sélectionner la date de vente'
                        }
                    }
                }).result.then(function (dateSelected) {

                	apiService.post(String.format('/web/api/purchase-order/{0}/mark-sold', vm.purchaseOrderId), {soldDate: dateSelected},
        					function(response){
            					notificationService.displaySuccess("Confirmation de vente effectuée avec succès !");
            					vm.$onInit();
        					},
        					function(error){							
        						
        					});
                }, function () {

                });        		
        	}, function(){
        		
        	}); 			
		}
		
		this.$onInit = function(){
			
			vm.isNewItem = vm.purchaseOrderId ? false : true;
			vm.item = {livraisonDelayInDays: 15, products : [], orderDate: moment(new Date()).format('YYYY-MM-DD'), taxes: []};
			
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
			
			apiService.get(String.format('/web/api/purchase-order/payment-condition'), {}, 
					function(response){
						vm.paymentConditions = response.data;

						if(vm.isNewItem){							
							vm.title = "Nouveau devis";	
						}else{														
							apiService.get(String.format('/web/api/purchase-order/{0}', vm.purchaseOrderId), null, 
									function(response){
										vm.item = response.data;

										vm.title = String.format("Modifier le devis {0} ({1})", vm.item.reference, vm.item.status);
										
										apiService.get(String.format('/web/api/purchase-order/{0}/product', vm.purchaseOrderId), null, 
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