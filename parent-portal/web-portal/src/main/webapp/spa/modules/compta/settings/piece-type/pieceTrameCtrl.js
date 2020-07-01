(function(app){
	'use strict';
	
	app.controller('pieceTrameCtrl', pieceTrameCtrl);
	
	pieceTrameCtrl.$inject = ['apiService', '$uibModal', '$confirm', 'notificationService', '$state', '$previousState', '$stateParams', 'utilityService'];	
	function pieceTrameCtrl(apiService, $uibModal, $confirm, notificationService, $state, $previousState, $stateParams, utilityService){
		var vm = this;
		
		vm.pieceTypeId = $stateParams.pieceTypeId;
		
		vm.addNew = addNew;
		vm.openEditDialog = openEditDialog;
		vm.clearSearch = clearSearch;
		vm.search = search;
		vm.deleteItem = deleteItem;
		vm.goPrevious = goPrevious;
		vm.duplicate = duplicate;
		
		function duplicate(item){
			var itemCopy = angular.copy(item);
			itemCopy.name = String.format("Copie de {0}", itemCopy.name);
			
			apiService.post(String.format('/web/api/compta/piece-type/{0}/trame', itemCopy.pieceTypeId), itemCopy,
					function(response){
						notificationService.displaySuccess("La copie du modèle a été créée avec succès!");
						openEditDialog(response.data);
					});
		}
		
		function goPrevious(){
			$state.go('main.compta.piece-type', {}, {location:true});
		}
		
		function deleteItem(item){
			$confirm({ text: String.format("Souhaitez-vous supprimer le modèle '{0}' ?", item.name), title: "Supprimer un modèle de saisie", ok: 'Oui', cancel: 'Non' })
        	.then(function () {

        		apiService.remove(String.format("/web/api/compta/piece-type/{0}/trame/{1}", vm.pieceTypeId, item.id), {},
    					function(response){
    						search();    						
    						notificationService.displaySuccess("Le modèle '" + item.name + "' a été supprimé avec succès !");
    					},
    					function(error){
    						
    					}
    			);
        	});  	
		}
		
		function openEditDialog(item){
			$state.go('main.compta.edit-trame', {pieceTypeId: vm.pieceTypeId, trameId: item.id}, {location:false});
		}
		
		function addNew(){
			$state.go('main.compta.edit-trame', {pieceTypeId: vm.pieceTypeId, trameId: null}, {location:false});
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
			apiService.get(String.format('/web/api/compta/piece-type/{0}/trame/search', vm.pieceTypeId), config, 
					function(result){					
						vm.loadingData = false;
			            vm.totalCount = result.data.totalCount;
			            vm.currentPage = result.data.page;
			            
						vm.items = result.data.items;
					});
		}
		
		this.$onInit = function(){
			vm.pageSize = 6;
			
			vm.loadingData = true;	
			apiService.get(String.format('/web/api/compta/piece-type/{0}', vm.pieceTypeId), {}, 
					function(response){					
						vm.loadingData = false;

						vm.pieceType = response.data;						
					});
			
			search();
		}
	}
	
})(angular.module('lightpro'));