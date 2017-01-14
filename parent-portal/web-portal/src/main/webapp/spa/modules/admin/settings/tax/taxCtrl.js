(function(app){
	'use strict';
	
	app.controller('taxCtrl', taxCtrl);
	
	taxCtrl.$inject = ['apiService', '$uibModal', '$confirm', 'notificationService', '$state'];
	function taxCtrl(apiService, $uibModal, $confirm, notificationService, $state){
		
		var vm = this;
		
		vm.addNew = addNew;
		vm.openEditDialog = openEditDialog;
		vm.deleteItem = deleteItem;
		
		function loadItems(){
			apiService.get('/web/api/tax', {}, 
					function(response){					
						vm.loadingData = false;
			            vm.items = response.data;
			            vm.count = vm.items.length;
					},
					function(error){
						vm.loadingData = true;						
					});
		}
		
		function addNew(){
			 editItem(null, function(){
				 loadItems();
			 });
		}
		
		function openEditDialog(item){
			editItem(item, function(){
				 loadItems();
			 });
		}
		
		function editItem(item, callback){
			$uibModal.open({
                templateUrl: 'modules/admin/settings/tax/editTaxView.html',
                controller: 'editTaxCtrl as vm',
                size: 'sm',
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
		
		function deleteItem(item){
			$confirm({ text: String.format("Souhaitez-vous supprimer la taxe {0} ?", item.shortName), title: 'Supprimer une taxe', ok: 'Oui', cancel: 'Non' })
        	.then(function () {

        		apiService.remove(String.format("/web/api/tax/{0}", item.id), {},
    					function(response){
    						loadItems();    						
    						notificationService.displaySuccess(String.format("La taxe {0} a été supprimée avec succès !", item.shortName));
    					},
    					function(error){
    						notificationService.displayError(error);
    					}
    			);
        	});  	
		}
		
		this.$onInit = function(){
			loadItems();
		}
	}
	
})(angular.module('lightpro'));