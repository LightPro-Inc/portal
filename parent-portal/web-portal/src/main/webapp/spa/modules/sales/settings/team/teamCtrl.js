(function(app){
	'use strict';
	
	app.controller('teamCtrl', teamCtrl);
	
	teamCtrl.$inject = ['apiService', '$uibModal', '$confirm', 'notificationService', '$state', '$previousState'];	
	function teamCtrl(apiService, $uibModal, $confirm, notificationService, $state, $previousState){
		var vm = this;
		
		vm.addNew = addNew;
		vm.openEditDialog = openEditDialog;
		vm.clearSearch = clearSearch;
		vm.search = search;
		vm.deleteItem = deleteItem;		
		vm.showSellers = showSellers;
		
		function showSellers(item){		
			$state.go('main.sales.team-member', {teamId: item.id}, {location:false});
		}
		
		function deleteItem(item){
			$confirm({ text: String.format("Souhaitez-vous supprimer l'équipe commerciale {0} ?", item.name), title: "Supprimer une équipe commerciale", ok: 'Oui', cancel: 'Non' })
        	.then(function () {

        		apiService.remove("/web/api/sales/team/" + item.id, {},
    					function(response){
    						search();    						
    						notificationService.displaySuccess("L'équipe commerciale " + item.name + " a été supprimée avec succès !");
    					},
    					function(error){
    						
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
                templateUrl: 'modules/sales/settings/team/editTeamView.html',
                controller: 'editTeamCtrl as vm',
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
			apiService.get('/web/api/sales/team/search', config, 
					function(result){					
						vm.loadingData = false;
			            vm.totalCount = result.data.totalCount;
			            vm.currentPage = result.data.page;
			            
						vm.items = result.data.items;
					});
		}
		
		this.$onInit = function(){
			vm.pageSize = 4;
			
			search();			
		}
	}
	
})(angular.module('lightpro'));