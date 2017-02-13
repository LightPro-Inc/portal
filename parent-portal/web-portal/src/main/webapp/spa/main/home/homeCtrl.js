(function(app){
	'use strict';
	
	app.controller('homeCtrl', homeCtrl);
	
	homeCtrl.$inject = ['apiService', '$scope', '$rootScope', 'notificationService', '$interval', 'membershipService', '$q'];
	function homeCtrl(apiService, $scope, $rootScope, notificationService, $interval, membershipService, $q){
		var vm = this;
			    
		this.$onInit = function(){
		        		
		}
	}
	
})(angular.module('lightpro'));