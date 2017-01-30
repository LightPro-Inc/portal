(function(app){
	'use strict';
	
	app.controller('enterpriseCtrl', enterpriseCtrl);
	
	enterpriseCtrl.$inject = ['apiService', 'notificationService', '$rootScope', '$timeout'];
	function enterpriseCtrl(apiService, notificationService, $rootScope, $timeout){
		var vm = this;
		
		vm.Save = save;
		
		function save(){
			apiService.put('/web/api/company', vm.company, 
					function(response){
						$rootScope.company = vm.company;
						$rootScope.companyCurrency = vm.company.currencyShortName;
						notificationService.displaySuccess("La mise à jour a été effectuée avec succès !");
					}, function(error){
						notificationService.displayError(error);
					});
		}
		
		this.$onInit = function(){
			apiService.get('/web/api/company', null, 
					function(response){
						vm.company = response.data;
					});	
		}
	}
	
})(angular.module('lightpro'));