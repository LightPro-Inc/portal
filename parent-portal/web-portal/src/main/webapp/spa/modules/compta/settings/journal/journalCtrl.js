(function(app){
	'use strict';
	
	app.controller('journalCtrl', journalCtrl);
	
	journalCtrl.$inject = ['apiService', '$uibModal', '$confirm', 'notificationService', '$state', '$previousState'];	
	function journalCtrl(apiService, $uibModal, $confirm, notificationService, $state, $previousState){
		var vm = this;
		
		vm.addNew = addNew;
		vm.openEditDialog = openEditDialog;
		vm.clearSearch = clearSearch;
		vm.search = search;
		vm.deleteItem = deleteItem;
		vm.showPieceTypes = showPieceTypes;
		vm.newPiece = newPiece;
		
		function newPiece(journal){
			$state.go('main.compta.edit-piece', {journalId: journal.id}, {location:false});
		}
		
		function showPieceTypes(journal){
			$state.go('main.compta.journal-piece-type', {journalId: journal.id}, {location:false});
		}
		
		function deleteItem(item){
			$confirm({ text: String.format("Souhaitez-vous supprimer le journal {0} ?", item.name), title: "Supprimer un journal", ok: 'Oui', cancel: 'Non' })
        	.then(function () {

        		apiService.remove("/web/api/compta/journal/" + item.id, {},
    					function(response){
    						search();    						
    						notificationService.displaySuccess("Le journal " + item.name + " a été supprimé avec succès !");
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
                templateUrl: 'modules/compta/settings/journal/editJournalView.html',
                controller: 'editJournalCtrl as vm',
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
			apiService.get('/web/api/compta/journal/search', config, 
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