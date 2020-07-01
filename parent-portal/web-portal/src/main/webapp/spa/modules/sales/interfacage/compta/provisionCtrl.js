(function(app){
	'use strict';
	
	app.controller('provisionComptaCtrl', provisionComptaCtrl);
	
	provisionComptaCtrl.$inject = ['apiService', 'notificationService', '$q', '$confirm'];
	function provisionComptaCtrl(apiService, notificationService, $q, $confirm){
		var vm = this;
			
		vm.sendToCompta = sendToCompta;
		vm.clearSearch = clearSearch;
		vm.search = search;
		
		function sendToCompta(item){
			$confirm({ text: String.format("Souhaitez-vous envoyer la provision {0} à la comptabilité ?", item.reference), title: "Envoyer un paiement à la comptabilité", ok: 'Oui', cancel: 'Non' })
        	.then(function () {

        		apiService.post(String.format("/web/api/sales/provision/{0}/send-to-compta", item.id), {},
    					function(response){
        					search(vm.currentPage);    						
    						notificationService.displaySuccess(String.format("La provision {0} a été envoyée à la comptabilité avec succès !", item.reference));
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
				apiService.get('/web/api/sales/provision/search', config, 
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