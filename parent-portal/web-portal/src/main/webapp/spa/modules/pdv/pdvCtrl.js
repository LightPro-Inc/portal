(function(app){
	'use strict';

	app.controller('pdvCtrl', pdvCtrl);

	pdvCtrl.$inject = [];
	function pdvCtrl() {
	    var vm = this;
	    
	    $(document).ready(function() {
	    	  $('[data-toggle=offcanvas]').click(function() {
	    	    $('.row-offcanvas').toggleClass('active');
	    	  });
	    	});
	}
})(angular.module('lightpro'));