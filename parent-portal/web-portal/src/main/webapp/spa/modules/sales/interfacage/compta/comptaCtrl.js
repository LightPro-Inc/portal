(function(app){
	'use strict';
	
	app.controller('comptaSalesInterfaceCtrl', comptaSalesInterfaceCtrl);
	
	comptaSalesInterfaceCtrl.$inject = ['apiService', 'notificationService'];
	function comptaSalesInterfaceCtrl(apiService, notificationService){
		var vm = this;
		
		this.$onInit = function() {
			vm.active = 0;
		}
		
	}
})(angular.module('lightpro'));