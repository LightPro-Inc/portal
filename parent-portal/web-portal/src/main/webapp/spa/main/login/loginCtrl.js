(function(app){
	'use strict';

	app.controller('loginCtrl', loginCtrl);

	loginCtrl.$inject = [ 'notificationService', '$state', '$timeout', 'apiService', 'membershipService'];

	function loginCtrl(notificationService, $state, $timeout, apiService, membershipService) {

		var vm = this;
		vm.login = login;
		vm.credentials = {};

		function login() {
			membershipService.login(vm.credentials, function(response){
				loginCompleted(response)
			});			
		}

		function routeToHomePage() {
		    $state.go('main.dashboard');
		}

		function loginCompleted(result){
		    if (result.data.isValid) {
		        notificationService.displaySuccess('Bienvenue ' + vm.credentials.username);
		        routeToHomePage();		        
			}
			else {
				notificationService.displayError("Pseudo ou mot de passe invalide. Réessayez, s'il vous plait.");
			}
		}
	}

})(angular.module('common.core'));