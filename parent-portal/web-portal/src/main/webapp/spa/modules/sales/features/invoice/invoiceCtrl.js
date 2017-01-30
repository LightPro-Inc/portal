(function(app){
	'use strict';
	
	app.controller('invoiceCtrl', invoiceCtrl);
	
	invoiceCtrl.$inject = ['apiService', '$uibModal', '$confirm', 'notificationService', '$stateParams', '$state', '$rootScope', '$previousState'];
	function invoiceCtrl(apiService, $uibModal, $confirm, notificationService, $stateParams, $state, $rootScope, $previousState){
		var vm = this;
		
		vm.purchaseOrderId = $stateParams.purchaseOrderId;
		
		vm.addNew = addNew;
		vm.openEditDialog = openEditDialog;
		vm.clearSearch = clearSearch;
		vm.search = search;
		vm.deleteItem = deleteItem;		
		vm.goPreviousPage = goPreviousPage;
		vm.showPayments = showPayments;
		
		function showPayments(item){
			$state.go('main.sales.payment', {invoiceId: item.id});
		}
		
		function deleteItem(item){
			$confirm({ text: String.format("Souhaitez-vous supprimer la facture {0} ?", item.reference), title: "Supprimer une facture", ok: 'Oui', cancel: 'Non' })
        	.then(function () {

        		apiService.remove(String.format("/web/api/purchase-order/{0}/invoice/{1}", vm.purchaseOrderId, item.id), {},
    					function(response){
    						search();    						
    						notificationService.displaySuccess(String.format("La facture {0} a été supprimée avec succès !", item.reference));
    					},
    					function(error){
    						notificationService.displayError(error);
    					}
    			);
        	});  	
		}
		
		function openEditDialog(item){
			$state.go('main.sales.edit-invoice', {invoiceId: item.id});
		}
		
		function addNew(){
			$uibModal.open({
                templateUrl: 'modules/sales/features/invoice/chooseInvoiceTypeView.html',
                controller: 'chooseInvoiceTypeCtrl as vm',
                resolve: {
                    data: {
                    	purchaseOrderId : vm.purchaseOrderId
                    }
                }
            }).result.then(function (invoice) {
            	openEditDialog(invoice);            	
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
			
			if(vm.purchaseOrderId){
				apiService.get('/web/api/purchase-order/' + vm.purchaseOrderId + '/invoice', config, 
						function(result){					
							vm.loadingData = false;
							vm.items = result.data;
						},
						function(error){
							vm.loadingData = true;						
						});
			}else{
				apiService.get('/web/api/invoice/search', config, 
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
			vm.pageSize = 4;
			
			search();	
			
			if(vm.purchaseOrderId){				
				apiService.get('/web/api/purchase-order/' + vm.purchaseOrderId, null, 
						function(response){
							vm.purchaseOrder = response.data;
						}
				);
			}			
		}
	}
	
})(angular.module('lightpro'));