(function(app){
	'use strict';
	
	app.controller('paymentComptaCtrl', paymentComptaCtrl);
	
	paymentComptaCtrl.$inject = ['apiService', 'notificationService', '$q', '$confirm'];
	function paymentComptaCtrl(apiService, notificationService, $q, $confirm){
		var vm = this;
			
		vm.sendToCompta = sendToCompta;
		vm.clearSearch = clearSearch;
		vm.search = search;
		
		function sendToCompta(item){
			$confirm({ text: String.format("Souhaitez-vous envoyer le paiement {0} à la comptabilité ?", item.reference), title: "Envoyer un paiement à la comptabilité", ok: 'Oui', cancel: 'Non' })
        	.then(function () {

        		apiService.post(String.format("/web/api/sales/payment/{0}/send-to-compta", item.id), {},
    					function(response){
        					search(vm.currentPage);    						
    						notificationService.displaySuccess(String.format("Le paiement {0} a été envoyé à la comptabilité avec succès !", item.reference));
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
				apiService.get('/web/api/sales/payment/search', config, 
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