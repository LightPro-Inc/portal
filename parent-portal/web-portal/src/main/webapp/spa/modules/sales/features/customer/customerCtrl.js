(function(app){
	'use strict';
	
	app.controller('customerCtrl', customerCtrl);
	
	customerCtrl.$inject = ['apiService', '$uibModal', '$confirm', 'notificationService', '$state'];	
	function customerCtrl(apiService, $uibModal, $confirm, notificationService, $state){
		var vm = this;
		
		vm.addNew = addNew;
		vm.openEditDialog = openEditDialog;
		vm.clearSearch = clearSearch;
		vm.search = search;
		vm.deleteItem = deleteItem;
		
		function deleteItem(item){
			$confirm({ text: String.format("Souhaitez-vous supprimer le client {0} ?", item.fullName), title: 'Supprimer un client', ok: 'Oui', cancel: 'Non' })
        	.then(function () {

        		apiService.remove("/web/api/customer/" + item.id, {},
    					function(response){
    						search();    						
    						notificationService.displaySuccess("Le client " + item.fullName + " a été supprimé avec succès !");
    					},
    					function(error){
    						notificationService.displayError(error);
    					}
    			);
        	});  	
		}
		
		function openEditDialog(item){
			editItem(item, function(){
				 search(vm.currentPage);
			 });
		}
		
		function addNew(){
			 editItem(null, function(){
				 search();
			 });
		}
		
		function editItem(item, callback){

			$uibModal.open({
                templateUrl: 'modules/sales/features/customer/editCustomerView.html',
                controller: 'editCustomerCtrl as vm',
                size: "lg",
                resolve: {
                    data: {
                    	item : item
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
			apiService.get('/web/api/customer/search', config, 
					function(result){					
						vm.loadingData = false;
			            vm.totalCount = result.data.totalCount;
			            vm.currentPage = result.data.page;
			            
						vm.items = result.data.items;
					});
		}
		
		this.$onInit = function(){
			vm.pageSize = 2;
			
			search();			
		}
	}
	
})(angular.module('lightpro'));