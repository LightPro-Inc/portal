(function(app){
	'use strict';
	
	app.controller('moduleCtrl', moduleCtrl);
	
	moduleCtrl.$inject = ['apiService', '$rootScope', 'notificationService', 'utilityService', '$confirm', '$sce'];
	function moduleCtrl(apiService, $rootScope, notificationService, utilityService, $confirm, $sce){
		var vm = this;
		
		vm.installModule = installModule;
		vm.uninstallModule = uninstallModule;
		vm.activateModule = activateModule;
		
		vm.clearSearchInst = clearSearchInst;
		vm.searchInst = searchInst;
		vm.clearSearchDispo = clearSearchDispo;
		vm.searchDispo = searchDispo;
		
		vm.pageChangedInst = function(){
			searchInst(vm.currentPageInst);
		}
		
		vm.pageChangedDispo = function(){
			searchDispo(vm.currentPageDispo);
		}
		
		function clearSearchInst(){
			vm.filterInst = "";
			searchInst();
		}
		
		function clearSearchDispo(){
			vm.filterDispo = "";
			searchDispo();
		}
		
		function installModule(module){
			$confirm({ text: String.format("Souhaitez-vous installer le module {0} ?", module.name), title: 'Installer un module', ok: 'Oui', cancel: 'Non' })
        	.then(function () {

        		apiService.post(String.format("/web/api/{0}/module/install", module.shortName), {},
    					function(response){
        					loadModules();	
    						
    						notificationService.displaySuccess("Le module " + module.name + " a été installé avec succès !");
    						$rootScope.$broadcast('modules-configured', { });
    						
    					},
    					function(error){
    						
    					}
    			);
        	});  					
		}
		
		function uninstallModule(module){
			$confirm({ text: String.format("Souhaitez-vous désinstaller le module {0} ?\n\nCette action supprimera toutes vos données de production de manière irreversible !", module.name), title: 'Désinstaller un module', ok: 'Oui', cancel: 'Non' })
        	.then(function () {

        		apiService.post(String.format("/web/api/{0}/module/uninstall", module.shortName), {},
    					function(response){
        					loadModules();	
    						
    						notificationService.displaySuccess("Le module " + module.name + " a été désinstallé avec succès !");
    						$rootScope.$broadcast('modules-configured', { });
    					},
    					function(error){
    						
    					}
    			);
        	});  					
		}
		
		function activateModule(item){
			var title = item.isActive ? String.format("Souhaitez-vous désactiver le module {0} ?", item.name) : String.format("Souhaitez-vous activer le module {0} ?", item.name);
			
			$confirm({ text: title, title: "Activation d'un module", ok: 'Oui', cancel: 'Non' })
        	.then(function () {

        		apiService.post("/web/api/module/" + item.typeId + "/use", {used : !item.isActive},
    					function(response){
        					searchInst();
    						
        					var msg = item.isActive ? String.format("Le module {0} a été désactivé avec succès !", item.name) : String.format("Le module {0} a été activé avec succès !", item.name)
            				notificationService.displaySuccess(msg);
    						
        					$rootScope.$broadcast('modules-configured', { });
    					},
    					function(error){
    						
    					}
    			);
        	});  					
		}
		
		function loadModules(){
			searchDispo();
			searchInst();
		}
		
		function searchDispo(page){
			page = page ? page : 1;

			var config = {
				params : {
		                page: page,
		                pageSize: vm.pageSizeDispo,
		                filter: vm.filterDispo
		            }	
			};
			            
			vm.loadingDataDispo = true;
			apiService.get('/web/api/module/available/search', config, 
					function(result){					
						vm.loadingDataDispo = false;
			            vm.totalCountDispo = result.data.totalCount;
			            vm.currentPageDispo = result.data.page;
			            
						vm.modulesAvailable = result.data.items;
					});
		}
		
		function searchInst(page){
			page = page ? page : 1;

			var config = {
				params : {
		                page: page,
		                pageSize: vm.pageSizeInst,
		                filter: vm.filterInst
		            }	
			};
			            
			vm.loadingDataInst = true;
			apiService.get('/web/api/module/installed/search', config, 
					function(result){					
						vm.loadingDataInst = false;
			            vm.totalCountInst = result.data.totalCount;
			            vm.currentPageInst = result.data.page;
			            
						vm.modulesInstalled = result.data.items;
					});
		}
		
		this.$onInit = function() {
			vm.pageSizeInst = 4;
			vm.pageSizeDispo = 4;
			
			loadModules();								
		}
	}
})(angular.module('lightpro'));