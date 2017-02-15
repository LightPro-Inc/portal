(function(app){
	'use strict';

	app.controller('loginCtrl', loginCtrl);

	loginCtrl.$inject = [ 'notificationService', '$state', '$timeout', 'apiService', 'membershipService', '$rootScope'];

	function loginCtrl(notificationService, $state, $timeout, apiService, membershipService, $rootScope) {

		var vm = this;
		vm.login = login;
		vm.credentials = {};

		function login() {
			
			var credentials = angular.copy(vm.credentials);
			
			var hasLoginDomain = credentials.fullUsername.split("@").length >= 2;
			
			if(!hasLoginDomain)
			{
				if($rootScope.repository.domain == undefined){
					notificationService.displayInfo("Format pseudo accepté : pseudo@nom-domaine-entreprise !");
					return;
				}else {
					credentials.fullUsername += $rootScope.repository.domain;
				}				
			}
			
			membershipService.login(credentials, function(response){
				loginCompleted(response);
			});			
		}

		function routeToHomePage() {
		    $state.go('main.dashboard');
		}

		function loginCompleted(result){
			notificationService.displaySuccess('Bienvenue ' + vm.credentials.fullUsername);
	        routeToHomePage();
		}
	}

})(angular.module('common.core'));