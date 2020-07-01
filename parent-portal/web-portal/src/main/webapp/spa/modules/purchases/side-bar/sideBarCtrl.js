(function(app){
	'use strict';

	app.controller('purchasesSideBarCtrl', purchasesSideBarCtrl);

	purchasesSideBarCtrl.$inject = [];
	function purchasesSideBarCtrl() {
	    var vm = this;
	    
	    vm.selectMenu = selectMenu;
	    
	    function selectMenu() {
	    	$('.row-offcanvas').removeClass('active');
	    }
	    
	}
})(angular.module('lightpro'));