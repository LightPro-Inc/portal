(function(app){
	'use strict';
	
	app.controller('interfacageCtrl', interfacageCtrl);
	
	interfacageCtrl.$inject = ['apiService', '$uibModal', '$confirm', 'notificationService', '$state', '$q', '$stateParams'];	
	function interfacageCtrl(apiService, $uibModal, $confirm, notificationService, $state, $q, $stateParams){
		var vm = this;		
		
		vm.selectMenu = selectMenu;
	    
	    function selectMenu() {
	    	$('.row-offcanvas').removeClass('active');
	    }
	    
		this.$onInit = function(){
			
		}
	}
	
})(angular.module('lightpro'));