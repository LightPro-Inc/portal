(function(app){
	'use strict';
	
	app.controller('productTaxCtrl', productTaxCtrl);
	
	productTaxCtrl.$inject = ['apiService', '$uibModal', '$confirm', 'notificationService', '$state', '$stateParams', '$rootScope', '$previousState'];	
	function productTaxCtrl(apiService, $uibModal, $confirm, notificationService, $state, $stateParams, $rootScope, $previousState){
		var vm = this;
		
		vm.productId = $stateParams.productId;
	
		vm.loadItems = loadItems;
		vm.deleteItem = deleteItem;	
		vm.goPreviousPage = goPreviousPage;
		vm.addNew = addNew;
		
		function addNew(taxId){
			apiService.post(String.format("/web/api/product/{0}/tax/{1}", vm.productId, taxId), {},
					function(response){
    					loadItems();    						
						notificationService.displaySuccess("La taxe a été ajoutée avec succès !");
					},
					function(error){
						notificationService.displayError(error);
					}
			);
		}
		
		function goPreviousPage(){
			$previousState.go();
		}
		
		function deleteItem(item){
			$confirm({ text: String.format("Souhaitez-vous supprimer la taxe {0} ?", item.shortName), title: "Supprimer une taxe", ok: 'Oui', cancel: 'Non' })
        	.then(function () {

        		apiService.remove(String.format("/web/api/product/{0}/tax/{1}", vm.productId, item.id), {},
    					function(response){
        					loadItems();    						
    						notificationService.displaySuccess("La taxe a été supprimée avec succès !");
    					},
    					function(error){
    						notificationService.displayError(error);
    					}
    			);
        	});  	
		}
		
		function loadItems(){
			            
			vm.loadingData = true;
			apiService.get(String.format('/web/api/product/{0}/tax', vm.productId), {}, 
					function(response){					
						vm.loadingData = false;

						vm.items = response.data;
					});
			
			apiService.get(String.format('/web/api/tax'), {}, 
					function(response){					
						vm.loadingData = false;

						vm.taxes = response.data;
					});
		}
		
		this.$onInit = function(){
			loadItems();	
			
			apiService.get(String.format('/web/api/product/{0}', vm.productId), {}, 
					function(response){					
						vm.loadingData = false;

						vm.product = response.data;
					});
		}
	}
	
})(angular.module('lightpro'));