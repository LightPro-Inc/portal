(function(app){
	'use strict';
	
	app.controller('productCategoryCtrl', productCategoryCtrl);
	
	productCategoryCtrl.$inject = ['apiService', '$uibModal', '$confirm', 'notificationService', '$state', '$previousState'];	
	function productCategoryCtrl(apiService, $uibModal, $confirm, notificationService, $state, $previousState){
		var vm = this;
		
		vm.addNew = addNew;
		vm.openEditDialog = openEditDialog;
		vm.clearSearch = clearSearch;
		vm.search = search;
		vm.deleteItem = deleteItem;		
		vm.showProducts = showProducts;
		
		function showProducts(item){
			$state.go("main.sales.product", {categoryId: item.id});
		}
		
		function deleteItem(item){
			$confirm({ text: String.format("Souhaitez-vous supprimer la catégorie de produit '{0}' ?", item.name), title: "Supprimer une catégorie de produit", ok: 'Oui', cancel: 'Non' })
        	.then(function () {

        		apiService.remove("/web/api/product-category/" + item.id, {},
    					function(response){
    						search();    						
    						notificationService.displaySuccess(String.format("La catégorie de produit {0} a été supprimée avec succès !", item.name));
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
                templateUrl: 'modules/sales/settings/product-category/editProductCategoryView.html',
                controller: 'editProductCategoryCtrl as vm',
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
			apiService.get('/web/api/product-category/search', config, 
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