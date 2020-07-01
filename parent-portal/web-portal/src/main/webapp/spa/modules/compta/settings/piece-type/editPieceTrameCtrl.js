(function(app){
	'use strict';
	
	app.controller('editPieceTrameCtrl', editPieceTrameCtrl);
	
	editPieceTrameCtrl.$inject = ['apiService', '$uibModal', '$confirm', 'notificationService', '$state', '$stateParams', '$rootScope', '$previousState', '$timeout', 'utilityService', 'Guid', '$q'];	
	function editPieceTrameCtrl(apiService, $uibModal, $confirm, notificationService, $state, $stateParams, $rootScope, $previousState, $timeout, utilityService, Guid, $q){
		var vm = this;
		
		vm.pieceTypeId = $stateParams.pieceTypeId;
		vm.trameId = $stateParams.trameId;
	
		vm.isNewItem = vm.trameId ? false : true;
		
		vm.goPreviousPage = goPreviousPage;
		vm.addNew = addNew;
		vm.addNewLine = addNewLine;		
		vm.deleteItemLine = deleteItemLine;
		vm.deleteItemFlux = deleteItemFlux;
		vm.saveItem = saveItem;
		vm.cancelEdit = cancelEdit;
		vm.searchAccount = searchAccount;
		vm.setChoiceAggregateAccount = setChoiceAggregateAccount;
		vm.journalTypeChanged = journalTypeChanged;
		vm.searchSimilaryAccount = searchSimilaryAccount;
		vm.addSimilaryAccountNewLine = addSimilaryAccountNewLine;
		vm.deleteSimilaryAccount = deleteSimilaryAccount;
		
		function deleteSimilaryAccount(detail, index){
			detail.similaryAccounts.splice(index, 1);
		}
		
		function addSimilaryAccountNewLine(detail) {
			detail.similaryAccounts.push({});
		}
		
		function searchSimilaryAccount(similaryAccount){
			$uibModal.open({
                templateUrl: 'modules/compta/settings/chart/accountSearchView.html',
                controller: 'accountSearchCtrl as vm',
                size: 'lg',
                resolve: {
                    data: { }
                }
            }).result.then(function (selected) {
            	similaryAccount.name = selected.fullName; 
            	similaryAccount.id = selected.id;
            }, function () {

            }); 
		}
		
		function journalTypeChanged(flux, journalTypeId){

			if(journalTypeId > 0)
				loadJournals(journalTypeId, function(journals){
					flux.journals = journals;
				});
			else{
				flux.journals = [];
			}
		}
		
		function setChoiceAggregateAccount(flux, item){
			angular.forEach(flux.details, function(detail){
				
				if(detail.id != item.id)
					detail.isAggregateAccount = false;
			});
			
			
			item.isAggregateAccount = !item.isAggregateAccount;
		}
		
		function searchAccount(detail){
			$uibModal.open({
                templateUrl: 'modules/compta/settings/chart/accountSearchView.html',
                controller: 'accountSearchCtrl as vm',
                size: 'lg',
                resolve: {
                    data: { }
                }
            }).result.then(function (selected) {
            	detail.generalAccount = selected.fullName; 
            	detail.generalAccountId = selected.id;
            }, function () {

            }); 
		}
		
		function cancelEdit(){
			goPreviousPage();
		}
		
		function saveItem(){

			if(vm.isNewItem){
				apiService.post(String.format('/web/api/compta/piece-type/{0}/trame', vm.pieceTypeId), vm.item,
						function(response){
							notificationService.displaySuccess("Le modèle de saisie a été créé avec succès!");
							goPreviousPage();
						},
						function(error){
							
						});
			}else{
				apiService.put(String.format('/web/api/compta/piece-type/{0}/trame/{1}', vm.pieceTypeId, vm.trameId), vm.item,
						function(response){
							notificationService.displaySuccess("Le modèle de saisie a été modifiée avec succès!");
							goPreviousPage();
						},
						function(error){
							
						});
			}
		}
				
		function deleteItemFlux(flux){
			utilityService.remove(vm.item.fluxes, 'id', flux.id);
		}
		
		function deleteItemLine(flux, item){
			utilityService.remove(flux.details, 'id', item.id);
		}
		
		function addNew() {
			vm.item.fluxes.push({id: Guid.newGuid(), details: []});
		}
		
		function addNewLine(flux) {
			flux.details.push({id: Guid.newGuid(), sensId : vm.orientationSens[0].id, formular: '{base}'});
		}
		
		function goPreviousPage(){
			$previousState.go();
		}
		
		function loadJournals(journalTypeId, callback){
			var config = {
					params: {
						typeId : journalTypeId
					}
			}
			apiService.get('/web/api/compta/journal', config, function(response){
				if(callback)
					callback(response.data);
			});
		}
		
		this.$onInit = function(){			
			vm.loadingData = true;
			
			var pieceTypePromise = apiService.get(String.format('/web/api/compta/piece-type/{0}', vm.pieceTypeId), {}, 
					function(response){					
						vm.pieceType = response.data;						
					});
			
			var orientationSensPromise = apiService.get(String.format('/web/api/compta/operation/type'), {}, 
					function(response){					
						vm.orientationSens = response.data;						
					});				
			
			var journalTypePromise = apiService.get('/web/api/compta/journal/type', {}, 
					function(response){
						vm.journalTypes = response.data;
					}
			);	
			
			$q.all([pieceTypePromise, orientationSensPromise, journalTypePromise]).then(function(){
				vm.loadingData = false;
				
				if(vm.isNewItem){
					vm.title = String.format("Créer un modèle de saisie ({0})", vm.pieceType.name);
					vm.item = {fluxes: []};
					
					addNew();
				} else {		
					
					vm.loadingData = true;
					apiService.get(String.format('/web/api/compta/piece-type/{0}/trame/{1}', vm.pieceTypeId, vm.trameId), {}, 
							function(response){	
						
								vm.loadingData = false;
								vm.item = response.data;	
								
								vm.title = String.format("Modifier le modèle '{0}' ({1})", vm.item.name, vm.pieceType.name);
								
								if(vm.item.fluxes.length == 0)
									addNew();
								else{
									angular.forEach(vm.item.fluxes, function(flux){
										journalTypeChanged(flux, flux.journalTypeId);
									});
								}
							});
				}
			});			
		}
	}
	
})(angular.module('lightpro'));