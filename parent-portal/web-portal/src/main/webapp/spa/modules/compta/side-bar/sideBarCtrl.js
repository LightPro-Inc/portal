(function(app){
	'use strict';

	app.controller('comptaSideBarCtrl', comptaSideBarCtrl);

	comptaSideBarCtrl.$inject = [];
	function comptaSideBarCtrl() {
	    var vm = this;
	    
	    vm.selectMenu = selectMenu;
	    
	    function selectMenu() {
	    	$('.row-offcanvas').removeClass('active');
	    }
	}
})(angular.module('lightpro'));