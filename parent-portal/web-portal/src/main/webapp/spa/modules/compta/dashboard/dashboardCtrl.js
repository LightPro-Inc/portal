(function(app){
	'use strict';
	
	app.controller('comptaDashboardCtrl', comptaDashboardCtrl);
	
	comptaDashboardCtrl.$inject = ['apiService', '$rootScope', 'notificationService', '$q', '$uibModal', '$compile', '$scope'];
	function comptaDashboardCtrl(apiService, $rootScope, notificationService, $q, $uibModal, $compile, $scope){
		var vm = this;
		
		var moduleTypeId = 1;
		
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