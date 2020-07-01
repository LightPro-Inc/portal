(function(app){
	'use strict';
	
	app.controller('journalPieceTypeCtrl', journalPieceTypeCtrl);
	
	journalPieceTypeCtrl.$inject = ['apiService', '$uibModal', '$confirm', 'notificationService', '$state', '$stateParams', '$rootScope', '$previousState'];	
	function journalPieceTypeCtrl(apiService, $uibModal, $confirm, notificationService, $state, $stateParams, $rootScope, $previousState){
		var vm = this;
		
		vm.journalId = $stateParams.journalId;
	
		vm.loadItems = loadItems;
		vm.deleteItem = deleteItem;	
		vm.goPreviousPage = goPreviousPage;
		vm.searchPieceTypes = searchPieceTypes;
		
		function searchPieceTypes(){
			$uibModal.open({
                templateUrl: 'modules/compta/settings/piece-type/pieceTypeSearchView.html',
                controller: 'pieceTypeSearchCtrl as vm',
                size: 'lg',
                resolve: {
                    data: { }
                }
            }).result.then(function (itemSelected) {
            	addNew(itemSelected);           	
            }, function () {

            });
		}
		
		function addNew(item){
			apiService.post(String.format("/web/api/compta/journal/{0}/piece-type/{1}", vm.journalId, item.id), {},
					function(response){
    					loadItems();    						
						notificationService.displaySuccess("Le type de pièce a été ajouté avec succès !");
					},
					function(error){
						
					}
			);
		}
		
		function goPreviousPage(){
			$previousState.go();
		}
		
		function deleteItem(item){
			$confirm({ text: String.format("Souhaitez-vous supprimer le type de pièce {0} du journal '{1}'?", item.name, vm.journal.name), title: "Supprimer un type de pièce d'un journal", ok: 'Oui', cancel: 'Non' })
        	.then(function () {

        		apiService.remove(String.format("/web/api/compta/journal/{0}/piece-type/{1}", vm.journalId, item.id), {},
    					function(response){
        					loadItems();    						
    						notificationService.displaySuccess("Le type de pièce a été supprimé avec succès !");
    					},
    					function(error){
    						
    					}
    			);
        	});  	
		}
		
		function loadItems(){
			            
			vm.loadingData = true;
			apiService.get(String.format('/web/api/compta/journal/{0}/piece-type', vm.journalId), {}, 
					function(response){					
						vm.loadingData = false;

						vm.items = response.data;
					});
		}
		
		this.$onInit = function(){
			loadItems();	
			
			apiService.get(String.format('/web/api/compta/journal/{0}', vm.journalId), {}, 
					function(response){					
						vm.loadingData = false;

						vm.journal = response.data;
					});
		}
	}
	
})(angular.module('lightpro'));