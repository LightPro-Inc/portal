(function(app){
	'use strict';
	
	app.controller('productCtrl', productCtrl);
	
	productCtrl.$inject = ['apiService', '$uibModal', '$confirm', 'notificationService', '$state', '$previousState', '$stateParams'];	
	function productCtrl(apiService, $uibModal, $confirm, notificationService, $state, $previousState, $stateParams){
		var vm = this;
		
		vm.categoryId = $stateParams.categoryId;
		
		vm.addNew = addNew;
		vm.openEditDialog = openEditDialog;
		vm.clearSearch = clearSearch;
		vm.search = search;
		vm.deleteItem = deleteItem;		
		vm.showTaxes = showTaxes;
		vm.showPricing = showPricing;	
		
		function showPricing(item){
			$state.go("main.sales.product-pricing", {productId: item.id}, {location: false});
		}
		
		function showTaxes(item){
			$state.go("main.sales.product-tax", {productId: item.id}, {location: false});
		}
		
		function deleteItem(item){
			$confirm({ text: String.format("Souhaitez-vous supprimer le produit {0} ?", item.name), title: "Supprimer un produit", ok: 'Oui', cancel: 'Non' })
        	.then(function () {

        		apiService.remove("/web/api/product/" + item.id, {},
    					function(response){
    						search();    						
    						notificationService.displaySuccess(String.format("Le produit {0} a été supprimé avec succès !", item.name));
    					},
    					function(error){
    						
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
                templateUrl: 'modules/sales/settings/product/editProductView.html',
                controller: 'editProductCtrl as vm',
                resolve: {
                    data: {
                    	item : item,
                    	categoryId: item ? item.categoryId : vm.categoryId
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
		                filter: vm.filter, 
		                categoryId: vm.categoryId
		            }	
			};
			            
			vm.loadingData = true;
			apiService.get('/web/api/product/search', config, 
					function(result){					
						vm.loadingData = false;
			            vm.totalCount = result.data.totalCount;
			            vm.currentPage = result.data.page;
			            
						vm.items = result.data.items;
					});
		}
		
		this.$onInit = function(){
			vm.pageSize = 4;
			
			apiService.get('/web/api/product-category', {}, 
					function(response){
						vm.categories = response.data;						
					});	
			
			search();
		}
	}
	
})(angular.module('lightpro'));