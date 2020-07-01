
(function (app) {
    'use strict';

    app.controller('compteResultatCtrl', compteResultatCtrl);

    compteResultatCtrl.$inject = ['$state','$scope', '$q', '$rootScope', '$stateParams', '$timeout', '$uibModal', '$confirm', 'utilityService', 'apiService', 'notificationService', 'printPreviewService'];
    function compteResultatCtrl($state, $scope, $q, $rootScope, $stateParams, $timeout, $uibModal, $confirm, utilityService, apiService, notificationService, printPreviewService) {
    	
    	var vm = this;

    	vm.showReport = showReport;
    	
    	function showReport(){
    		printPreviewService.showReport({url: '/web/api/compta/report/compte-resultat', params: vm.query});
    	}
		
		vm.startChanged = startChanged;		
		
		function startChanged(){
			
		}
		
		this.$onInit = function(){
			var exercisePromise = apiService.get('/web/api/compta/exercise/all', {}, function(response){
				vm.exercises = response.data;	
			});
			
			vm.loadingDataFeature = true;
			$q.all([exercisePromise]).then(function(){
				vm.loadingDataFeature = false;
				
				vm.query = {exerciseId : vm.exercises.length == 0 ? null : vm.exercises[0].id };
			});					
		}
    }
})(angular.module('lightpro'));