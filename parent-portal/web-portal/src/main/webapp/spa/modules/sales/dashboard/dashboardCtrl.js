(function(app){
	'use strict';
	
	app.controller('salesDashboardCtrl', salesDashboardCtrl);
	
	salesDashboardCtrl.$inject = ['apiService', '$scope', '$rootScope', 'notificationService', '$interval'];
	function salesDashboardCtrl(apiService, $scope, $rootScope, notificationService, $interval){
		var vm = this;
		
		this.$onInit = function(){
							
		}
	}
	
})(angular.module('lightpro'));