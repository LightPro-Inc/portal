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
			$state.go('main.sales.payment', {invoiceId: item.id}, {location: false});
		}
		
		function deleteItem(item){
			$confirm({ text: String.format("Souhaitez-vous supprimer la facture {0} ?", item.reference), title: "Supprimer une facture", ok: 'Oui', cancel: 'Non' })
        	.then(function () {

        		apiService.remove(String.format("/web/api/invoice/{0}", item.id), {},
    					function(response){
    						search();    						
    						notificationService.displaySuccess(String.format("La facture {0} a été supprimée avec succès !", item.reference));
    					},
    					function(error){
    						
    					}
    			);
        	});  	
		}
		
		function openEditDialog(invoice){
			$state.go('main.sales.edit-invoice', invoice, {location: false});
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
            }).result.then(function (cmd) {
            	openEditDialog(cmd);            	
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
			            
			vm.loadingData = true;
			if(vm.purchaseOrderId){
				var config = {
						params : {
				                page: page,
				                pageSize: vm.pageSize,
				                filter: vm.filter
				            }	
					};
				
				apiService.get('/web/api/purchase-order/' + vm.purchaseOrderId + '/invoice', config, 
						function(result){					
							vm.loadingData = false;
							vm.items = result.data;
						},
						function(error){
							vm.loadingData = false;						
						});
			}else{
				var config = {
					params : {
			                page: page,
			                pageSize: vm.pageSize,
			                filter: vm.filter,
			                statusId: vm.statusId
			            }	
				};
				
				apiService.get('/web/api/invoice/search', config, 
						function(result){					
							vm.loadingData = false;
				            vm.totalCount = result.data.totalCount;
				            vm.currentPage = result.data.page;
				            
							vm.items = result.data.items;
						},
						function(error){
							vm.loadingData = false;						
						});
			}			
		}
		
		function goPreviousPage(){
			$previousState.go();
		}
		
		this.$onInit = function(){
			
			apiService.get('/web/api/invoice/status', {}, 
					function(response){
						vm.status = response.data;
					}
			);
			
			vm.pageSize = 2;
			
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