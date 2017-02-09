(function(app){
	'use strict';

	app.controller('stocksCtrl', stocksCtrl);

	stocksCtrl.$inject = [];
	function stocksCtrl() {
	    var vm = this;
	    
	    $(document).ready(function() {
	    	  $('[data-toggle=offcanvas]').click(function() {
	    	    $('.row-offcanvas').toggleClass('active');
	    	  });
	    	});
	}
})(angular.module('lightpro'));