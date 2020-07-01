(function(app){
	'use strict';
	
	app.controller('invoiceComptaCtrl', invoiceComptaCtrl);
	
	invoiceComptaCtrl.$inject = ['apiService', 'notificationService', '$q', '$confirm'];
	function invoiceComptaCtrl(apiService, notificationService, $q, $confirm){
		var vm = this;
			
		vm.sendToCompta = sendToCompta;
		vm.clearSearch = clearSearch;
		vm.search = search;
		
		function sendToCompta(item){
			$confirm({ text: String.format("Souhaitez-vous envoyer la facture {0} à la comptabilité ?", item.reference), title: "Envoyer une facture à la comptabilité", ok: 'Oui', cancel: 'Non' })
        	.then(function () {

        		apiService.post(String.format("/web/api/invoice/{0}/send-to-compta", item.id), {},
    					function(response){
        					search(vm.currentPage);    						
    						notificationService.displaySuccess(String.format("La facture {0} a été envoyée à la comptabilité avec succès !", item.reference));
    					},
    					function(error){
    						
    					}
    			);
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
			vm.items = [];
			
			page = page ? page : 1;			
			            			
			var config = {
					params : {
			                page: page,
			                pageSize: vm.pageSize,
			                filter: vm.filter
			            }	
				};
				
				vm.loadingData = true;
				apiService.get('/web/api/invoice/search', config, 
						function(result){					
							vm.loadingData = false;
				            vm.totalCount = result.data.totalCount;
				            vm.currentPage = result.data.page;
				            
							vm.items = result.data.items;
						},
						function(error){
							vm.loadingData = false;						
						});			
		}
		
		this.$onInit = function() {
			vm.pageSize = 5;
			
			search();	
		}
		
	}
})(angular.module('lightpro'));