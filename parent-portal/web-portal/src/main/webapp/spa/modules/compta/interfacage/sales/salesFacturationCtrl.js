(function(app){
	'use strict';
	
	app.controller('salesFacturationCtrl', salesFacturationCtrl);
	
	salesFacturationCtrl.$inject = ['apiService', 'notificationService', '$q'];
	function salesFacturationCtrl(apiService, notificationService, $q){
		var vm = this;
		
		vm.saleJournalChanged = saleJournalChanged;
		vm.factureClientChanged = factureClientChanged;
		vm.saveFacturation = saveFacturation;
		vm.saleJournalPcChanged = saleJournalPcChanged;
		vm.factureClientPcChanged = factureClientPcChanged;
		vm.factureDoitTramePcChanged = factureDoitTramePcChanged;
		
		function factureDoitTramePcChanged(category, factureDoitTrameId){
			category.edited = true;
		}
		
		function factureClientPcChanged(category, factureClientId){
			category.edited = true;
			
			category.factureDoitTrameId = null;
			category.factureAvoirTrameId = null;
			
			category.trames = [];
			
			if(factureClientId)
				loadTrames(factureClientId, function(trames){
					category.trames = trames;
				});
		}
		
		function saleJournalPcChanged(category, journalVenteId){
			category.edited = true;
			
			category.factureClientId = null;
			factureClientPcChanged(category, category.factureClientId);
			category.pieceTypes = [];
			
			if(journalVenteId)
				loadPieceTypes(journalVenteId, function(pieceTypes){
					category.pieceTypes = pieceTypes;
				});
		}
		
		function saveFacturation(){
			var facturationCopy = angular.copy(vm.facturation);
			facturationCopy.productCategories = [];
			
			angular.forEach(vm.productCategories, function(category){
				
				if(category.edited)
					facturationCopy.productCategories.push(category);
			});
			
			apiService.post('/web/api/compta/interfacage/sales/facturation', facturationCopy,
					function(response){
						notificationService.displaySuccess("L'interfaçage de la facturation a été modifié avec succès!");
						
						angular.forEach(vm.productCategories, function(category){
							category.edited = false;
						});
					});
		}
		
		function factureClientChanged(factureClientId){
			vm.facturation.factureDoitTrameId = null;
			
			vm.trames = [];
			
			if(factureClientId)
				loadTrames(factureClientId, function(trames){
					vm.trames = trames;
				});	
		}
		
		function saleJournalChanged(journalVenteId){
			
			vm.facturation.factureClientId = null;
			factureClientChanged(vm.facturation.factureClientId);
			vm.pieceTypes = [];
			
			if(journalVenteId)
				loadPieceTypes(journalVenteId, function(pieceTypes){
					vm.pieceTypes = pieceTypes;
				});
		}
		
		function loadTrames(pieceTypeId, callback){
			apiService.get(String.format('/web/api/compta/piece-type/{0}/trame', pieceTypeId), {}, function(response){
				
				if(callback)
					callback(response.data)
			});
		}
		
		function loadPieceTypes(journalId, callback){
			apiService.get(String.format('/web/api/compta/journal/{0}/piece-type', journalId), {}, function(response){
								
				if(callback)
					callback(response.data)				
			});
		}		
		
		this.$onInit = function() {
			
			var salesJournalPromise = apiService.get('/web/api/compta/journal/sales', {}, function(response){
				vm.salesJournals = response.data;
			});
			
			var facturationPromise = apiService.get('/web/api/compta/interfacage/sales/facturation', {}, function(response){
				vm.facturation = response.data;
				
				apiService.get('/web/api/compta/interfacage/sales/facturation/product-category', {}, function(response){
					vm.productCategories = response.data;
					
					angular.forEach(vm.productCategories, function(category){
						
						if(category.journalVenteId){
							loadPieceTypes(category.journalVenteId, function(pieceTypes){
								category.pieceTypes = pieceTypes;
							});
						}
						
						if(category.factureClientId){
							loadTrames(category.factureClientId, function(trames){
								category.trames = trames;
							});
						}
					});
				});
			});			
			
			$q.all([salesJournalPromise, facturationPromise]).then(function(){
				
				if(vm.facturation.journalVenteId){
					loadPieceTypes(vm.facturation.journalVenteId, function(pieceTypes){
						vm.pieceTypes = pieceTypes;
					});
				}
				
				if(vm.facturation.factureClientId){
					loadTrames(vm.facturation.factureClientId, function(trames){
						vm.trames = trames;
					});
				}				
			});
		}
		
	}
})(angular.module('lightpro'));