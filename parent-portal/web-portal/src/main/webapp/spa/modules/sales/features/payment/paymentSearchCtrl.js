(function(app){
	'use strict';
	
	app.controller('paymentSearchCtrl', paymentSearchCtrl);
	
	paymentSearchCtrl.$inject = ['data', 'apiService', '$uibModalInstance'];
	function paymentSearchCtrl(data, apiService, $uibModalInstance){
		var vm = this;
		
		vm.customerId = data.customerId;
		
		vm.clearSearch = clearSearch;
		vm.search = search;
		vm.doChoice = doChoice;
        vm.cancelEdit = cancelEdit;
        vm.selectItem = selectItem; 
        
        function selectItem(item) {
            angular.forEach(vm.items, function (value) {
                if (value.id == item.id) {
                    value.choosed = true;
                    vm.selectedItem = value;
                } else {
                    value.choosed = false;
                }
            });
        }

        function doChoice() {
            $uibModalInstance.close(vm.selectedItem);
        }

        function cancelEdit() {
            $uibModalInstance.dismiss();
        }
        
		vm.pageChanged = function(){
			search(vm.currentPage);
		}
		
		function clearSearch(){
			vm.filter = "";
			search();
		}
		
		function search(page){
			vm.selectedItem = null;
			
			page = page ? page : 1;

			var config = {
				params : {
		                page: page,
		                pageSize: vm.pageSize,
		                filter: vm.filter,
		                customerId: vm.customerId
		            }	
			};
			            
			vm.loadingData = true;
			
			apiService.get('/web/api/sales/payment/search', config, 
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