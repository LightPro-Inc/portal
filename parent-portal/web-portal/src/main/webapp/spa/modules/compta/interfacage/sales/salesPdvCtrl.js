(function(app){
	'use strict';
	
	app.controller('salesPdvCtrl', salesPdvCtrl);
	
	salesPdvCtrl.$inject = ['apiService', 'notificationService', '$q'];
	function salesPdvCtrl(apiService, notificationService, $q){
		var vm = this;
		
		vm.savePdv = savePdv;
		vm.bankAndCashJournalChanged = bankAndCashJournalChanged;
		vm.reglementChanged = reglementChanged;
		
		function reglementChanged(mode, reglementId){

			mode.acompteOrAvanceId = null;
			mode.reglementDefinitifId = null;
			
			mode.trames = [];
			
			if(reglementId)
				loadTrames(reglementId, function(trames){
					mode.trames = trames;
				});
		}
		
		function bankAndCashJournalChanged(mode, journalEncaissementId){

			mode.reglementId = null;
			reglementChanged(mode, mode.reglementId);
			mode.pieceTypes = [];
			
			if(journalEncaissementId)
				loadPieceTypes(journalEncaissementId, function(pieceTypes){
					mode.pieceTypes = pieceTypes;
				});
		}
		
		function savePdv(pdv){
			var pdvCopy = angular.copy(pdv);
			
			apiService.put(String.format('/web/api/compta/interfacage/sales/module-pdv/{0}', pdvCopy.id), pdvCopy,
					function(response){
						notificationService.displaySuccess("L'interfaçage du point de vente a été modifié avec succès!");
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
			
			var bankAndCashJournalPromise = apiService.get('/web/api/compta/journal/bank-and-cash', {}, function(response){
				vm.bankAndCashJournals = response.data;
			});
			
			var pdvPromise = apiService.get('/web/api/compta/interfacage/sales/module-pdv', {}, function(response){
				vm.pdvs = response.data;
			});
			
			$q.all([bankAndCashJournalPromise, pdvPromise]).then(function(){
				
				angular.forEach(vm.pdvs, function(pdv){
					angular.forEach(pdv.paymentModes, function(mode){
						
						if(mode.journalEncaissementId){
							loadPieceTypes(mode.journalEncaissementId, function(pieceTypes){
								mode.pieceTypes = pieceTypes;
							});
						}
						
						if(mode.reglementId){
							loadTrames(mode.reglementId, function(trames){
								mode.trames = trames;
							});
						}
					});	
				});		
			});
		}
		
	}
})(angular.module('lightpro'));