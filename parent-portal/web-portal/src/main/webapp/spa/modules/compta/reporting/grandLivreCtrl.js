
(function (app) {
    'use strict';

    app.controller('grandLivreCtrl', grandLivreCtrl);

    grandLivreCtrl.$inject = ['$state','$scope', '$q', '$rootScope', '$stateParams', '$timeout', '$uibModal', '$confirm', 'utilityService', 'apiService', 'notificationService', 'printPreviewService'];
    function grandLivreCtrl($state, $scope, $q, $rootScope, $stateParams, $timeout, $uibModal, $confirm, utilityService, apiService, notificationService, printPreviewService) {
    	
    	var vm = this;

    	vm.showReport = showReport;
    	
    	function showReport(){
    		printPreviewService.showReport({url: '/web/api/compta/report/grand-livre', params: vm.query});
    	}
		
		vm.startChanged = startChanged;
		vm.endChanged = endChanged;
		vm.setExercicePeriod = setExercicePeriod;
		
		function setExercicePeriod(){
			var config = {
					params : {
			                date: vm.query.start,
			            }	
				};
			
			apiService.get('/web/api/compta/exercise', config, function(response){
				vm.query.start = response.data.start ? new Date(response.data.start) : null;
				vm.query.end = response.data.end ? new Date(response.data.end) : null;
			});
		}
		
		function startChanged(){
			if(vm.query.start)
				vm.query.end = vm.query.start;
			
			if(!vm.query.start)
				vm.query.end = undefined;
		}
		
		function endChanged(){
			if(vm.query.end && !vm.query.start)
				vm.query.start = vm.query.end;
			
			if(!vm.query.end)
				vm.query.start = undefined;
		}
		
		this.$onInit = function(){
			vm.pageSize = 10;					
			
			var journalsPromise = apiService.get('/web/api/compta/journal', {}, function(response){
										vm.journals = response.data;
									});
			
			var currentExercicePromise = apiService.get('/web/api/compta/exercise/current', {}, function(response){
										vm.currentExercice = response.data;								
									});
			
			vm.loadingDataFeature = true;
			$q.all([journalsPromise, currentExercicePromise]).then(function(){
				vm.loadingDataFeature = false;
				
				vm.query = {start : vm.currentExercice.start ? new Date(vm.currentExercice.start) : null, end : vm.currentExercice.end ? new Date(vm.currentExercice.end) : null };
			});					
		}
    }
})(angular.module('lightpro'));