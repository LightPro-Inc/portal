(function(app){
	'use strict';
	
	app.controller('homeCtrl', homeCtrl);
	
	homeCtrl.$inject = ['apiService', '$rootScope', '$state'];
	function homeCtrl(apiService, $rootScope, $state){
		var vm = this;
		
		this.$onInit = function(){
			
		}
		
	}
})(angular.module('lightpro'));