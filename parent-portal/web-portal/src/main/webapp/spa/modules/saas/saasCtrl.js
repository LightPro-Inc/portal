(function(app){
	'use strict';

	app.controller('saasCtrl', saasCtrl);

	saasCtrl.$inject = [];
	function saasCtrl() {
	    var vm = this;
	    
	    $(document).ready(function() {
    	  $('[data-toggle=offcanvas]').click(function() {
    	    $('.row-offcanvas').toggleClass('active');
    	  });
    	});
	}
})(angular.module('lightpro'));