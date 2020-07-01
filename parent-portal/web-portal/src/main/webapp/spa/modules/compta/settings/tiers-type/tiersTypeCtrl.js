(function(app){
	'use strict';
	
	app.controller('tiersTypeCtrl', tiersTypeCtrl);
	
	tiersTypeCtrl.$inject = ['apiService', '$uibModal', '$confirm', 'notificationService', '$state', '$previousState', '$stateParams', 'utilityService'];	
	function tiersTypeCtrl(apiService, $uibModal, $confirm, notificationService, $state, $previousState, $stateParams, utilityService){
		var vm = this;
		
		vm.addNew = addNew;
		vm.openEditDialog = openEditDialog;
		vm.search = search;	
		vm.deleteItem = deleteItem;
		vm.showCompleteReconciles = showCompleteReconciles;
		vm.showPartialReconciles = showPartialReconciles;
		vm.showUnreconciledLines = showUnreconciledLines;
		
		function showUnreconciledLines(item){
			$state.go('main.compta.correspondance', {tiersTypeId: item.id}, {location: false});
		}
		
		function showPartialReconciles(item){
			$state.go('main.compta.correspondance', {tiersTypeId: item.id, reconcileStatusId: 1}, {location: false});
		}
		
		function showCompleteReconciles(item){
			$state.go('main.compta.correspondance', {tiersTypeId: item.id, reconcileStatusId: 2}, {location: false});
		}
		
		function deleteItem(item){
			$confirm({ text: String.format("Souhaitez-vous supprimer le type de tiers {0} ?", item.name), title: "Supprimer un type de tiers", ok: 'Oui', cancel: 'Non' })
        	.then(function () {

        		apiService.remove("/web/api/compta/tiers/type/" + item.id, {},
    					function(response){
    						search();    						
    						notificationService.displaySuccess("Le type de tiers " + item.name + " a été supprimé avec succès !");
    					},
    					function(error){
    						
    					}
    			);
        	});  	
		}
		
		function addNew(){
			$uibModal.open({
                templateUrl: 'modules/compta/settings/tiers-type/editTiersTypeView.html',
                controller: 'editTiersTypeCtrl as vm',
                resolve: {
                    data: {
                    	item : null
                    }
                }
            }).result.then(function (itemEdited) {
            	search();
            }, function () {

            });
		}
		
		function openEditDialog(item){
			$uibModal.open({
                templateUrl: 'modules/compta/settings/tiers-type/editTiersTypeView.html',
                controller: 'editTiersTypeCtrl as vm',
                resolve: {
                    data: {
                    	item : item
                    }
                }
            }).result.then(function (itemEdited) {
            	search();
            }, function () {

            });
		}
		
		function search(){   
			vm.loadingData = true;
			apiService.get('/web/api/compta/tiers/type', {}, 
					function(result){					
						vm.loadingData = false;
						
			            vm.totalCount = result.data.length;
						vm.items = result.data;
					});
		}
		
		this.$onInit = function(){
			search();
		}
	}
	
})(angular.module('lightpro'));