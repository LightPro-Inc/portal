(function(app){
	'use strict';
	
	app.controller('unreconciledLineCtrl', unreconciledLineCtrl);
	
	unreconciledLineCtrl.$inject = ['apiService', '$uibModal', '$confirm', 'notificationService', '$state', '$previousState','$stateParams', '$q', '$scope'];	
	function unreconciledLineCtrl(apiService, $uibModal, $confirm, notificationService, $state, $previousState, $stateParams, $q, $scope){
		var vm = this;
		
		vm.search = search;	
		vm.pageChanged = pageChanged;
		vm.razTiersAccount = razTiersAccount;
		vm.searchTiersAccounts = searchTiersAccounts;
		vm.tiersTypeChanged = tiersTypeChanged;
		vm.reconcileItem = reconcileItem;
		
		function reconcileItem(item){
			vm.loadingData = true;
			apiService.post(String.format('/web/api/compta/reconcile/{0}', item.id), {}, 
					function(result){					
						vm.loadingData = false;
						
						$state.go('main.compta.edit-correspondance', {reconcileId: result.data.id}, {location:false});						
					}, function(error){
						vm.loadingData = false;						
					});
		}
		
		function tiersTypeChanged(tiersTypeId){
			razTiersAccount();			
		}
		
		function searchTiersAccounts(){
			$uibModal.open({
                templateUrl: 'modules/compta/settings/chart/accountSearchView.html',
                controller: 'accountSearchCtrl as vm',
                size: 'lg',
                resolve: {
                    data: { tiersTypeId : vm.query.tiersTypeId }
                }
            }).result.then(function (selected) {
            	vm.query.tiersAccount = selected.name; 
            	vm.query.tiersAccountId = selected.id;
            	
            	search();
            }, function () {

            }); 
		}
		
		function razTiersAccount(){
			vm.query.tiersAccountId = undefined;
			vm.query.tiersAccount = "Aucun compte tiers";
			
			search();
		}
		
		function pageChanged(){
			search(vm.currentPage);
		}
		
		function clearSearch(){
			vm.filter = "";
			search();
		}
		
		function search(page){  
			page = page ? page : 1;

			var config = {
				params : {
		                page: page,
		                pageSize: vm.pageSize,
		                filter: vm.filter,
		                statusId: 1,
		                tiersTypeId: vm.query.tiersTypeId,
		                auxiliaryAccountId: vm.query.tiersAccountId
		            }	
			};
			            
			vm.loadingData = true;
			apiService.get(String.format('/web/api/compta/line/search'), config, 
					function(result){					
						vm.loadingData = false;
			            vm.totalCount = result.data.totalCount;
			            vm.current = result.data.page;
			            
			            vm.items = result.data.items;
					});
		}
		
		$scope.$on('unreconcile-line', function(event, args){			
			vm.query.tiersTypeId = args.query.tiersTypeId;
			
			search();
		});
		
		this.$onInit = function(){
			vm.pageSize = 10;
			
			var tiersTypePromise = apiService.get('/web/api/compta/tiers/type', {}, 
									function(response){
										vm.tiersTypes = response.data;
									});
			
			vm.loadingDataFeature = true;
			$q.all([tiersTypePromise]).then(function(){
				vm.loadingDataFeature = false;
				
				vm.query = {tiersTypeId:vm.tiersTypes[0].id, tiersAccountId: null, tiersAccount: "Aucun compte tiers", };
				search();
			});			
		}
	}
	
})(angular.module('lightpro'));