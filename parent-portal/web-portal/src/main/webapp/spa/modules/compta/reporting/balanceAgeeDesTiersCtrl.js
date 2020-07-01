
(function (app) {
    'use strict';

    app.controller('balanceAgeeDesTiersCtrl', balanceAgeeDesTiersCtrl);

    balanceAgeeDesTiersCtrl.$inject = ['$state','$scope', '$q', '$rootScope', '$stateParams', '$timeout', '$uibModal', '$confirm', 'utilityService', 'apiService', 'notificationService', 'printPreviewService'];
    function balanceAgeeDesTiersCtrl($state, $scope, $q, $rootScope, $stateParams, $timeout, $uibModal, $confirm, utilityService, apiService, notificationService, printPreviewService) {
    	
    	var vm = this;

    	vm.showReport = showReport;
    	
    	function showReport(){
    		printPreviewService.showReport({url: '/web/api/compta/report/balance-agee-des-tiers', params: vm.query});
    	}
		
		vm.startChanged = startChanged;		
		
		function startChanged(){
			
		}
		
		this.$onInit = function(){
			var tiersTypePromise = apiService.get('/web/api/compta/tiers/type', {}, function(response){
				vm.tiersTypes = response.data;	
			});
			
			vm.loadingDataFeature = true;
			$q.all([tiersTypePromise]).then(function(){
				vm.loadingDataFeature = false;
				
				vm.query = {tiersTypeId : vm.tiersTypes[0].id, startDate : new Date() };
			});					
		}
    }
})(angular.module('lightpro'));