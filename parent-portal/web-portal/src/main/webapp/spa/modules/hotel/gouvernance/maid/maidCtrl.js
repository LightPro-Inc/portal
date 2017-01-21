(function(app){
	'use strict';
	
	app.controller('maidCtrl', maidCtrl);
	
	maidCtrl.$inject = ['apiService', '$uibModal', '$confirm', 'notificationService', '$state'];	
	function maidCtrl(apiService, $uibModal, $confirm, notificationService, $state){
		var vm = this;
		
		vm.addNew = addNew;
		vm.openEditDialog = openEditDialog;
		vm.clearSearch = clearSearch;
		vm.search = search;
		vm.deleteItem = deleteItem;
		vm.activate = activate;
		
		function activate(item){
			var title = item.active ? String.format("Souhaitez-vous désactiver l'employé {0} ?", item.fullName) : String.format("Souhaitez-vous activer l'employé {0} ?", item.fullName);
			$confirm({ text: title, title: "Activation d'un employé", ok: 'Oui', cancel: 'Non' })
        	.then(function () {

        		apiService.post(String.format("/web/api/maid/{0}/activate", item.id), {active: !item.active},
    					function(response){
    						search();   
    						var msg = item.active ? String.format("L'employé {0} a été désactivé avec succès !", item.fullName) : String.format("L'employé {0} a été activé avec succès !", item.fullName)
    						notificationService.displaySuccess(msg);
    					},
    					function(error){
    						notificationService.displayError(error);
    					}
    			);
        	});  			
		}
		
		function deleteItem(item){
			$confirm({ text: String.format("Souhaitez-vous supprimer l'employé {0} ?", item.fullName), title: 'Supprimer un employé', ok: 'Oui', cancel: 'Non' })
        	.then(function () {

        		apiService.remove("/web/api/maid/" + item.id, {},
    					function(response){
    						search();    						
    						notificationService.displaySuccess("L'employé " + item.fullName + " a été supprimé avec succès !");
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
                templateUrl: 'modules/hotel/gouvernance/maid/editMaidView.html',
                controller: 'editMaidCtrl as vm',
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
			apiService.get('/web/api/maid/search', config, 
					function(result){					
						vm.loadingData = false;
			            vm.totalCount = result.data.totalCount;
			            vm.currentPage = result.data.page;
			            
						vm.items = result.data.items;
					});
		}
		
		this.$onInit = function(){
			vm.pageSize = 2;
			
			search();			
		}
	}
	
})(angular.module('lightpro'));