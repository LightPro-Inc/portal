(function(app){
	'use strict';
	
	app.controller('salesPaymentCtrl', salesPaymentCtrl);
	
	salesPaymentCtrl.$inject = ['apiService', 'notificationService', '$q'];
	function salesPaymentCtrl(apiService, notificationService, $q){
		var vm = this;
		
		vm.savePayment = savePayment;
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
		
		function savePayment(){
			var paymentCopy = angular.copy(vm.payment);
			
			apiService.post('/web/api/compta/interfacage/sales/payment', paymentCopy,
					function(response){
						notificationService.displaySuccess("L'interfaçage du paiement a été modifié avec succès!");
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
			
			var paymentPromise = apiService.get('/web/api/compta/interfacage/sales/payment', {}, function(response){
				vm.payment = response.data;
			});
			
			$q.all([bankAndCashJournalPromise, paymentPromise]).then(function(){
				
				angular.forEach(vm.payment.paymentModes, function(mode){
					
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
		}
		
	}
})(angular.module('lightpro'));