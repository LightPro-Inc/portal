(function(app){
	'use strict';
	
	app.controller('editQuotationCtrl', editQuotationCtrl);
	
	editQuotationCtrl.$inject = ['apiService', '$stateParams', 'notificationService', '$rootScope', '$state', '$previousState', '$uibModal', 'utilityService', '$timeout', '$confirm'];
	function editQuotationCtrl(apiService, $stateParams, notificationService, $rootScope, $state, $previousState, $uibModal, utilityService, $timeout, $confirm){
		var vm = this;
		
		vm.quotationId = $stateParams.quotationId;
		
		vm.dateOptions = {
	            formatYear: 'yy',
	            startingDay: 1
	        };

	    vm.datepicker = { format: 'yyyy-MM-dd' };
		
		vm.cancel = cancel;
		vm.saveItem = saveItem;
		vm.openDatePicker = openDatePicker;
		vm.searchCustomer = searchCustomer;
		vm.modifyCustomer = modifyCustomer;
		vm.addNewOrderProduct = addNewOrderProduct;
		vm.modifyOrderProduct = modifyOrderProduct;
		vm.deleteOrderProduct = deleteOrderProduct;
		vm.getTotalAmountHt = getTotalAmountHt;
		vm.getTotalTaxAmount = getTotalTaxAmount;
		vm.getTotalAmountTtc = getTotalAmountTtc;
		
		function getTotalAmountHt(){
			var amount = 0;
			
			angular.forEach(vm.item.products, function(product){
				amount += product.totalAmountHt;
			});
			
			return amount;
		}
		
		function getTotalAmountTtc(){
			var amount = 0;
			
			angular.forEach(vm.item.products, function(product){
				amount += product.totalAmountTtc;
			});
			
			return amount;
		}
		
		function getTotalTaxAmount(){
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
                    	item : item
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
		
		function saveItem() {
			if(vm.isNewItem){
				
				vm.item.sellerId = $rootScope.repository.loggedUser.id;					
				
				return apiService.post(String.format('/web/api/quotation/'), vm.item,
						function(response){
							notificationService.displaySuccess("Le dévis a été créé avec succès !");
						},
						function(error){
							notificationService.displayError(error);
						});
			}else{
				return apiService.put(String.format('/web/api/quotation/{0}', vm.item.id), vm.item,
						function(response){
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
		
		this.$onInit = function(){
			
			vm.isNewItem = vm.quotationId ? false : true;						
			
			if(vm.isNewItem){							
				vm.title = "Nouveau devis";	
				vm.item = { products : []};
			}else{														
				apiService.get(String.format('/web/api/quotation/{0}', vm.quotationId), null, 
						function(response){
							vm.item = response.data;
							vm.item.orderDate = new Date(vm.item.orderDate);
							
							vm.title = String.format("Modifier le devis {0}", vm.item.reference);
						}
				);
			}	
		}
	}
	
})(angular.module('lightpro'));