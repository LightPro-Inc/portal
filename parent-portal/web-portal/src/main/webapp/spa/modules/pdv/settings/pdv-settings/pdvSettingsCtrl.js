(function(app){
	'use strict';
	
	app.controller('pdvSettingsCtrl', pdvSettingsCtrl);
	
	pdvSettingsCtrl.$inject = ['$rootScope', 'apiService', '$uibModal', '$confirm', 'notificationService', '$state', '$previousState', '$timeout'];	
	function pdvSettingsCtrl($rootScope, apiService, $uibModal, $confirm, notificationService, $state, $previousState, $timeout){
		var vm = this;
		
		vm.addNew = addNew;
		vm.openEditDialog = openEditDialog;
		vm.clearSearch = clearSearch;
		vm.search = search;
		vm.deleteItem = deleteItem;		
		vm.activate = activate;
		vm.showProducts = showProducts;
		vm.openNewSession = openNewSession;
		vm.openSession = openSession;
		vm.getSessionInProgress = getSessionInProgress;
		
		function openSession(item){
			$state.go('cashdesk', {sessionId: item.sessionInProgress.id});
		}
		
		function getSessionInProgress(item){
			
			var config = {
				params : {
		                cashierId :  $rootScope.repository.loggedUser.id
		            }	
			};
			
			apiService.get(String.format('/web/api/pdv/pdv/{0}/session-in-progress', item.id), config, 
					function(result){				
						$timeout(function(){
							item.hasSessionInProgress = angular.isDefined(result.data) && result.data != "";
				            item.sessionInProgress = result.data;	
						});			            
					});	
		}		
		
		function openNewSession(item){
			apiService.post(String.format("/web/api/pdv/pdv/{0}/session", item.id), $rootScope.repository.loggedUser.id,
					function(response){
						item.sessionInProgress = response.data;
						openSession(item);						
					},
					function(error){
						notificationService.displayError(error);
					}
			);			
		}
		
		function showProducts(item){
			$state.go('main.pdv.pdv-product', {pdvId: item.id});
		}
		
		function activate(item){
			var title = item.active ? String.format("Souhaitez-vous désactiver le point de vente {0} ?", item.name) : String.format("Souhaitez-vous activer le point de vente {0} ?", item.name);
			$confirm({ text: title, title: "Activation d'un point de vente", ok: 'Oui', cancel: 'Non' })
        	.then(function () {

        		apiService.post(String.format("/web/api/pdv/pdv/{0}/activate", item.id), !item.active,
    					function(response){
    						search();   
    						var msg = item.active ? String.format("Le point de vente {0} a été désactivé avec succès !", item.name) : String.format("Le point de vente {0} a été activé avec succès !", item.name)
    						notificationService.displaySuccess(msg);
    					},
    					function(error){
    						notificationService.displayError(error);
    					}
    			);
        	});  			
		}
		
		function deleteItem(item){
			$confirm({ text: String.format("Souhaitez-vous supprimer le point de vente {0} ?", item.name), title: "Supprimer un point de vente", ok: 'Oui', cancel: 'Non' })
        	.then(function () {

        		apiService.remove("/web/api/pdv/pdv/" + item.id, {},
    					function(response){
    						search();    						
    						notificationService.displaySuccess(String.format("Le point de vente {0} a été supprimé avec succès !", item.name));
    					},
    					function(error){
    						notificationService.displayError(error);
    					}
    			);
        	});  	
		}
		
		function openEditDialog(item){
			editItem(item, function(){
				 search(vm.currentPage);
			 });
		}
		
		function addNew(){
			 editItem(null, function(){
				 search();
			 });
		}
		
		function editItem(item, callback){

			$uibModal.open({
                templateUrl: 'modules/pdv/settings/pdv-settings/editPdvSettingsView.html',
                controller: 'editPdvSettingsCtrl as vm',
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
			apiService.get('/web/api/pdv/pdv/search', config, 
					function(result){					
						vm.loadingData = false;
			            vm.totalCount = result.data.totalCount;
			            vm.currentPage = result.data.page;
			            
						vm.items = result.data.items;
						
						angular.forEach(vm.items, function(value){
							getSessionInProgress(value);
						})
					});
		}
		
		this.$onInit = function(){
			vm.pageSize = 4;
			
			search();		
		}
	}
	
})(angular.module('lightpro'));