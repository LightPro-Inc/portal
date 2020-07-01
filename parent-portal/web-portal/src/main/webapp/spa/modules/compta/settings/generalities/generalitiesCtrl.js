(function(app){
	'use strict';
	
	app.controller('generalitiesCtrl', generalitiesCtrl);
	
	generalitiesCtrl.$inject = ['apiService', '$uibModal', '$confirm', 'notificationService', '$state', '$stateParams', '$rootScope', '$previousState', '$timeout', 'utilityService', '$q'];	
	function generalitiesCtrl(apiService, $uibModal, $confirm, notificationService, $state, $stateParams, $rootScope, $previousState, $timeout, utilityService, $q){
		var vm = this;
		
		vm.saveItem = saveItem;
		
		function saveItem(){
			
			var lastDayPromise = apiService.post('/web/api/compta/module/last-day-exo', {day: vm.lastDay, month: vm.lastMonthId},
	                function (response) {
	                    
	                });
			
			var journalRanPromise = apiService.post('/web/api/compta/module/journal-ran', {id: vm.journalRanId},
	                function (response) {
	                    
	                });
			
			$q.all([lastDayPromise, journalRanPromise]).then(function(){
				notificationService.displaySuccess('Modifications effectuées avec succès !');
			});
		}
		
		this.$onInit = function(){			
			apiService.get('/web/api/dashboard-tool/month', {},
	                function (response) {
						utilityService.remove(response.data, "number", 0);
	                    vm.months = response.data;
	                });
			
			apiService.get('/web/api/compta/module/last-day-exo', {},
	                function (response) {
	                    vm.lastDay = response.data.day;
	                    vm.lastMonthId = response.data.month;
	                });
			
			apiService.get('/web/api/compta/module/journal-ran', {},
	                function (response) {
	                    vm.journalRanId = response.data.id;
	                });
			
			apiService.get('/web/api/compta/journal/od', {},
	                function (response) {
	                    vm.journals = response.data;
	                });
		}
	}
	
})(angular.module('lightpro'));