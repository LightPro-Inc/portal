(function(app){
	'use strict';
	
	app.controller('paymentCtrl', paymentCtrl);
	
	paymentCtrl.$inject = ['apiService', '$uibModal', '$confirm', 'notificationService', '$stateParams', '$state', '$rootScope', '$previousState'];
	function paymentCtrl(apiService, $uibModal, $confirm, notificationService, $stateParams, $state, $rootScope, $previousState){
		var vm = this;
		
		vm.invoiceId = $stateParams.invoiceId;
		
		vm.openEditDialog = openEditDialog;
		vm.clearSearch = clearSearch;
		vm.search = search;
		vm.deleteItem = deleteItem;		
		vm.goPreviousPage = goPreviousPage;
		
		function deleteItem(item){
			$confirm({ text: String.format("Souhaitez-vous supprimer le paiement {0} ?", item.reference), title: "Supprimer un paiement", ok: 'Oui', cancel: 'Non' })
        	.then(function () {

        		apiService.remove(String.format("/web/api/sales/payment/{0}", item.id), {},
    					function(response){
    						search();    						
    						notificationService.displaySuccess(String.format("Le paiement {0} a été supprimé avec succès !", item.reference));
    					},
    					function(error){
    						
    					}
    			);
        	});  	
		}
		
		function openEditDialog(item){
			editItem(item, function(){
				 search(vm.currentPage);
			 });
		}
		
		function editItem(item, callback){

			if(item.typeId == 1){
				if(item.originTypeId == 1)
					editEncaissementPurchaseOrder(item, callback);					
				else
					editEncaissement(item, callback);
			} else {
				if(item.originTypeId == 3){
					editRemboursementProvision(item, callback);
				} else
					editRemboursement(item, callback);
			}      
		}
		
		function editEncaissement(item, callback){
			$uibModal.open({
                templateUrl: 'modules/sales/features/payment/editEncaissementView.html',
                controller: 'editEncaissementCtrl as vm',
                resolve: {
                    data: {
                    	invoiceId: item.originId,
                    	item : item
                    }
                }
            }).result.then(function (itemEdited) {
            	if(callback)
            		callback(itemEdited);
            }, function () {

            });
		}
		
		function editRemboursement(item, callback){
			$uibModal.open({
                templateUrl: 'modules/sales/features/payment/editRemboursementView.html',
                controller: 'editRemboursementCtrl as vm',
                resolve: {
                    data: {
                    	invoiceId: item.originId,
                    	item : item
                    }
                }
            }).result.then(function (itemEdited) {
            	if(callback)
            		callback(itemEdited);
            }, function () {

            });
		}
		
		function editRemboursementProvision(item, callback){
			$uibModal.open({
                templateUrl: 'modules/sales/features/customer/editRemboursementProvisionView.html',
                controller: 'editRemboursementProvisionCtrl as vm',
                resolve: {
                    data: {
                    	item: item,
                    	provisionId: item.originId
                    }
                }
            }).result.then(function (itemEdited) {
            	if(callback)
            		callback(itemEdited);
            }, function () {

            });
		}
		
		function editEncaissementPurchaseOrder(item, callback){
			$uibModal.open({
                templateUrl: 'modules/sales/features/purchase-order/payOrderView.html',
                controller: 'payPurchaseOrderCtrl as vm',
                resolve: {
                    data: {
                    	item: item,
                    	orderId: item.originId
                    }
                }
            }).result.then(function (itemEdited) {
            	if(callback)
            		callback(itemEdited);
            }, function () {

            });
		}
		
		vm.pageChanged = function(){
			search(vm.currentPage);
		}
		
		function clearSearch(){
			vm.filter = "";
			search();
		}
		
		function search(page){
			page = page ? page : 1;

			var config = {
				params : {
		                page: page,
		                pageSize: vm.pageSize,
		                filter: vm.filter
		            }	
			};
			            
			vm.loadingData = true;
			
			if(vm.invoiceId){
				apiService.get('/web/api/invoice/' + vm.invoiceId + '/payment', config, 
						function(result){					
							vm.loadingData = false;
							vm.items = result.data;
						},
						function(error){
							vm.loadingData = true;						
						});
			}else{
				apiService.get('/web/api/sales/payment/search', config, 
						function(result){					
							vm.loadingData = false;
				            vm.totalCount = result.data.totalCount;
				            vm.currentPage = result.data.page;
				            
							vm.items = result.data.items;
						},
						function(error){
							vm.loadingData = true;						
						});
			}			
		}
		
		function goPreviousPage(){
			$previousState.go();
		}
		
		this.$onInit = function(){
			
			apiService.get('/web/api/sales/module/current', {}, 
					function(response){
						vm.module = response.data;
					}
			);
			
			vm.pageSize = 4;
			
			search();	
			
			if(vm.invoiceId){				
				apiService.get('/web/api/invoice/' + vm.invoiceId, {}, 
						function(response){
							vm.invoice = response.data;
						}
				);
			}			
		}
	}
	
})(angular.module('lightpro'));