(function(app){
	'use strict';

	app.controller('pdvSideBarCtrl', pdvSideBarCtrl);

	pdvSideBarCtrl.$inject = [];
	function pdvSideBarCtrl() {
	    var vm = this;
	    
	    vm.selectMenu = selectMenu;
	    
	    function selectMenu() {
	    	$('.row-offcanvas').removeClass('active');
	    }
	}
})(angular.module('lightpro'));