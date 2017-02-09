(function(app){
	'use strict';
	
	app.controller('settingsCtrl', settingsCtrl);
	settingsCtrl.$inject = [];
	function settingsCtrl(){
		var vm = this;
		
		$(document).ready(function() {
	    	  $('[data-toggle=offcanvas]').click(function() {
	    	    $('.row-offcanvas').toggleClass('active');
	    	  });
	    	});
	}
})(angular.module('lightpro'));