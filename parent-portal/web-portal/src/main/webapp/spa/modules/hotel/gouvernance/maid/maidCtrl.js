(function(app){
	'use strict';
	
	app.controller('maidCtrl', maidCtrl);
	
	maidCtrl.$inject = ['apiService', '$uibModal', '$confirm', 'notificationService', '$state', 'contactService'];	
	function maidCtrl(apiService, $uibModal, $confirm, notificationService, $state, contactService){
		var vm = this;
		
		vm.addNew = addNew;
		vm.clearSearch = clearSearch;
		vm.search = search;
		vm.deleteItem = deleteItem;
		vm.activate = activate;
		vm.openEditDialog = openEditDialog;

		function openEditDialog(item){
			contactService.edit(item, function(personEdited){
				search(vm.currentPage);
			});
		}
		
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
    						notificationService.displaySuccess("L'employé " + item.name + " a été supprimé avec succès !");
    					},
    					function(error){
    						
    					}
    			);
        	});  	
		}
		
		function addNew(){
			contactService.search("all", function(personEdited){
				apiService.post(String.format('/web/api/maid/{0}', personEdited.id), {},
		                function(response){
							search();    						
							notificationService.displaySuccess("L'employé " + item.name + " a été ajouté avec succès !");
						},
				        function(error){
							
						}
				);
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