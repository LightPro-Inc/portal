(function(app){
	'use strict';
	
	app.controller('pdvDashboardCtrl', pdvDashboardCtrl);
	
	pdvDashboardCtrl.$inject = ['apiService', '$scope', '$rootScope', 'notificationService', '$interval', 'membershipService', '$q'];
	function pdvDashboardCtrl(apiService, $scope, $rootScope, notificationService, $interval, membershipService, $q){
		var vm = this;
		
		
		this.$onInit = function(){
		       		
		}
	}
	
})(angular.module('lightpro'));