(function(app){
	'use strict';
	
	app.controller('editPieceCtrl', editPieceCtrl);
	
	editPieceCtrl.$inject = ['apiService', '$stateParams', 'notificationService', '$rootScope', '$scope', '$state', '$previousState', '$uibModal', 'utilityService', '$timeout', '$confirm', 'Guid', '$q'];
	function editPieceCtrl(apiService, $stateParams, notificationService, $rootScope, $scope, $state, $previousState, $uibModal, utilityService, $timeout, $confirm, Guid, $q){
		var vm = this;
		
		vm.pieceId = $stateParams.pieceId;
		vm.journalId = $stateParams.journalId;
		vm.typeId = vm.journalId ? $stateParams.typeId : null;
		vm.amountBase = 0;
		
		vm.count = count;
		vm.modifyItem = modifyItem;
		vm.deleteItem = deleteItem;
		vm.applyChangesItem = applyChangesItem;
		vm.cancelEditItem = cancelEditItem;
		vm.searchAccount = searchAccount;
		vm.searchTiers = searchTiers;
		vm.debitTotal = debitTotal;
		vm.creditTotal = creditTotal;
		vm.razTiers = razTiers;
		vm.pieceTypeChanged = pieceTypeChanged;
		vm.addFlux = addFlux;
		vm.deleteFlux = deleteFlux;
		vm.addNewArticle = addNewArticle;
		vm.deleteArticle = deleteArticle;
		
		function deleteArticle(article){
			utilityService.remove(vm.item.articles, 'id', article.id);
		}
		
		function editParams(params, callback){
			$uibModal.open({
                templateUrl: 'modules/compta/features/piece/editParamView.html',
                controller: 'editParamCtrl as vm',
                resolve: {
                    data: {
                    	params : params
                    }
                }
            }).result.then(function (paramsEdited) {
            	if(callback)
            		callback(paramsEdited);
            }, function () {

            });
		}
		
		function addNewArticle(trameId){
			
			if(trameId){
				
				apiService.get(String.format('/web/api/compta/piece-type/{0}/trame/{1}/param', vm.item.typeId, trameId), {},
						function(response){
							var params = response.data;
							editParams(params, function(paramsEdited){
								
								generateArticle(vm.item.typeId, trameId, paramsEdited, function(article){
									vm.item.articles.push(article);
									
									if(vm.item.articles.length > 0){
										angular.forEach(vm.item.articles, function(article){
											angular.forEach(article.fluxes, function(flux){
												loadJournals(flux.journalTypeId, function(journals){
													flux.journals = journals;
												});
											});
										});								
									}
									
									vm.amountBase = 0;
								});
							});
						}
				);				
			}else{
				var article = {id: Guid.newGuid(), fluxes : []};
				vm.item.articles.push(article);
				addFlux(article);
				vm.amountBase = 0;
			}
		}
		
		$scope.$watchGroup(['vm.item.tiersTypeManagedId', 'vm.item.echeanceManaged'], function(newValues, oldValues, scope) {
			
			if(!vm.item)
				return;
			
			var count = 5;
			
			if(!vm.item.tiersTypeManagedId)
				count -= 1;
			
			if(vm.item.statusId == 2)
				count -= 1;
			
			vm.numberOfColumns = count;			  
		});
		
		function deleteFlux(article, flux){			
			deSelectCurrentLine(article, article.currentLine);
			utilityService.remove(article.fluxes, "id", flux.id);
		}
		
		function addFlux(article){
			var flux = {id: Guid.newGuid(), lines:[], journalId: null, journalTypeId: 0, journals: vm.journals };
			article.fluxes.push(flux);
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
		
		function pieceTypeChanged(typeId){
			if(vm.isNewItem){
				// 1- changer le type de la pièce				
				if(typeId){					
					
					var type = utilityService.findSingle(vm.pieceTypes, "id", typeId);
					vm.item.tiersTypeManagedId = type.tiersTypeManagedId;
					vm.item.echeanceManaged = type.echeanceManaged;
					vm.item.natureId = type.natureId;				
					loadTrames(typeId);
					loadJournalByPieceTypes(typeId);
				} else {
					$timeout(function(){
						vm.item.articles = [];
						vm.item.tiersTypeManagedId = null;
						vm.item.echeanceManaged = false;
						vm.item.natureId = 0;
						vm.journalId = null;
					});					
				}
			}			
		}
		
		function generateArticle(pieceTypeId, trameId, paramsEdited, callback){
			
			var paramCmd = {
					trameId: trameId,
					journalId: vm.journalId,
					params: paramsEdited
			}
			
			apiService.post(String.format('/web/api/compta/piece-type/{0}/generate', pieceTypeId), paramCmd, 
					function(response){
				
					response.data.id = Guid.newGuid();
					
						if(callback)
							callback(response.data);
					}
			);
		}
		
		function loadPieceTypes(journalId, callback){
			apiService.get(String.format('/web/api/compta/journal/{0}/piece-type', journalId), {}, 
					function(response){
						vm.pieceTypes = response.data;
						
						var type = utilityService.findSingle(vm.pieceTypes, "id", vm.item.typeId);
						if(!type){
							vm.item.typeId = null;
							return;
						}
						
						if(callback)
							callback();
					}
			);
		}
		
		function loadAllPieceTypes(callback){
			apiService.get(String.format('/web/api/compta/piece-type'), {}, 
					function(response){
						vm.pieceTypes = response.data;
						vm.item.typeId = null;
						
						if(callback)
							callback();
					}
			);
		}
		
		function razTiers(){
			vm.item.tiers = undefined;
			vm.item.tiersId = undefined;
		}
		
		function debitTotal(flux){
			var total = 0;
			
			if(!flux)
				return total;
			
			angular.forEach(flux.lines, function(line){
				if(line.debit)
					total += line.debit;
			});
			
			return total;
		}
		
		function creditTotal(flux){
			var total = 0;
			
			if(!flux)
				return total;
			
			angular.forEach(flux.lines, function(line){
				
				if(line.credit)
					total += line.credit;
			});
			
			return total;
		}	
		
		function searchTiers(){		
			$uibModal.open({
                templateUrl: 'modules/contacts/features/contact/contactSearchView.html',
                controller: 'contactSearchCtrl as vm',
                size: 'lg',
                resolve: {
                    data: {
                        filter: ''
                    }
                }
            }).result.then(function (person) {
            	vm.item.tiersId = person.id;
                vm.item.tiers = person.name;
            }, function () {
            	
            });
		}
		
		function searchAccount(item){
			$uibModal.open({
                templateUrl: 'modules/compta/settings/chart/accountSearchView.html',
                controller: 'accountSearchCtrl as vm',
                size: 'lg',
                resolve: {
                    data: { }
                }
            }).result.then(function (selected) {
            	item.mGeneralAccount = selected.fullName; 
            	item.mGeneralAccountId = selected.id;
            }, function () {

            }); 
		}
		
		function modifyItem(article, flux, item){
			if(article.currentLine)
			{
				notificationService.displayInfo("Sauvegardez SVP, l'écriture en cours d'édition avant de continuer l'action.");
				return;
			}
			
			// 1 - compte général
			item.mGeneralAccount = item.generalAccount;
			item.mGeneralAccountId = item.generalAccountId;
			
			// 2 - compte auxiliaire
			item.mAuxiliaryAccount = item.auxiliaryAccount;
			item.mAuxiliaryAccountId = item.auxiliaryAccountId;

			// 3 - débit
			item.mDebit = item.debit;
			
			// 4 - crédit
			item.mCredit = item.credit;		
						
			selectCurrentLine(article, item);
		}
		
		function deleteItem(article, flux, item){
			if(article.currentLine && article.currentLine.id != item.id)
			{
				notificationService.displayInfo("Sauvegardez SVP, l'écriture en cours d'édition avant de continuer l'action.");
				return;
			}
			
			utilityService.remove(flux.lines, "id", item.id);
		}
		
		function applyChangesItem(article, flux, item){
			
			if(item.mDebit && item.mCredit)
			{
				notificationService.displayInfo('Les colonnes débit et crédit ne peuvent pas être renseignées pour une même écriture !');
				return;
			}
			
			if(!item.mGeneralAccountId)
			{
				notificationService.displayInfo('Le compte général doit être renseigné !');
				return;
			}
			
			// 1 - compte général
			item.generalAccount = item.mGeneralAccount;
			item.generalAccountId = item.mGeneralAccountId;
			
			// 2 - compte auxiliaire
			item.auxiliaryAccount = item.mAuxiliaryAccount;
			item.auxiliaryAccountId = item.mAuxiliaryAccountId;
			
			// 3 - débit
			item.debit = item.mDebit;
			
			// 4 - crédit
			item.credit = item.mCredit;		
			
			deSelectCurrentLine(article, item);
		}
		
		function cancelEditItem(article, flux, item){
			
			if(!item.generalAccountId)
				deleteItem(flux, item);
			
			deSelectCurrentLine(article, item);
		}
		
		vm.cancel = cancel;
		vm.saveItem = saveItem;
		vm.searchPieceTypes = searchPieceTypes;
		vm.addNewLine = addNewLine;
		
		function selectCurrentLine(article, item){
			item.edited = true;
			article.currentLine = item;
		}
		
		function deSelectCurrentLine(article, item){
			if(item)
				item.edited = false;
			
			article.currentLine = null;
		}
		
		function addNewLine(article, flux){
			if(article.currentLine)
			{
				notificationService.displayInfo("Sauvegardez SVP, l'écriture en cours d'édition avant de continuer l'action.");
				return;
			}
			
			var item = {id: Guid.newGuid(), edited: true};
			flux.lines.push(item);
			selectCurrentLine(article, item);
		}
		
		function searchPieceTypes(){
			$uibModal.open({
                templateUrl: 'modules/compta/settings/piece-type/pieceTypeSearchView.html',
                controller: 'pieceTypeSearchCtrl as vm',
                size: 'lg',
                resolve: {
                    data: { }
                }
            }).result.then(function (itemSelected) {
            	vm.item.type = itemSelected.name;   
            	vm.item.typeId = itemSelected.id;
            	vm.item.tiersTypeManagedId = itemSelected.tiersTypeManagedId;
            	vm.item.tiersTypeManaged = itemSelected.tiersTypeManaged;
            	vm.item.echeanceManaged = itemSelected.echeanceManaged;
            }, function () {

            }); 
		}
		
		function saveItem(closeAfterSaved) {			
			
			if(vm.item.articles.length == 0){
				notificationService.displayInfo("Vous ne pouvez pas enregistrer une pièce sans article !");
				return;
			}
			
			angular.forEach(vm.item.articles, function(article){
				if(article.currentLine){
					notificationService.displayInfo("Sauvegardez, SVP, la ligne en cours d'édition avant de poursuivre l'action !");
					return;
				}
			});						
			
			if(vm.isNewItem){									
				return apiService.post(String.format('/web/api/compta/piece'), vm.item,
						function(response){
							
						    if(closeAfterSaved){
								close();
							}else{
								vm.pieceId = response.data.id;
								vm.$onInit();
							}
							
							notificationService.displaySuccess("La pièce a été créée avec succès !");
						},
						function(error){							
							
						});
			}else{
				return apiService.put(String.format('/web/api/compta/piece/{0}', vm.item.id), vm.item,
						function(response){
					
							if(closeAfterSaved){
								close();
							}else{								
								vm.$onInit();
							}

							notificationService.displaySuccess("La pièce a été modifiée avec succès !");
						},
						function(error){
							
						});
			}		
		}
		
		function close(){
			$previousState.go();
		}
		
		function cancel(){
			close();
		}
		
		function count(canContinue){
			$confirm({ text: String.format("Souhaitez-vous comptabiliser la pièce N° {0} ?", vm.item.reference), title: "Comptabiliser une pièce", ok: 'Oui', cancel: 'Non' })
        	.then(function () {

        		apiService.post(String.format('/web/api/compta/piece/{0}/count', vm.pieceId), {},
    					function(response){
        					notificationService.displaySuccess("Comptabilisation effectuée avec succès !");
        					
        					if(canContinue){
        						vm.pieceId = undefined;
        						vm.journalId = vm.item.journalId;
        						vm.typeId = vm.item.typeId;
        						vm.$onInit();
        					} else {
        						close();
        					}        					
    					},
    					function(error){							
    						
    					});
        	}); 			
		}
		
		function loadTrames(pieceTypeId){
			vm.trames = [];
			
			if(!pieceTypeId)
				return;
			
			apiService.get(String.format('/web/api/compta/piece-type/{0}/trame', pieceTypeId), {},
					function(response){					
						vm.trames = response.data;	
						
						var pieceType = utilityService.findSingle(vm.pieceTypes, 'id', pieceTypeId);
						vm.trameId = pieceType.preferredTrameId;
					}
			);
		}
		
		function loadJournalByPieceTypes(pieceTypeId){
			return apiService.get(String.format('/web/api/compta/piece-type/{0}/journal', pieceTypeId), {},
					function(response){					
						vm.journals = response.data;	
					}
			);
		}
		
		this.$onInit = function(){
			
			vm.isNewItem = vm.pieceId ? false : true;			
			
			if(vm.isNewItem){
				vm.item = { echeanceManaged: false, tiersTypeManagedId: null, articles: [], date: new Date(), typeId: vm.typeId };
				
				if(vm.journalId){
					loadPieceTypes(vm.journalId, function(){
						pieceTypeChanged(vm.item.typeId);
					});
				}else{						
					loadAllPieceTypes();
				}				
				
				vm.title = "Saisir une pièce comptable";					
			}else {
				
				apiService.get(String.format('/web/api/compta/piece/{0}', vm.pieceId), {},
						function(response){					
							vm.item = response.data;
							vm.item.date = new Date(vm.item.date);
							vm.item.dateEcheance = new Date(vm.item.dateEcheance);
							
							vm.title = String.format("Pièce comptable N° {0} ({1})", vm.item.reference, vm.item.status);
							
							angular.forEach(vm.item.articles, function(article){
								angular.forEach(article.fluxes, function(flux){
									loadJournals(flux.journalTypeId, function(journals){
										flux.journals = journals;
									});
								});
							});
							
							if(vm.item.statusId == 1)
								loadJournalByPieceTypes(vm.item.typeId);
						}
				);				
			}			
		}
	}
	
})(angular.module('lightpro'));