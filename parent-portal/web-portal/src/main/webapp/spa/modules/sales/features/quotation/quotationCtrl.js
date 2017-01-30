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
		vm.cancelItem = cancelItem;
		vm.reOpenItem = reOpenItem;
		
		function reOpenItem(item){
			$confirm({ text: String.format("Souhaitez-vous ré-ouvrir le devis {0} ?", item.reference), title: "Ré-ouvrir un devis", ok: 'Oui', cancel: 'Non' })
        	.then(function () {

        		apiService.post(String.format("/web/api/quotation/{0}/re-open", item.id), {},
    					function(response){
        					item.statusId = response.data.statusId;
        					item.status = response.data.status;    						
    						notificationService.displaySuccess(String.format("Le devis {0} a été ré-ouvert avec succès !", item.reference));
    					},
    					function(error){
    						notificationService.displayError(error);
    					}
    			);
        	});  	
		}
		
		function cancelItem(item){
			$confirm({ text: String.format("Souhaitez-vous annuler le devis {0} ?", item.reference), title: "Annuler un devis", ok: 'Oui', cancel: 'Non' })
        	.then(function () {

        		apiService.post(String.format("/web/api/quotation/{0}/cancel", item.id), {},
    					function(response){
        					item.statusId = response.data.statusId;
        					item.status = response.data.status;
        					
    						notificationService.displaySuccess(String.format("Le devis {0} a été annulé avec succès !", item.reference));
    					},
    					function(error){
    						notificationService.displayError(error);
    					}
    			);
        	});  	
		}
		
		function deleteItem(item){
			$confirm({ text: String.format("Souhaitez-vous supprimer le devis {0} ?", item.reference), title: "Supprimer un devis", ok: 'Oui', cancel: 'Non' })
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