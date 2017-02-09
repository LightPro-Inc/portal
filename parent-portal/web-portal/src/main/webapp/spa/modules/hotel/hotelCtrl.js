(function(app){
	'use strict';

	app.controller('hotelCtrl', hotelCtrl);

	hotelCtrl.$inject = [];
	function hotelCtrl() {
	    var vm = this;
	    
	    $(document).ready(function() {
	    	  $('[data-toggle=offcanvas]').click(function() {
	    	    $('.row-offcanvas').toggleClass('active');
	    	  });
	    	});
	}
})(angular.module('lightpro'));