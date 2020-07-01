(function(app){
	'use strict';
	
	app.controller('correspondanceCtrl', correspondanceCtrl);
	
	correspondanceCtrl.$inject = ['apiService', '$uibModal', '$confirm', 'notificationService', '$state', '$previousState', '$stateParams', 'utilityService', '$q', '$rootScope', '$timeout'];	
	function correspondanceCtrl(apiService, $uibModal, $confirm, notificationService, $state, $previousState, $stateParams, utilityService, $q, $rootScope, $timeout){
		var vm = this;
					
		this.$onInit = function(){
			
			if($stateParams.tiersTypeId)	{
				
				if($stateParams.reconcileStatusId){
					vm.active = 0;
					
					var query = { 								 
								  reconcileStatusId: $stateParams.reconcileStatusId, 								 
								  tiersTypeId: $stateParams.tiersTypeId,
								};
					
					$timeout(function(){
						$rootScope.$broadcast('reconcile', {query: query});
					}, 500);
										
				} else {
					vm.active = 1;
					
					var query = { 								  
								  tiersTypeId: $stateParams.tiersTypeId
								};
					
					$timeout(function(){
						$rootScope.$broadcast('unreconcile-line', {query: query});
					}, 500);					
				}
			}			
		}
	}
	
})(angular.module('lightpro'));