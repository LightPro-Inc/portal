(function(app){
	'use strict';
	
	app.controller('pieceTypeCtrl', pieceTypeCtrl);
	
	pieceTypeCtrl.$inject = ['apiService', '$uibModal', '$confirm', 'notificationService', '$state', '$previousState', '$stateParams', 'utilityService'];	
	function pieceTypeCtrl(apiService, $uibModal, $confirm, notificationService, $state, $previousState, $stateParams, utilityService){
		var vm = this;
		
		vm.addNew = addNew;
		vm.openEditDialog = openEditDialog;
		vm.clearSearch = clearSearch;
		vm.search = search;
		vm.deleteItem = deleteItem;
		vm.journalChanged = journalChanged;
		vm.showPieceTrames = showPieceTrames;
		
		function showPieceTrames(pieceType){
			$state.go('main.compta.trame', {pieceTypeId: pieceType.id}, {location:true});
		}
		
		function journalChanged(journal){
			search(0);
		}
		
		function deleteItem(item){
			$confirm({ text: String.format("Souhaitez-vous supprimer le type de pièce {0} ?", item.name), title: "Supprimer un type de pièce", ok: 'Oui', cancel: 'Non' })
        	.then(function () {

        		apiService.remove("/web/api/compta/piece-type/" + item.id, {},
    					function(response){
    						search();    						
    						notificationService.displaySuccess("Le type de pièce " + item.name + " a été supprimé avec succès !");
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
                templateUrl: 'modules/compta/settings/piece-type/editPieceTypeView.html',
                controller: 'editPieceTypeCtrl as vm',
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
			apiService.get('/web/api/compta/piece-type/search', config, 
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