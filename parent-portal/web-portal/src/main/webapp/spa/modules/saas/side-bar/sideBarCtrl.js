(function(app){
	'use strict';

	app.controller('saasSideBarCtrl', saasSideBarCtrl);

	saasSideBarCtrl.$inject = [];
	function saasSideBarCtrl() {
	    var vm = this;
	    
	    vm.selectMenu = selectMenu;
	    
	    function selectMenu() {
	    	$('.row-offcanvas').removeClass('active');
	    }
	    
	}
})(angular.module('lightpro'));