(function(app){
	'use strict';
	
	app.controller('paymentModeCtrl', paymentModeCtrl);
	
	paymentModeCtrl.$inject = ['apiService', '$uibModal', '$confirm', 'notificationService', '$state'];
	function paymentModeCtrl(apiService, $uibModal, $confirm, notificationService, $state){
		
		var vm = this;
		
		vm.addNew = addNew;
		vm.openEditDialog = openEditDialog;
		vm.deleteItem = deleteItem;
		vm.activate = activate;
		
		function activate(item){
			var title = item.active ? String.format("Souhaitez-vous désactiver le mode de paiement '{0}' ?", item.name) : String.format("Souhaitez-vous activer le mode de paiement '{0}' ?", item.name);
			$confirm({ text: title, title: "Activation d'un mode de paiement", ok: 'Oui', cancel: 'Non' })
        	.then(function () {

        		if(item.active){
        			apiService.post(String.format("/web/api/payment-mode/{0}/disable", item.id), {},
        					function(response){
        						loadItems();   
        						notificationService.displaySuccess(String.format("Le mode de paiement {0} a été désactivé avec succès !", item.name));
        					},
        					function(error){
        						
        					}
        			);
        		}else{
        			apiService.post(String.format("/web/api/payment-mode/{0}/enable", item.id), {},
        					function(response){
        						loadItems();   
        						notificationService.displaySuccess(String.format("Le mode de paiement {0} a été activé avec succès !", item.name));
        					},
        					function(error){
        						
        					}
        			);
        		}
        	});  			
		}
		
		function loadItems(){
			apiService.get('/web/api/payment-mode', {}, 
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
                templateUrl: 'modules/admin/settings/payment-mode/editPaymentModeView.html',
                controller: 'editPaymentModeCtrl as vm',
                size: 'md',
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
			$confirm({ text: String.format("Souhaitez-vous supprimer le mode de paiement '{0}' ?", item.name), title: 'Supprimer un mode de paiement', ok: 'Oui', cancel: 'Non' })
        	.then(function () {

        		apiService.remove(String.format("/web/api/payment-mode/{0}", item.id), {},
    					function(response){
    						loadItems();    						
    						notificationService.displaySuccess(String.format("Le mode de paiement '{0}' a été supprimé avec succès !", item.name));
    					},
    					function(error){
    						
    					}
    			);
        	});  	
		}
		
		this.$onInit = function(){			
			loadItems();
		}
	}
	
})(angular.module('lightpro'));