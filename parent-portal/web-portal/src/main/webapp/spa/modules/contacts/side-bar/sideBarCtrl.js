(function(app){
	'use strict';

	app.controller('contactsSideBarCtrl', contactsSideBarCtrl);

	contactsSideBarCtrl.$inject = [];
	function contactsSideBarCtrl() {
	    var vm = this;
	    
	    vm.selectMenu = selectMenu;
	    
	    function selectMenu() {
	    	$('.row-offcanvas').removeClass('active');
	    }
	}
})(angular.module('lightpro'));