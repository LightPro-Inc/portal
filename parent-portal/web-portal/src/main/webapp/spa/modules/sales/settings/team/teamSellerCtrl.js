(function(app){
	'use strict';
	
	app.controller('teamSellerCtrl', teamSellerCtrl);
	
	teamSellerCtrl.$inject = ['apiService', '$uibModal', '$confirm', 'notificationService', '$state', '$stateParams', '$rootScope', '$previousState', 'contactService'];	
	function teamSellerCtrl(apiService, $uibModal, $confirm, notificationService, $state, $stateParams, $rootScope, $previousState, contactService){
		var vm = this;
		
		vm.teamId = $stateParams.teamId;
	
		vm.loadItems = loadItems;
		vm.deleteItem = deleteItem;	
		vm.goPreviousPage = goPreviousPage;
		vm.addNew = addNew;
		vm.editItem= editItem;
		vm.searchPerson = searchPerson;
		vm.changeTeam = changeTeam;
		
		function changeTeam(item){
			$uibModal.open({
                templateUrl: 'modules/sales/settings/team/teamSearchView.html',
                controller: 'teamSearchCtrl as vm',
                size: 'lg',
                resolve: {
                    data: { }
                }
            }).result.then(function (teamSelected) {
            	apiService.post(String.format("/web/api/sales/seller/{0}/change-team/{1}", item.id, teamSelected.id), {},
            			function(response){
            				notificationService.displaySuccess("Changement d'équipe effectué avec succès !");
            				loadItems();
            			},
            			function(error){
            				
            			}
            	);
            }, function () {

            });
		}
		
		function editItem(item){
			contactService.edit(item, function(personEdited){
				loadItems(); 
			});
		}
		
		function searchPerson(){
			contactService.search("all", function(personEdited){
				addNewSeller(personEdited); 
			});
		}
		
		function addNew(){
			contactService.edit({natureId: 1}, function(personCreated){
				addNewSeller(personCreated); 
			});
		}
		
		function addNewSeller(person){
			apiService.post(String.format("/web/api/sales/team/{0}/member", vm.teamId), person,
					function(response){
    					loadItems();    						
						notificationService.displaySuccess("Le vendeur a été ajouté avec succès !");
					},
					function(error){
						
					}
			);
		}
		
		function goPreviousPage(){
			$previousState.go();
		}
		
		function deleteItem(item){
			$confirm({ text: String.format("Souhaitez-vous supprimer le vendeur {0} de l'équipe ?", item.fullName), title: "Supprimer un vendeur d'une équipe", ok: 'Oui', cancel: 'Non' })
        	.then(function () {

        		apiService.remove(String.format("/web/api/sales/team/{0}/member/{1}", vm.teamId, item.id), {},
    					function(response){
        					loadItems();    						
    						notificationService.displaySuccess("Le vendeur a été supprimé avec succès !");
    					},
    					function(error){
    						
    					}
    			);
        	});  	
		}
		
		function loadItems(){
			            
			vm.loadingData = true;
			apiService.get(String.format('/web/api/sales/team/{0}/member', vm.teamId), {}, 
					function(response){					
						vm.loadingData = false;

						vm.items = response.data;
					});
		}
		
		this.$onInit = function(){
			loadItems();	
			
			apiService.get(String.format('/web/api/sales/team/{0}', vm.teamId), {}, 
					function(response){					
						vm.loadingData = false;

						vm.team = response.data;
					});
		}
	}
	
})(angular.module('lightpro'));