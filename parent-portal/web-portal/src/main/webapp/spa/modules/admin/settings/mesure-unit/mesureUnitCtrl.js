(function(app){
	'use strict';
	
	app.controller('mesureUnitCtrl', mesureUnitCtrl);
	
	mesureUnitCtrl.$inject = ['apiService', '$uibModal', '$confirm', 'notificationService', '$state'];
	function mesureUnitCtrl(apiService, $uibModal, $confirm, notificationService, $state){
		
		var vm = this;
		
		vm.addNew = addNew;
		vm.openEditDialog = openEditDialog;
		vm.deleteItem = deleteItem;
		
		function loadItems(){
			apiService.get('/web/api/mesure-unit', {}, 
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
                templateUrl: 'modules/admin/settings/mesure-unit/editMesureUnitView.html',
                controller: 'editMesureUnitCtrl as vm',
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
			$confirm({ text: String.format("Souhaitez-vous supprimer l'unité de mesure {0} ?", item.fullName), title: 'Supprimer une unité de mesure', ok: 'Oui', cancel: 'Non' })
        	.then(function () {

        		apiService.remove("/web/api/mesure-unit/" + item.id, {},
    					function(response){
    						loadItems();    						
    						notificationService.displaySuccess(String.format("L'unité de mesure {0} a été supprimée avec succès !", item.fullName));
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