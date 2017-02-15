(function(app){
	'use strict';
	
	app.controller('personSearchCtrl', personSearchCtrl);
	
	personSearchCtrl.$inject = ['data', 'apiService', '$uibModalInstance'];
	function personSearchCtrl(data, apiService, $uibModalInstance){
		var vm = this;
		
		vm.clearSearch = clearSearch;
		vm.search = search;
		vm.doChoice = doChoice;
        vm.cancelEdit = cancelEdit;
        vm.selectItem = selectItem;        
        
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
			
			var url = null;
            switch (data.filter) {
                case 'personUser':
                    url = '/web/api/person/user/search';
                    break;
                case 'personNotUser':
                    url = '/web/api/person/not-user/search';
                    break;
                default:    
                    url = '/web/api/person/search';
                    break;
            }
            
			apiService.get(url, config, 
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