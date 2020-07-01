(function(app){
	'use strict';
	
	app.controller('locationCtrl', locationCtrl);
	
	locationCtrl.$inject = ['apiService', '$uibModal', '$confirm', 'notificationService', '$state', '$stateParams', '$rootScope', '$previousState'];	
	function locationCtrl(apiService, $uibModal, $confirm, notificationService, $state, $stateParams, $rootScope, $previousState){
		var vm = this;
		
		vm.warehouseId = $stateParams.warehouseId;
		
		vm.addNew = addNew;
		vm.openEditDialog = openEditDialog;
		vm.loadItems = loadItems;
		vm.deleteItem = deleteItem;	
		vm.activateItem = activateItem;
		vm.goPreviousPage = goPreviousPage;
	
		function activateItem(item){
			var msg;
			if(item.active)
				msg = String.format("Souhaitez-vous désactiver l'emplacement {0} ?", item.name);
			else
				msg = String.format("Souhaitez-vous activer l'emplacement {0} ?", item.name);
			
			$confirm({ text: msg, title: "Activation d'un emplacement", ok: 'Oui', cancel: 'Non' })
        	.then(function () {

        		apiService.post(String.format("/web/api/location/{0}/activate", item.id), {activate : !item.active},
    					function(response){
        					loadItems();    						
    						notificationService.displaySuccess("L'action s'est effectuée avec succès !");
    					},
    					function(error){
    						
    					}
    			);
        	});  	
		}
		
		function goPreviousPage(){
			$previousState.go();
		}
		
		function deleteItem(item){
			$confirm({ text: String.format("Souhaitez-vous supprimer l'emplacement {0} ?", item.name), title: "Supprimer un emplacement", ok: 'Oui', cancel: 'Non' })
        	.then(function () {

        		apiService.remove(String.format("/web/api/location/{0}", item.id), {},
    					function(response){
        					loadItems();    						
    						notificationService.displaySuccess("L'emplacement " + item.name + " a été supprimé avec succès !");
    					},
    					function(error){
    						
    					}
    			);
        	});  	
		}
		
		function openEditDialog(item){
			editItem(item, function(){
				loadItems();
			 });
		}
		
		function addNew(){
			 editItem(null, function(){
				 loadItems();
			 });
		}
		
		function editItem(item, callback){

			$uibModal.open({
                templateUrl: 'modules/stocks/settings/warehouse/editLocationView.html',
                controller: 'editLocationCtrl as vm',
                resolve: {
                    data: {
                    	warehouseId: vm.warehouseId,
                    	item : item
                    }
                }
            }).result.then(function (itemEdited) {
            	if(callback)
            		callback(itemEdited);
            }, function () {

            });           
		}
		
		function loadItems(){
			            
			vm.loadingData = true;
			apiService.get(String.format('/web/api/warehouse/{0}/location/internal', vm.warehouseId), {}, 
					function(response){					
						vm.loadingData = false;

						vm.items = response.data;
					});
			
			apiService.get(String.format('/web/api/warehouse/{0}', vm.warehouseId), {}, 
					function(response){
						vm.warehouse = response.data;												
					}
			);
		}
		
		this.$onInit = function(){
			loadItems();			
		}
	}
	
})(angular.module('lightpro'));