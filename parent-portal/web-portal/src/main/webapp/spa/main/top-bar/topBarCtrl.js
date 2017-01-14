
(function(app){
	'use strict';

	app.controller('topBarCtrl', topBarCtrl);

	topBarCtrl.$inject = ['$state', 'membershipService', 'apiService', '$rootScope'];
	function topBarCtrl($state, membershipService, apiService, $rootScope) {

		var vm = this;
		vm.logout = logout;
		
		function logout() {
			membershipService.logout();
		    $state.go('login');
		}

		function loadInstalled(){
			apiService.get("/web/api/company/modulesInstalled", null,
					function(response){
						vm.modulesInstalled = response.data;
					}
			);				
		}		
		
		$rootScope.$on('modules-configured', function(event, args) {
			loadInstalled();
		});
		
		this.$onInit = function () {
			loadInstalled();					
		}
	}

})(angular.module('lightpro'));