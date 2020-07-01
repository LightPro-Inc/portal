(function(app){
	'use strict';
	
	app.controller('customerSearchCtrl', customerSearchCtrl);
	
	customerSearchCtrl.$inject = ['data', 'apiService', '$uibModalInstance', '$uibModal'];
	function customerSearchCtrl(data, apiService, $uibModalInstance, $uibModal){
		var vm = this;
		
		vm.clearSearch = clearSearch;
		vm.search = search;
		vm.doChoice = doChoice;
        vm.cancelEdit = cancelEdit;
        vm.selectItem = selectItem;       
        vm.addNew = addNew;
        vm.modifyItem = modifyItem;
        
        function modifyItem(item){
        	$uibModal.open({
                templateUrl: 'modules/sales/features/customer/editCustomerView.html',
                controller: 'editCustomerCtrl as vm',
                size : 'lg',
                resolve: {
                    data: {item : item}
                }
            }).result.then(function (itemChoosed) {
            	$uibModalInstance.close(itemChoosed);
            }, function () {

            });
        }
        
        function addNew(){
        	$uibModal.open({
                templateUrl: 'modules/sales/features/customer/editCustomerView.html',
                controller: 'editCustomerCtrl as vm',
                size : 'lg',
                resolve: {
                    data: {}
                }
            }).result.then(function (itemChoosed) {
            	$uibModalInstance.close(itemChoosed);
            }, function () {

            });
        }
        
        function selectItem(item) {
            angular.forEach(vm.items, function (value) {
                if (value.id == item.id) {
                    value.Choosed = true;
                    vm.selectedItem = value;
                } else {
                    value.Choosed = false;
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
			page = page ? page : 1;

			var config = {
				params : {
		                page: page,
		                pageSize: vm.pageSize,
		                filter: vm.filter
		            }	
			};
			            
			vm.loadingData = true;
			apiService.get('/web/api/customer/search', config, 
					function(result){					
						vm.loadingData = false;
			            vm.totalCount = result.data.totalCount;
			            vm.currentPage = result.data.page;
			            
						vm.items = result.data.items;
					});
		}
		
		this.$onInit = function(){
			vm.pageSize = 5;
			
			search();			
		}
	}
	
})(angular.module('lightpro'));