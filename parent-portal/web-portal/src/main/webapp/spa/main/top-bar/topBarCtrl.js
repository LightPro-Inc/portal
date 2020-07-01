
(function(app){
	'use strict';

	app.controller('topBarCtrl', topBarCtrl);

	topBarCtrl.$inject = ['$state', 'membershipService', 'apiService', '$rootScope'];
	function topBarCtrl($state, membershipService, apiService, $rootScope) {

		var vm = this;
		vm.logout = logout;
		vm.isActive = isActive;
		
		function isActive(module){
			return $state.includes(module.parentUrl);
		}
		
		function logout() {
			membershipService.logout();
		    $state.go('login');
		}

		function loadUsed(){
			apiService.get("/web/api/module/used", {},
					function(response){
						vm.modulesInstalled = response.data;
						angular.forEach(vm.modulesInstalled, function(module){
							module.url = String.format("main.{0}.dashboard", module.shortName);
							module.parentUrl = String.format("main.{0}", module.shortName);							
						});
					}
			);				
		}		
		
		$rootScope.$on('modules-configured', function(event, args) {
			loadUsed();
		});
		
		this.$onInit = function () {
			loadUsed();					
		}
	}

})(angular.module('lightpro'));