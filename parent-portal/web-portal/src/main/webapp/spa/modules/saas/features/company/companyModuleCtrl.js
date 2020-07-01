(function(app){
	'use strict';
	
	app.controller('companyModuleCtrl', companyModuleCtrl);
	
	companyModuleCtrl.$inject = ['apiService', '$uibModal', '$confirm', 'notificationService', '$state', '$previousState','$stateParams'];	
	function companyModuleCtrl(apiService, $uibModal, $confirm, notificationService, $state, $previousState, $stateParams){
		var vm = this;
		
		vm.companyId = $stateParams.companyId;
		
		vm.clearSearchFreeModule = clearSearchFreeModule;
		vm.searchFreeModule = searchFreeModule;
		vm.clearSearchPdToSale = clearSearchPdToSale;
		vm.searchPdToSale = searchPdToSale;
		vm.addProduct = addProduct;
		vm.activateProduct = activateProduct;
		vm.removeProduct = removeProduct;
		vm.goPreviousPage = goPreviousPage;
		vm.configureFeatures = configureFeatures;
		vm.uninstallModule = uninstallModule;
		vm.installModule = installModule;
		vm.unactivateProduct = unactivateProduct;
		
		function installModule(module){
			
			$confirm({ text: String.format("Souhaitez-vous installer le module {0} ?", module.name), title: 'Installer un module', ok: 'Oui', cancel: 'Non' })
        	.then(function () {
        		apiService.post(String.format("/web/api/{0}/module/{1}/install", module.shortName, vm.companyId), {},
    					function(response){
    						vm.pageChangedPdToSale();	
    						
    						notificationService.displaySuccess("Le module " + module.name + " a été installé avec succès !");
    					},
    					function(error){
    						
    					}
    			);
        	});  			
		}

		function uninstallModule(module){
			
			$confirm({ text: String.format("Souhaitez-vous désinstaller le module {0} ?\n\nCette action supprimera toutes vos données de production de manière irreversible !", module.name), title: 'Désinstaller un module', ok: 'Oui', cancel: 'Non' })
        	.then(function () {
        		apiService.post(String.format("/web/api/{0}/module/{1}/uninstall", module.shortName, vm.companyId), {},
    					function(response){
    						vm.pageChangedPdToSale();	
    						
    						notificationService.displaySuccess("Le module " + module.name + " a été désinstallé avec succès !");
    					},
    					function(error){
    						
    					}
    			);
        	});  			
		}
		
		function configureFeatures(item){
			$uibModal.open({
                templateUrl: 'modules/saas/features/company/editModuleFeatureView.html',
                controller: 'editModuleFeatureCtrl as vm',
                size : 'lg',
                resolve: {
                    data: {
                    	companyId : vm.companyId,
                    	moduleTypeId : item.typeId
                    }
                }
            }).result.then(function () {
            	
            }, function () {

            });
		}
		
		function goPreviousPage(){
			$previousState.go();
		}
		
		function removeProduct(item) {
			$confirm({ text: "Souhaitez-vous retirer le module " + item.name + " ?", title: 'Retirer un module', ok: 'Oui', cancel: 'Non' })
        	.then(function () {
        		vm.loadingDataPdToSale = true;
    			apiService.post(String.format('/web/api/saas/company/{0}/module/{1}/unsubscribe', vm.companyId, item.typeId), {}, 
    					function(result){					
    						vm.loadingDataPdToSale = false;
    						vm.pageChangedPdToSale();
    						vm.pageChangedFreeModule();
    					}, function(error){
    						vm.loadingDataPdToSale = false;
    						
    					});
        	});			
		}
		
		function addProduct(item) {
			$confirm({ text: "Souhaitez-vous ajouter le module " + item.name + " ?", title: 'Ajouter un module', ok: 'Oui', cancel: 'Non' })
        	.then(function () {
        		vm.loadingDataAddProduct = true;
    			apiService.post(String.format('/web/api/saas/company/{0}/module/{1}/subscribe', vm.companyId, item.typeId), {}, 
    					function(result){					
    						vm.loadingDataAddProduct = false;
    						vm.pageChangedPdToSale();
    						vm.pageChangedFreeModule();
    					}, function(error){
    						vm.loadingDataAddProduct = false;
    						
    					});
        	});				
		}
		
		function activateProduct(item) {
			$confirm({ text: "Souhaitez-vous activer le module " + item.name + " ?", title: 'Activer un module', ok: 'Oui', cancel: 'Non' })
        	.then(function () {
        		vm.loadingDataAddProduct = true;
    			apiService.post(String.format('/web/api/saas/company/{0}/module/{1}/activate', vm.companyId, item.typeId), {}, 
    					function(result){					
    						vm.loadingDataAddProduct = false;
    						vm.pageChangedPdToSale();
    					}, function(error){
    						vm.loadingDataAddProduct = false;
    						
    					});
        	});				
		}
		
		function unactivateProduct(item) {
			$confirm({ text: "Souhaitez-vous désactiver le module " + item.name + " ?", title: 'Désactiver un module', ok: 'Oui', cancel: 'Non' })
        	.then(function () {
        		vm.loadingDataAddProduct = true;
    			apiService.post(String.format('/web/api/saas/company/{0}/module/{1}/unactivate', vm.companyId, item.typeId), {}, 
    					function(result){					
    						vm.loadingDataAddProduct = false;
    						vm.pageChangedPdToSale();
    					}, function(error){
    						vm.loadingDataAddProduct = false;
    						
    					});
        	});				
		}
		
		vm.pageChangedFreeModule = function(){
			searchFreeModule(vm.currentPageFreeModule);
		}
		
		function clearSearchFreeModule(){
			vm.filterFreeModule = "";
			searchFreeModule();
		}
		
		function searchFreeModule(pageFreeModule){
			pageFreeModule = pageFreeModule ? pageFreeModule : 1;

			var config = {
				params : {
		                page: pageFreeModule,
		                pageSize: vm.pageSizeFreeModule,
		                filter: vm.filterFreeModule
		            }	
			};
			            
			vm.loadingDataFreeModule = true;
			apiService.get(String.format('/web/api/saas/company/{0}/module/available/search', vm.companyId), config, 
					function(result){					
						vm.loadingDataFreeModule = false;
			            vm.totalCountFreeModule = result.data.totalCount;
			            vm.currentPageFreeModule = result.data.page;
			            
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
			apiService.get(String.format('/web/api/saas/company/{0}/module/subscribed/search', vm.companyId), config, 
					function(result){					
						vm.loadingDataPdToSale = false;
			            vm.totalCountPdToSale = result.data.totalCount;
			            vm.currentPagePdToSale = result.data.page;
			            
			            vm.productsToSale = result.data.items;
					});
		}
		
		this.$onInit = function(){
			vm.pageSizeFreeModule = 5;
			vm.pageSizePdToSale = 5;
			
			searchFreeModule();
			searchPdToSale();
			
			apiService.get(String.format('/web/api/saas/company/{0}', vm.companyId), {}, 
						function(response){
							vm.company = response.data;
						}
			);
		}
	}
	
})(angular.module('lightpro'));