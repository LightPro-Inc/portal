(function(app){
	'use strict';
	
	app.controller('moduleCtrl', moduleCtrl);
	
	moduleCtrl.$inject = ['apiService', '$rootScope', 'notificationService', 'utilityService', '$confirm', '$sce'];
	function moduleCtrl(apiService, $rootScope, notificationService, utilityService, $confirm, $sce){
		var vm = this;
		
		vm.installModule = installModule;
		vm.uninstallModule = uninstallModule;
		vm.activateModule = activateModule;
		
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
		
		function activateModule(item){
			var title = item.active ? String.format("Souhaitez-vous désactiver le module {0} ?", item.name) : String.format("Souhaitez-vous activer le module {0} ?", item.name);
			
			$confirm({ text: title, title: "Activation d'un module", ok: 'Oui', cancel: 'Non' })
        	.then(function () {

        		apiService.post("/web/api/company/module/" + item.typeId + "/activate", {active : !item.active},
    					function(response){
        					loadInstalled();
    						
        					var msg = item.active ? String.format("Le module {0} a été désactivé avec succès !", item.name) : String.format("Le module {0} a été activé avec succès !", item.name)
            				notificationService.displaySuccess(msg);
    						
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