(function(app){
	'use strict';
	
	app.controller('comptaDashboardCtrl', comptaDashboardCtrl);
	
	comptaDashboardCtrl.$inject = ['apiService', '$rootScope', 'notificationService', '$q', '$uibModal'];
	function comptaDashboardCtrl(apiService, $rootScope, notificationService, $q, $uibModal){
		var vm = this;
		
		this.$onInit = function(){
			
		}
	}
	
})(angular.module('lightpro'));