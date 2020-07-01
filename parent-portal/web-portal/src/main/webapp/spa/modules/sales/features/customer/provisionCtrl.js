(function(app){
	'use strict';
	
	app.controller('provisionCtrl', provisionCtrl);
	
	provisionCtrl.$inject = ['apiService', '$uibModal', '$confirm', 'notificationService', '$stateParams', '$state', '$rootScope', '$previousState'];
	function provisionCtrl(apiService, $uibModal, $confirm, notificationService, $stateParams, $state, $rootScope, $previousState){
		var vm = this;
		
		vm.customerId = $stateParams.customerId;
		
		vm.addNew = addNew;
		vm.openEditDialog = openEditDialog;
		vm.clearSearch = clearSearch;
		vm.search = search;
		vm.deleteItem = deleteItem;		
		vm.goPreviousPage = goPreviousPage;
		vm.rembourser = rembourser;
		
		function rembourser(item){
			$uibModal.open({
                templateUrl: 'modules/sales/features/customer/editRemboursementProvisionView.html',
                controller: 'editRemboursementProvisionCtrl as vm',
                resolve: {
                    data: {
                    	provisionId: item.id
                    }
                }
            }).result.then(function (itemEdited) {
            	search(vm.currentPage);
            }, function () {

            });     
		}
		
		function deleteItem(item){
			$confirm({ text: String.format("Souhaitez-vous supprimer la provision {0} ?", item.reference), title: "Supprimer une provision", ok: 'Oui', cancel: 'Non' })
        	.then(function () {

        		apiService.remove(String.format("/web/api/sales/provision/{0}", item.id), {},
    					function(response){
    						search();    						
    						notificationService.displaySuccess(String.format("La provision {0} a été supprimée avec succès !", item.reference));
    					},
    					function(error){
    						
    					}
    			);
        	});  	
		}
		
		function addNew(){
			editItem(null, function(){
				 search();
			 });
		}
		
		function openEditDialog(item){
			editItem(item, function(){
				 search(vm.currentPage);
			 });
		}
		
		function editItem(item, callback){
			$uibModal.open({
                templateUrl: 'modules/sales/features/customer/editProvisionView.html',
                controller: 'editProvisionCtrl as vm',
                resolve: {
                    data: {
                    	item : item,
                    	customerId: vm.customerId
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
			apiService.get(String.format('/web/api/customer/{0}/provision/search', vm.customerId), config, 
					function(result){					
						vm.loadingData = false;
			            vm.totalCount = result.data.totalCount;
			            vm.currentPage = result.data.page;
			            
						vm.items = result.data.items;
					},
					function(error){
						vm.loadingData = true;						
					});		
		}
		
		function goPreviousPage(){
			$previousState.go();
		}
		
		this.$onInit = function(){
			
			vm.pageSize = 4;
			
			search();	
			
			apiService.get('/web/api/customer/' + vm.customerId, {}, 
					function(response){
						vm.customer = response.data;
					}
			);			
		}
	}
	
})(angular.module('lightpro'));