(function(app){
	'use strict';
	
	app.controller('saasDashboardCtrl', saasDashboardCtrl);
	
	saasDashboardCtrl.$inject = ['apiService', '$scope', '$rootScope', 'notificationService', '$interval', 'membershipService', '$q'];
	function saasDashboardCtrl(apiService, $scope, $rootScope, notificationService, $interval, membershipService, $q){
		var vm = this;		
	    
		this.$onInit = function(){
							
		}
	}
	
})(angular.module('lightpro'));