(function(app){
	'use strict';
	
	app.controller('stockMovementCtrl', stockMovementCtrl);
	
	stockMovementCtrl.$inject = ['apiService', '$uibModal', '$confirm', 'notificationService', '$state'];	
	function stockMovementCtrl(apiService, $uibModal, $confirm, notificationService, $state){
		var vm = this;
		
		vm.clearSearch = clearSearch;
		vm.search = search;	
		
		vm.pageChanged = function(){
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
		                filter: vm.filter
		            }	
			};
			            
			vm.loadingData = true;
			apiService.get('/web/api/stock-movement/search', config, 
					function(result){					
						vm.loadingData = false;
			            vm.totalCount = result.data.totalCount;
			            vm.currentPage = result.data.page;
			            
						vm.items = result.data.items;
					});
		}
		
		this.$onInit = function(){
			vm.pageSize = 10;
			
			search();			
		}
	}
	
})(angular.module('lightpro'));