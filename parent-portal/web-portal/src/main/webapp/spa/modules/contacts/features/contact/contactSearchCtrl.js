(function(app){
	'use strict';
	
	app.controller('contactSearchCtrl', contactSearchCtrl);
	
	contactSearchCtrl.$inject = ['data', 'apiService', '$uibModalInstance', '$uibModal'];
	function contactSearchCtrl(data, apiService, $uibModalInstance, $uibModal){
		var vm = this;
		
		vm.clearSearch = clearSearch;
		vm.search = search;
		vm.doChoice = doChoice;
        vm.cancelEdit = cancelEdit;
        vm.selectItem = selectItem;       
        vm.addNew = addNew;
        vm.modifyItem = modifyItem;
        
        function editItem(param, callback){

			if(!param.natureId)
				return;
			
			var templateUrl, controller;
			
			switch(param.natureId){
			case 1:
				templateUrl = 'modules/contacts/features/contact/editContactPersonView.html';
				controller = 'editContactPersonCtrl as vm';
				break;
			case 2:
				templateUrl = 'modules/contacts/features/contact/editContactSocietyView.html';
				controller = 'editContactSocietyCtrl as vm';
				break;
			}
			
			$uibModal.open({
                templateUrl: templateUrl,
                controller: controller,
                size: "lg",
                resolve: {
                    data: {
                    	id : param.id
                    }
                }
            }).result.then(function (itemEdited) {
            	if(callback)
            		callback(itemEdited);
            }, function () {

            });           
		}
        
        function modifyItem(item){
        	editItem({natureId: item.natureId, id: item.id}, function(itemChoosed){
        		$uibModalInstance.close(itemChoosed);
			 });
        }
        
        function addNew(natureId){
        	editItem({natureId: natureId, id: null}, function(itemChoosed){
        		$uibModalInstance.close(itemChoosed);
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
			var url = null;
            switch (data.filter) {
                case 'personUser':
                case 'user':
                    url = '/web/api/membership/user/search';
                    break;
                case 'personNotUser':
                    url = '/web/api/contact/not-user/search';
                    break;
                default:    
                    url = '/web/api/contact/search';
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