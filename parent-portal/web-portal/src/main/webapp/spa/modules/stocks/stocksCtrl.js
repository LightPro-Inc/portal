(function(app){
	'use strict';

	app.controller('stocksCtrl', stocksCtrl);

	stocksCtrl.$inject = ['$scope', 'apiService'];
	function stocksCtrl($scope, apiService) {
	    var vm = this;
	    var features = [];
	    
	    $scope.isGranted = function(access) {
			
			var granted = false;

		    angular.forEach(features, function (value) {
		        if (value.id == access)
		            granted = true;
		    });

		    return granted;
		};
		
	    $(document).ready(function() {
	    	  $('[data-toggle=offcanvas]').click(function() {
	    	    $('.row-offcanvas').toggleClass('active');
	    	  });
	    	});
	    
	    this.$onInit = function(){
			apiService.get(String.format("/web/api/membership/user/current/module/{0}/feature", 3), {},
					function(response){
						features = response.data;						
					}
			);
		}
	}
})(angular.module('lightpro'));