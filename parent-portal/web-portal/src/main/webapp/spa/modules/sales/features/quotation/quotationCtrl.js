(function(app){
	'use strict';
	
	app.controller('quotationCtrl', quotationCtrl);
	
	quotationCtrl.$inject = ['apiService', '$uibModal', '$confirm', 'notificationService', '$stateParams', '$state', '$rootScope', '$previousState'];
	function quotationCtrl(apiService, $uibModal, $confirm, notificationService, $stateParams, $state, $rootScope, $previousState){
		var vm = this;
		
		vm.addNew = addNew;
		vm.openEditDialog = openEditDialog;
		vm.clearSearch = clearSearch;
		vm.search = search;
		vm.deleteItem = deleteItem;		
		vm.goPreviousPage = goPreviousPage;
		
		function deleteItem(item){
			$confirm({ text: String.format("Souhaitez-vous supprimer le dévis {0} ?", item.reference), title: "Supprimer un devis", ok: 'Oui', cancel: 'Non' })
        	.then(function () {

        		apiService.remove(String.format("/web/api/quotation/{0}", item.id), {},
    					function(response){
    						search();    						
    						notificationService.displaySuccess(String.format("Le devis {0} a été supprimé avec succès !", item.reference));
    					},
    					function(error){
    						notificationService.displayError(error);
    					}
    			);
        	});  	
		}
		
		function openEditDialog(item){
			editItem(item.id);
		}
		
		function addNew(){
			 editItem();
		}
		
		function editItem(quotationId){
			$state.go('main.sales.edit-quotation', {quotationId: quotationId});         
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
			apiService.get('/web/api/quotation/search', config, 
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
		
		function goPreviousPage(){
			$previousState.go();
		}
		
		this.$onInit = function(){
			vm.pageSize = 2;
			
			search();			
		}
	}
	
})(angular.module('lightpro'));