(function(app){
	'use strict';
	
	app.controller('moduleCtrl', moduleCtrl);
	
	moduleCtrl.$inject = ['apiService', '$rootScope', 'notificationService', 'utilityService', '$confirm', '$sce'];
	function moduleCtrl(apiService, $rootScope, notificationService, utilityService, $confirm, $sce){
		var vm = this;
		
		vm.installModule = installModule;
		vm.uninstallModule = uninstallModule;
		
		function installModule(module){
			$confirm({ text: String.format("Souhaitez-vous installer le module {0} ?", module.name), title: 'Installer un module', ok: 'Oui', cancel: 'Non' })
        	.then(function () {

        		apiService.post("/web/api/company/module/" + module.id + "/install", {},
    					function(response){
    						utilityService.remove(vm.modulesAvailable, 'id', module.id);
    						vm.modulesInstalled.push(module);
    						
    						notificationService.displaySuccess("Le module " + module.name + " a été installé avec succès !");
    						$rootScope.$broadcast('modules-configured', { });
    						
    					},
    					function(error){
    						notificationService.displayError(error);
    					}
    			);
        	});  					
		}
		
		function uninstallModule(module){
			$confirm({ text: String.format("Souhaitez-vous désinstaller le module {0} ?\n\nCette action supprimera toutes vos données de production de manière irreversible !", module.name), title: 'Désinstaller un module', ok: 'Oui', cancel: 'Non' })
        	.then(function () {

        		apiService.post("/web/api/company/module/" + module.id + "/uninstall", {},
    					function(response){
    						utilityService.remove(vm.modulesInstalled, 'id', module.id);
    						vm.modulesAvailable.push(module);
    						
    						notificationService.displaySuccess("Le module " + module.name + " a été désinstallé avec succès !");
    						$rootScope.$broadcast('modules-configured', { });
    					},
    					function(error){
    						notificationService.displayError(error);
    					}
    			);
        	});  					
		}
		
		function loadAvailables(){
			apiService.get("/web/api/company/modulesAvailable", null,
					function(response){
						vm.modulesAvailable = response.data;
					}
			);
		}
		
		function loadInstalled(){
			apiService.get("/web/api/company/modulesInstalled", null,
					function(response){
						vm.modulesInstalled = response.data;
					}
			);
		}
		
		this.$onInit = function() {
			
			loadAvailables();
			loadInstalled();									
		}
	}
})(angular.module('lightpro'));