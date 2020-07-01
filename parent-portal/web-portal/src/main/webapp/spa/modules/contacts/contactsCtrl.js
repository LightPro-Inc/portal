(function(app){
	'use strict';

	app.controller('contactsCtrl', contactsCtrl);

	contactsCtrl.$inject = [];
	function contactsCtrl() {
	    var vm = this;
	    
	    $(document).ready(function() {
	    	  $('[data-toggle=offcanvas]').click(function() {
	    	    $('.row-offcanvas').toggleClass('active');
	    	  });
	    	});
	    
	    this.$onInit = function(){

	    }	    
	}
})(angular.module('lightpro'));