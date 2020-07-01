(function(app){
	'use strict';
	
	app.controller('salesInterfacageCtrl', salesInterfacageCtrl);
	
	salesInterfacageCtrl.$inject = ['apiService', '$uibModal', '$confirm', 'notificationService', '$state', '$q', '$stateParams'];	
	function salesInterfacageCtrl(apiService, $uibModal, $confirm, notificationService, $state, $q, $stateParams){
		var vm = this;		
		
		vm.selectMenu = selectMenu;
	    
	    function selectMenu() {
	    	$('.row-offcanvas').removeClass('active');	    	
	    }
	    
		this.$onInit = function(){
			
			vm.loadingData = true;
			apiService.get("/web/api/sales/interfacage/module-available", {},
					function(response){
						vm.loadingData = false;						
						vm.modules = response.data;
						
						if(vm.modules.length > 0){
							var module = vm.modules[0];		
							$state.go(String.format("main.sales.interfacage.{0}", module.shortName), {}, {location: true});
							selectMenu();
						}
					});
		}
	}
	
})(angular.module('lightpro'));