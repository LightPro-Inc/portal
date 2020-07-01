(function(app){
	'use strict';

	app.controller('salesSideBarCtrl', salesSideBarCtrl);

	salesSideBarCtrl.$inject = [];
	function salesSideBarCtrl() {
	    var vm = this;
	    
	    vm.selectMenu = selectMenu;
	    
	    function selectMenu() {
	    	$('.row-offcanvas').removeClass('active');
	    }
	    
	}
})(angular.module('lightpro'));