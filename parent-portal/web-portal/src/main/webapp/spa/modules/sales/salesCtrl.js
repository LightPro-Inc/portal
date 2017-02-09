(function(app){
	'use strict';

	app.controller('salesCtrl', salesCtrl);

	salesCtrl.$inject = [];
	function salesCtrl() {
	    var vm = this;
	    
	    $(document).ready(function() {
	    	  $('[data-toggle=offcanvas]').click(function() {
	    	    $('.row-offcanvas').toggleClass('active');
	    	  });
	    	});
	}
})(angular.module('lightpro'));