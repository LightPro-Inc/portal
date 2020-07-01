(function(app){
	'use strict';

	app.controller('settingsSideBarCtrl', settingsSideBarCtrl);

	settingsSideBarCtrl.$inject = ['$rootScope'];
	function settingsSideBarCtrl($rootScope) {
	    var vm = this;
	    
	    vm.selectMenu = selectMenu;
	    
	    function selectMenu() {
	    	$('.row-offcanvas').removeClass('active');
	    }
	}
})(angular.module('lightpro'));