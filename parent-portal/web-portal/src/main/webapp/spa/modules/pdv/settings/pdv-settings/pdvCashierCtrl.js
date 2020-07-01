(function(app){
	'use strict';
	
	app.controller('pdvCashierCtrl', pdvCashierCtrl);
	
	pdvCashierCtrl.$inject = ['apiService', '$uibModal', '$confirm', 'notificationService', '$state', '$stateParams', '$rootScope', '$previousState', 'contactService'];	
	function pdvCashierCtrl(apiService, $uibModal, $confirm, notificationService, $state, $stateParams, $rootScope, $previousState, contactService){
		var vm = this;
		
		vm.pdvId = $stateParams.pdvId;
	
		vm.loadItems = loadItems;
		vm.deleteItem = deleteItem;	
		vm.goPreviousPage = goPreviousPage;
		vm.addNew = addNew;
		vm.editItem= editItem;
		vm.changePdv = changePdv;
		
		function changePdv(item){
			$uibModal.open({
                templateUrl: 'modules/pdv/settings/pdv-settings/pdvSearchView.html',
                controller: 'pdvSearchCtrl as vm',
                size: 'lg',
                resolve: {
                    data: { }
                }
            }).result.then(function (pdvSelected) {
            	apiService.post(String.format("/web/api/pdv/cashier/{0}/change-pdv/{1}", item.id, pdvSelected.id), {},
            			function(response){
            				notificationService.displaySuccess("Changement de point de vente effectué avec succès !");
            				loadItems();
            			},
            			function(error){
            				
            			}
            	);
            }, function () {

            });
		}
		
		function editItem(item){
			contactService.edit(item, function(itemEdited){
				loadItems();
			});
		}
		
		function addNew(){
			$uibModal.open({
                templateUrl: 'modules/sales/settings/seller/sellerSearchView.html',
                controller: 'sellerSearchCtrl as vm',
                size: 'lg',
                resolve: {
                    data: { }
                }
            }).result.then(function (sellerSelected) {
            	addNewCashier(sellerSelected);           	
            }, function () {

            });
		}
		
		function addNewCashier(seller){
			apiService.post(String.format("/web/api/pdv/pdv/{0}/cashier", vm.pdvId), seller,
					function(response){
    					loadItems();    						
						notificationService.displaySuccess("Le caissier a été ajoutée avec succès !");
					},
					function(error){
						
					}
			);
		}
		
		function goPreviousPage(){
			$previousState.go();
		}
		
		function deleteItem(item){
			$confirm({ text: String.format("Souhaitez-vous supprimer le caissier {0} du point de vente ?", item.name), title: "Supprimer un caissier d'un point de vente", ok: 'Oui', cancel: 'Non' })
        	.then(function () {

        		apiService.remove(String.format("/web/api/pdv/pdv/{0}/cashier/{1}", vm.pdvId, item.id), {},
    					function(response){
        					loadItems();    						
    						notificationService.displaySuccess("Le caissier a été supprimé avec succès !");
    					},
    					function(error){
    						
    					}
    			);
        	});  	
		}
		
		function loadItems(){
			            
			vm.loadingData = true;
			apiService.get(String.format('/web/api/pdv/pdv/{0}/cashier', vm.pdvId), {}, 
					function(response){					
						vm.loadingData = false;

						vm.items = response.data;
					});
		}
		
		this.$onInit = function(){
			loadItems();	
			
			apiService.get(String.format('/web/api/pdv/pdv/{0}', vm.pdvId), {}, 
					function(response){					
						vm.loadingData = false;

						vm.pdv = response.data;
					});
		}
	}
	
})(angular.module('lightpro'));