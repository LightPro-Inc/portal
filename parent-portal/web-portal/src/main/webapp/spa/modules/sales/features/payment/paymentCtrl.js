(function(app){
	'use strict';
	
	app.controller('paymentCtrl', paymentCtrl);
	
	paymentCtrl.$inject = ['apiService', '$uibModal', '$confirm', 'notificationService', '$stateParams', '$state', '$rootScope', '$previousState'];
	function paymentCtrl(apiService, $uibModal, $confirm, notificationService, $stateParams, $state, $rootScope, $previousState){
		var vm = this;
		
		vm.invoiceId = $stateParams.invoiceId;
		
		vm.addNew = addNew;
		vm.openEditDialog = openEditDialog;
		vm.clearSearch = clearSearch;
		vm.search = search;
		vm.deleteItem = deleteItem;		
		vm.goPreviousPage = goPreviousPage;
		
		function deleteItem(item){
			$confirm({ text: String.format("Souhaitez-vous supprimer le paiement {0} ?", item.reference), title: "Supprimer un paiement", ok: 'Oui', cancel: 'Non' })
        	.then(function () {

        		apiService.remove(String.format("/web/api/invoice/{0}/payment/{1}", vm.invoiceId, item.id), {},
    					function(response){
    						search();    						
    						notificationService.displaySuccess(String.format("Le paiement {0} a été supprimé avec succès !", item.reference));
    					},
    					function(error){
    						notificationService.displayError(error);
    					}
    			);
        	});  	
		}
		
		function openEditDialog(item){
			editItem(item, function(){
				 search(vm.currentPage);
			 });
		}
		
		function addNew(){
			 editItem({invoiceId : vm.invoiceId}, function(){
				 search();
			 });
		}
		
		function editItem(item, callback){

			$uibModal.open({
                templateUrl: 'modules/sales/features/payment/editPaymentView.html',
                controller: 'editPaymentCtrl as vm',
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