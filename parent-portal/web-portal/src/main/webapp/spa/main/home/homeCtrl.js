(function(app){
	'use strict';
	
	app.controller('homeCtrl', homeCtrl);
	
	homeCtrl.$inject = ['$compile', 'apiService', '$scope', '$rootScope', 'notificationService', '$interval', 'membershipService', '$q', '$uibModal'];
	function homeCtrl($compile, apiService, $scope, $rootScope, notificationService, $interval, membershipService, $q, $uibModal){
		var vm = this;
		vm.indicators = [];
		
		vm.loadIndicators = loadIndicators;
		vm.openIndicatorSetting = openIndicatorSetting;
		
		function openIndicatorSetting(){
			$uibModal.open({
                templateUrl: 'main/home/indicatorSettingView.html',
                controller: 'indicatorSettingCtrl as vm',
                size: 'lg',
                resolve: {
                    data: {}
                }
            }).result.then(function () {
            	loadIndicators();
            }, function () {

            });    
		}
		
		function addIndicator(indicator){
			var compiled = $compile(String.format('<{0}></{0}>', String.format('{0}-{1}-indicator', indicator.shortName, indicator.moduleShortName)))($scope);
			angular.element('#placeholder').append(compiled);
		}
		
		function loadIndicators(){	
			apiService.get(String.format('/web/api/module/general-indicator'), {}, 
					function(response){
						
						vm.indicators = response.data;
						angular.element('#placeholder').empty();
						
						angular.forEach(vm.indicators, function(indicator){
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