(function(app){
	'use strict';

	app.controller('stocksSideBarCtrl', stocksSideBarCtrl);

	stocksSideBarCtrl.$inject = [];
	function stocksSideBarCtrl() {
	    var vm = this;
	    
	    vm.selectMenu = selectMenu;
	    
	    function selectMenu() {
	    	$('.row-offcanvas').removeClass('active');
	    }
	}
})(angular.module('lightpro'));