(function(app){
	'use strict';

	app.controller('aboutCtrl', aboutCtrl);

	aboutCtrl.$inject = [];
	function aboutCtrl(){

	    var vm = this;

	    vm.appVersion = appVersion;		
	}
})(angular.module('lightpro'));