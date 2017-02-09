(function(app){
	'use strict';
	
	app.controller('operationTypeCtrl', operationTypeCtrl);
	
	operationTypeCtrl.$inject = ['apiService', '$uibModal', '$confirm', 'notificationService', '$stateParams', '$state', '$rootScope', '$previousState', 'utilityService'];
	function operationTypeCtrl(apiService, $uibModal, $confirm, notificationService, $stateParams, $state, $rootScope, $previousState, utilityService){
		var vm = this;
		
		vm.warehouseId = $stateParams.warehouseId;
		
		vm.addNew = addNew;
		vm.addNewOperation = addNewOperation;
		vm.openEditDialog = openEditDialog;
		vm.clearSearch = clearSearch;
		vm.search = search;
		vm.deleteItem = deleteItem;		
		vm.showUnfinishedOperations = showUnfinishedOperations;
		vm.warehouseChanged = warehouseChanged;
		
		function warehouseChanged(warehouseId){
			search();
		}
		
		function addNewOperation(type){
			$state.go('main.stocks.edit-operation', {operationTypeId: type.id});
		}
		
		function showUnfinishedOperations(item){
			$state.go('main.stocks.unfinished-operation', {operationTypeId: item.id});
		}
		
		function deleteItem(item){
			$confirm({ text: String.format("Souhaitez-vous supprimer l'emplacement {0} ?", item.name), title: "Supprimer un emplacement", ok: 'Oui', cancel: 'Non' })
        	.then(function () {

        		apiService.remove(String.format("/web/api/operation-type/{0}", item.id), {},
    					function(response){
    						search();    						
    						notificationService.displaySuccess(String.format("L'article {0} a été supprimé avec succès !", item.name));
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
                templateUrl: 'modules/stocks/settings/operation-type/editOperationTypeView.html',
                controller: 'editOperationTypeCtrl as vm',
                resolve: {
                    data: {
                    	warehouseId : item ? item.warehouseId : vm.warehouseId,
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
			apiService.get(String.format('/web/api/warehouse/{0}/operation-type/search', vm.warehouseId), config, 
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
		
		this.$onInit = function(){
			vm.pageSize = 4;
			
			apiService.get(String.format('/web/api/warehouse'), {}, 
					function(response){
						vm.warehouses = response.data;
						
						if(!vm.warehouseId && vm.warehouses.length > 0)
							vm.warehouseId = vm.warehouses[0].id;
						
						warehouseChanged(vm.warehouseId);
					}
			);				
		}
	}
	
})(angular.module('lightpro'));