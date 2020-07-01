(function(app){
	'use strict';
	
	app.controller('mainCtrl', mainCtrl);
	
	mainCtrl.$inject = ['apiService', '$rootScope', '$q', '$timeout'];
	function mainCtrl(apiService, $rootScope, $q, $timeout) {
		
		apiService.get('/web/api/company', {}, 
				function(response){
					$rootScope.company = response.data;
					
					apiService.get('/web/api/currency/' + $rootScope.company.currencyId, {}, 
							function(response1){
								$rootScope.companyCurrency = response1.data;		
							}, function(error){
								
							});
				});	
	}
	
})(angular.module('lightpro'));