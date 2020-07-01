(function(app){
	'use strict';
	
	app.controller('salesInterfaceCtrl', salesInterfaceCtrl);
	
	salesInterfaceCtrl.$inject = ['apiService', 'notificationService'];
	function salesInterfaceCtrl(apiService, notificationService){
		var vm = this;
		
		this.$onInit = function() {
			vm.active = 0;
		}
		
	}
})(angular.module('lightpro'));