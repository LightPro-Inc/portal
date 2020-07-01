
(function (app) {
    'use strict';

    app.controller('logSaasCtrl', logSaasCtrl);

    logSaasCtrl.$inject = ['$stateParams', '$state', '$timeout', 'apiService', 'notificationService', 'utilityService', 'contactService', '$uibModal', '$previousState'];
    function logSaasCtrl($stateParams, $state, $timeout, apiService, notificationService, utilityService, contactService, $uibModal, $previousState) {
        var vm = this;

        // Data
        vm.companyId = $stateParams.companyId;
        vm.page = 0;
        vm.pagesCount = 0;
        vm.items = [];

        vm.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        vm.beginDatepicker = { format: 'yyyy-MM-dd' };
        vm.endDatepicker = { format: 'yyyy-MM-dd' };

        // Function
        vm.search = search;
        vm.clearSearch = clearSearch;
        vm.clearUser = clearUser;
        vm.openBeginDatePicker = openBeginDatePicker;
        vm.openEndDatePicker = openEndDatePicker;
        vm.beginDateChanged = beginDateChanged;
        vm.endDateChanged = endDateChanged;
        vm.removePeriod = removePeriod;
        vm.openSearchUser = openSearchUser;
        vm.showDetails = showDetails;
        vm.goPreviousPage = goPreviousPage;
        
        function goPreviousPage(){
			$previousState.go();
		}
        
        function showDetails(item){
        	$uibModal.open({
                templateUrl: 'modules/admin/settings/log/detailsView.html',
                controller: 'detailsLogCtrl as vm',
                size: 'lg',
                resolve: {
                    data: {
                    	details : item.details
                    }
                }
            }).result.then(function () {
            	
            }, function () {

            });
        }
        
        function openSearchUser() {
        	contactService.search('user', function(userSelected){
        		vm.userSelected = userSelected;
        		search(0);
        	});
        }

        function removePeriod() {

            var canLoadData = !((vm.beginDate == null || vm.beginDate == undefined) ||
                                (vm.endDate == null || vm.endDate == undefined));

            vm.beginDate = null;
            vm.endDate = null;

            if (canLoadData) {
                search(0);
            }
        }

        function beginDateChanged(date) {
            if (date == null || date == undefined) {
                vm.endDate = null;
            } else {
                if (vm.endDate == null || vm.endDate == undefined) {
                    vm.endDate = date;
                }
            }

            if (!vm.loadingData) {
                search(0);
            }
        }

        function endDateChanged(date) {
            if (date == null || date == undefined) {
                vm.beginDate = null;
            } else {
                if (vm.beginDate == null || vm.beginDate == undefined) {
                    vm.beginDate = date;
                }
            }

            if (!vm.loadingData) {
                search(0);
            }
        }

        function search(page) {
            vm.loadingData = true;

            page = page ? page : 1;

            var config = {
                params: {
                    page: page,
                    pageSize: 10,
                    filter: vm.filter,
                    start: vm.beginDate,
                    end: vm.endDate,
                    companyId: vm.companyId,
                    moduleTypeId: vm.moduleTypeId,
                    categoryId: vm.categoryId,
                    typeId: vm.typeId,
                    userId: vm.userSelected.id
                }
            };

            vm.loadingData = true;
			apiService.get('/web/api/saas/log/search', config, 
					function(result){					
						vm.loadingData = false;
			            vm.totalCount = result.data.totalCount;
			            vm.currentPage = result.data.page;
			            
						vm.items = result.data.items;
					});
        }

        function clearUser() {
            vm.userSelected = { id: null, name: "Tous" };
            search(0);
        }

        function clearSearch() {
            vm.filter = '';
            search();
        }

        function openBeginDatePicker($event) {
            $event.preventDefault();
            $event.stopPropagation();

            vm.beginDatepicker.opened = true;
        };

        function openEndDatePicker($event) {
            $event.preventDefault();
            $event.stopPropagation();

            vm.endDatepicker.opened = true;
        };

        vm.pageChanged = function(){
			search(vm.currentPage);
		}
        
        vm.$onInit = function () {
        	
        	vm.pageSize = 10;
        	
        	apiService.get(String.format('/web/api/saas/company/{0}', vm.companyId), {}, function(response){
            	vm.company = response.data;
            });
        	
            apiService.get('/web/api/log/category', {}, function(response){
            	vm.categories = response.data;            	
            });

            apiService.get('/web/api/log/type', {}, function(response){
            	vm.types = response.data;
            });
            
            apiService.get(String.format('/web/api/saas/company/{0}/module/installed', vm.companyId), {}, function(response){
            	vm.modules = response.data;
            });

            vm.userSelected = { id: null, name: "Tous" };
            
            search(0);
        }
    }
})(angular.module('lightpro'));