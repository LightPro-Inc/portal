(function(app){
	'use strict';

	app.controller('hotelSideBarCtrl', hotelSideBarCtrl);

	hotelSideBarCtrl.$inject = [];
	function hotelSideBarCtrl() {
	    var vm = this;
	    
	    vm.selectMenu = selectMenu;
	    
	    function selectMenu() {
	    	$('.row-offcanvas').removeClass('active');
	    }
	}
})(angular.module('lightpro'));