(function(app){
	'use strict';
	
	app.controller('editCorrespondanceCtrl', editCorrespondanceCtrl);
	
	editCorrespondanceCtrl.$inject = ['apiService', '$uibModal', '$confirm', 'notificationService', '$state', '$previousState','$stateParams'];	
	function editCorrespondanceCtrl(apiService, $uibModal, $confirm, notificationService, $state, $previousState, $stateParams){
		var vm = this;
		
		vm.reconcileId = $stateParams.reconcileId;
		
		vm.clearSearchInvoice = clearSearchInvoice;
		vm.searchInvoice = searchInvoice;
		vm.clearSearchPayment = clearSearchPayment;
		vm.searchPayment = searchPayment;
		vm.addInvoice = addInvoice;
		vm.addPayment = addPayment;
		vm.goPreviousPage = goPreviousPage;
		vm.removeLine = removeLine;		
		vm.lettrer = lettrer;
		vm.delettrer = delettrer;
		
		function delettrer(item){
			$confirm({ text: String.format("Souhaitez-vous delettrer la correspondance ?"), title: "Delettrer une correspondance", ok: 'Oui', cancel: 'Non' })
        	.then(function () {

        		vm.loadingData = true;
        		apiService.post("/web/api/compta/reconcile/" + item.id + "/delettrer", {},
    					function(response){
        					vm.loadingData = false;
        					loadReconcile(); 						
    						notificationService.displaySuccess("La correspondance a été delettrée avec succès !");
    					},
    					function(error){
    						vm.loadingData = false;
    					}
    			);
        	});
		}
		
		function lettrer(item){
			$confirm({ text: String.format("Souhaitez-vous lettrer la correspondance ?"), title: "Lettrer une correspondance", ok: 'Oui', cancel: 'Non' })
        	.then(function () {

        		vm.loadingData = true;
        		apiService.post("/web/api/compta/reconcile/" + item.id + "/lettrer", {},
    					function(response){
        					vm.loadingData = false;
        					loadReconcile();    						
    						notificationService.displaySuccess("La correspondance a été lettrée avec succès !");
    					},
    					function(error){
    						vm.loadingData = false;
    					}
    			);
        	});
		}
		
		function goPreviousPage(){
			$previousState.go();
		}
		
		function addInvoice(item) {
			vm.loadingInvoice = true;
			apiService.post(String.format('/web/api/compta/reconcile/{0}/line/{1}', vm.reconcileId, item.id), {}, 
					function(result){					
						vm.loadingInvoice = false;
						vm.pageChangedInvoice();
						loadReconcile();
					}, function(error){
						vm.loadingInvoice = false;						
					});
		}
		
		function addPayment(item) {
			vm.loadingPayment = true;
			apiService.post(String.format('/web/api/compta/reconcile/{0}/line/{1}', vm.reconcileId, item.id), {}, 
					function(result){					
						vm.loadingPayment = false;
						vm.pageChangedPayment();
						loadReconcile();
					}, function(error){
						vm.loadingPayment = false;						
					});
		}
		
		function removeLine(item) {
			apiService.remove(String.format('/web/api/compta/reconcile/{0}/line/{1}', vm.reconcileId, item.id), {}, 
					function(result){					
						loadReconcile(function(){
							searchInvoice();
							searchPayment();
						});
					}, function(error){
						
					});
		}
		
		vm.pageChangedInvoice = function(){
			searchInvoice(vm.currentPageInvoice);
		}
		
		function clearSearchInvoice(){
			vm.filterInvoice = "";
			searchInvoice();
		}
		
		function searchInvoice(page){
			page = page ? page : 1;

			var config = {
				params : {
		                page: page,
		                pageSize: vm.pageSizeInvoice,
		                filter: vm.filterInvoice,
		                pieceNatureId: 2,
		                statusId: 1,
		                auxiliaryAccountId: vm.reconcile.auxiliaryAccountId
		            }	
			};
			            
			vm.loadingInvoice = true;
			apiService.get(String.format('/web/api/compta/line/search'), config, 
					function(result){					
						vm.loadingInvoice = false;
			            vm.totalCountInvoice = result.data.totalCount;
			            vm.currentPageInvoice = result.data.page;
			            
			            vm.invoices = result.data.items;
					});
		}
		
		vm.pageChangedPayment = function(){
			searchPayment(vm.currentPagePayment);
		}
		
		function clearSearchPayment(){
			vm.filterPayment = "";
			searchPayment();
		}
		
		function searchPayment(page){
			page = page ? page : 1;

			var config = {
				params : {
		                page: page,
		                pageSize: vm.pageSizePayment,
		                filter: vm.filterPayment,
		                pieceNatureId: 4,
		                statusId: 1,
		                auxiliaryAccountId: vm.reconcile.auxiliaryAccountId
		            }	
			};
			            
			vm.loadingPayment = true;
			apiService.get(String.format('/web/api/compta/line/search'), config, 
					function(result){					
						vm.loadingPayment = false;
			            vm.totalCountPayment = result.data.totalCount;
			            vm.currentPagePayment = result.data.page;
			            
			            vm.payments = result.data.items;
					});
		}
		
		function loadReconcile(callback){
			apiService.get(String.format('/web/api/compta/reconcile/{0}', vm.reconcileId), {}, 
					function(response){
						vm.reconcile = response.data;
						
						if(callback)
							callback(vm.reconcile);
					}
			);
		}
		
		this.$onInit = function(){
			vm.pageSizeInvoice = 5;
			vm.pageSizePayment = 5;			
			
			loadReconcile(function(){
				searchInvoice();
				searchPayment();
			});
		}
	}
	
})(angular.module('lightpro'));