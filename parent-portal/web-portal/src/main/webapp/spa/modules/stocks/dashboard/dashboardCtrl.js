(function(app){
	'use strict';
	
	app.controller('stocksDashboardCtrl', stocksDashboardCtrl);
	
	stocksDashboardCtrl.$inject = ['$compile', 'apiService', '$scope', '$rootScope', 'notificationService', '$interval'];
	function stocksDashboardCtrl($compile, apiService, $scope, $rootScope, notificationService, $interval){
		var vm = this;
		
		var moduleTypeId = 3;
		
		vm.loadIndicators = loadIndicators;
		
		function addIndicator(indicator){
			var compiled = $compile(String.format('<{0}></{0}>', String.format('{0}-{1}-indicator', indicator.shortName, indicator.moduleShortName)))($scope);
			angular.element('#placeholder').append(compiled);
		}
		
		function loadIndicators(){	
			apiService.get(String.format('/web/api/module/{0}/indicator', moduleTypeId), {}, 
					function(response){
						
						var indicators = response.data;
						angular.element('#placeholder').empty();
						
						angular.forEach(indicators, function(indicator){
							addIndicator(indicator);
						});
					}
			);			
		}
		
		this.$onInit = function(){
			loadIndicators();							
		}
	}
	
})(angular.module('lightpro'));