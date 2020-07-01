(function(app){
	'use strict';
	
	app.controller('stocksInterfaceCtrl', stocksInterfaceCtrl);
	
	stocksInterfaceCtrl.$inject = ['apiService', 'notificationService'];
	function stocksInterfaceCtrl(apiService, notificationService){
		var vm = this;
		
		this.$onInit = function() {
			vm.active = 0;
		}
		
	}
})(angular.module('lightpro'));