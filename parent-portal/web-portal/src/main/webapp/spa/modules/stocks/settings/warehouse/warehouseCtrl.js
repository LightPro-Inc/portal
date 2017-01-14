(function(app){
	'use strict';
	
	app.controller('warehouseCtrl', warehouseCtrl);
	
	warehouseCtrl.$inject = ['apiService', '$uibModal', '$confirm', 'notificationService', '$state'];	
	function warehouseCtrl(apiService, $uibModal, $confirm, notificationService, $state){
		var vm = this;
		
		vm.addNew = addNew;
		vm.openEditDialog = openEditDialog;
		vm.clearSearch = clearSearch;
		vm.search = search;
		vm.deleteItem = deleteItem;		
		vm.showLocations = showLocations;
		vm.showOperationTypes = showOperationTypes;
		
		function showOperationTypes(item){
			$state.go("main.stocks.warehouse-operation-type", {warehouseId: item.id});
		}
		
		function showLocations(item){
			$state.go("main.stocks.warehouse-location", {warehouseId: item.id});
		}
		
		function deleteItem(item){
			$confirm({ text: String.format("Souhaitez-vous supprimer l'entrepôt {0} ?", item.name), title: "Supprimer un entrepôt", ok: 'Oui', cancel: 'Non' })
        	.then(function () {

        		apiService.remove("/web/api/warehouse/" + item.id, {},
    					function(response){
    						search();    						
    						notificationService.displaySuccess("L'entrepôt " + item.name + " a été supprimé avec succès !");
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
                templateUrl: 'modules/stocks/settings/warehouse/editWarehouseView.html',
                controller: 'editWarehouseCtrl as vm',
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
			apiService.get('/web/api/warehouse/search', config, 
					function(result){					
						vm.loadingData = false;
			            vm.totalCount = result.data.totalCount;
			            vm.currentPage = result.data.page;
			            
						vm.items = result.data.items;
					});
		}
		
		this.$onInit = function(){
			vm.pageSize = 4;
			
			search();			
		}
	}
	
})(angular.module('lightpro'));