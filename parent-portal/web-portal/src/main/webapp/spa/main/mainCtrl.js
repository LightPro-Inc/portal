(function(app){
	'use strict';
	
	app.controller('mainCtrl', mainCtrl);
	
	mainCtrl.$inject = ['apiService', '$rootScope', '$q', '$timeout'];
	function mainCtrl(apiService, $rootScope, $q, $timeout) {
		$rootScope.company = apiService.get('/web/api/company', null, 
				function(response){
					$rootScope.companyCurrency = response.data.currencyShortName;
					return response.data;
				});	
	}
	
})(angular.module('lightpro'));