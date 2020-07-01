
(function (app) {
    'use strict';

    app.controller('companyCtrl', companyCtrl);

    companyCtrl.$inject = ['$rootScope', 'apiService', 'notificationService', '$scope', '$uibModal', 'utilityService', '$confirm', '$document', '$state'];
    function companyCtrl($rootScope, apiService, notificationService, $scope, $uibModal, utilityService, $confirm, $document, $state) {
        var vm = this;

        // Data
        vm.page = 0;
        vm.pagesCount = 0;
        vm.items = [];

        // Function
        vm.search = search;
        vm.clearSearch = clearSearch;
        vm.openEditDialog = openEditDialog;
        vm.createNew = createNew;
        vm.deleteItem = deleteItem;
        vm.showModules = showModules;
        vm.showLog = showLog;
        
        function showLog(item){
			$state.go('main.saas.company-log', {companyId: item.id}, { location: false });
		}
        
        vm.pageChanged = function(){
			search(vm.currentPage);
		}
        
        function showModules(item){
			$state.go('main.saas.company-module', {companyId: item.id}, { location: false });
		}
        
        function search(page) {
            
            page = page ? page : 1;

            var config = {
                params: {
                    page: page,
                    pageSize: vm.pageSize,
                    filter: vm.filter
                }
            };

            vm.loadingData = true;
            return apiService.get('/web/api/saas/company/search', config,
            itemsLoadCompleted,
            itemsLoadFailed);
        }

        function openEditDialog(item) {
            saveItem(item.id);
        }

        function createNew() {
            saveItem(null);
        }

        function saveItem(id) {
            $state.go("main.saas.edit-company", { itemId: id }, { location: false });
        }

        function itemsLoadCompleted(result) {
            vm.loadingData = false;
            
            vm.totalCount = result.data.totalCount;
            vm.currentPage = result.data.page;
            
            vm.items = result.data.items;
        }

        function itemsLoadFailed(response) {
            vm.loadingData = false;
        }

        function clearSearch() {
            vm.filter = '';
            search();
        }

        function deleteItem(item) {
            $confirm({ text: "Etes-vous sûr de supprimer l'entreprise " + item.denomination + " ?", title: 'Supprimer une entreprise', ok: 'Oui', cancel: 'Non' })
        	.then(function () {
        	    apiService.remove('/web/api/saas/company/' + item.id, {},
        		function (response) {
        		    notificationService.displayInfo(item.denomination + ' supprimée avec succès');
        		    search();
        		}, function (response) {
        		    
        		});
        	});
        }

        vm.$onInit = function () {        	
        	vm.pageSize = 2;
        	
            search();
        }
    }
})(angular.module('lightpro'));