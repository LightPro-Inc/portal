(function(app){
	'use strict';
	
	app.controller('pdvProductCtrl', pdvProductCtrl);
	
	pdvProductCtrl.$inject = ['apiService', '$uibModal', '$confirm', 'notificationService', '$state', '$previousState','$stateParams'];	
	function pdvProductCtrl(apiService, $uibModal, $confirm, notificationService, $state, $previousState, $stateParams){
		var vm = this;
		
		vm.pdvId = $stateParams.pdvId;
		
		vm.clearSearchFreePdv = clearSearchFreePdv;
		vm.searchFreePdv = searchFreePdv;
		vm.clearSearchPdToSale = clearSearchPdToSale;
		vm.searchPdToSale = searchPdToSale;
		vm.addProduct = addProduct;
		vm.removeProduct = removeProduct;
		vm.goPreviousPage = goPreviousPage;
		
		function goPreviousPage(){
			$previousState.go();
		}
		
		function removeProduct(item) {
			vm.loadingDataPdToSale = true;
			apiService.remove(String.format('/web/api/pdv/pdv/{0}/product/{1}', vm.pdvId, item.id), {}, 
					function(result){					
						vm.loadingDataPdToSale = false;
						vm.pageChangedPdToSale();
						vm.pageChangedFreePdv();
					}, function(error){
						vm.loadingDataPdToSale = false;
						notificationService.displayError(error);
					});
		}
		
		function addProduct(item) {
			vm.loadingDataAddProduct = true;
			apiService.post(String.format('/web/api/pdv/pdv/{0}/product/{1}', vm.pdvId, item.id), {}, 
					function(result){					
						vm.loadingDataAddProduct = false;
						vm.pageChangedPdToSale();
						vm.pageChangedFreePdv();
					}, function(error){
						vm.loadingDataAddProduct = false;
						notificationService.displayError(error);
					});
		}
		
		vm.pageChangedFreePdv = function(){
			searchFreePdv(vm.currentPageFreePdv);
		}
		
		function clearSearchFreePdv(){
			vm.filterFreePdv = "";
			searchFreePdv();
		}
		
		function searchFreePdv(pageFreePdv){
			pageFreePdv = pageFreePdv ? pageFreePdv : 1;

			var config = {
				params : {
		                page: pageFreePdv,
		                pageSize: vm.pageSizeFreePdv,
		                filter: vm.filterFreePdv
		            }	
			};
			            
			vm.loadingDataFreePdv = true;
			apiService.get(String.format('/web/api/pdv/pdv/{0}/free-product/search', vm.pdvId), config, 
					function(result){					
						vm.loadingDataFreePdv = false;
			            vm.totalCountFreePdv = result.data.totalCount;
			            vm.currentPageFreePdv = result.data.page;
			            
			            vm.freeProducts = result.data.items;
					});
		}
		
		vm.pageChangedPdToSale = function(){
			searchPdToSale(vm.currentPagePdToSale);
		}
		
		function clearSearchPdToSale(){
			vm.filterPdToSale = "";
			searchPdToSale();
		}
		
		function searchPdToSale(pagePdToSale){
			pagePdToSale = pagePdToSale ? pagePdToSale: 1;

			var config = {
				params : {
		                page: pagePdToSale,
		                pageSize: vm.pageSizePdToSale,
		                filter: vm.filterPdToSale
		            }	
			};
			            
			vm.loadingDataPdToSale = true;
			apiService.get(String.format('/web/api/pdv/pdv/{0}/product-to-sale/search', vm.pdvId), config, 
					function(result){					
						vm.loadingDataPdToSale = false;
			            vm.totalCountPdToSale = result.data.totalCount;
			            vm.currentPagePdToSale = result.data.page;
			            
			            vm.productsToSale = result.data.items;
					});
		}
		
		this.$onInit = function(){
			vm.pageSizeFreePdv = 5;
			vm.pageSizePdToSale = 5;
			
			searchFreePdv();
			searchPdToSale();
			
			apiService.get(String.format('/web/api/pdv/pdv/{0}', vm.pdvId), {}, 
						function(response){
							vm.pdv = response.data;
						}
			);
		}
	}
	
})(angular.module('lightpro'));