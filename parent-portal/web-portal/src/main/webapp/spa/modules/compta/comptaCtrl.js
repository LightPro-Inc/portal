(function(app){
	'use strict';

	app.controller('comptaCtrl', comptaCtrl);

	comptaCtrl.$inject = [];
	function comptaCtrl() {
	    var vm = this;
	    
	    $(document).ready(function() {
	    	  $('[data-toggle=offcanvas]').click(function() {
	    	    $('.row-offcanvas').toggleClass('active');
	    	  });
	    	});
	}
})(angular.module('lightpro'));