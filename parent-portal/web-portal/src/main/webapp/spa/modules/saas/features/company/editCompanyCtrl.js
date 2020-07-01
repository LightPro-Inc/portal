
(function (app) {
    'use strict';

    app.controller('editCompanyCtrl', editCompanyCtrl);

    editCompanyCtrl.$inject = ['$rootScope', '$stateParams', '$scope', 'apiService', 'notificationService', '$q', '$confirm', '$uibModal', 'utilityService', '$timeout', '$previousState'];
    function editCompanyCtrl($rootScope, $stateParams, $scope, apiService, notificationService, $q, $confirm, $uibModal, utilityService, $timeout, $previousState) {
        var vm = this;

        vm.itemId = $stateParams.itemId;

        // Function
        vm.Save = Save;
        vm.cancelEdit = cancelEdit;
        vm.searchCurrency = searchCurrency;
        
        function searchCurrency(){
			$uibModal.open({
                templateUrl: 'modules/saas/features/currency/currencySearchView.html',
                controller: 'currencySearchCtrl as vm',
                size: 'lg',
                resolve: {
                    data: { }
                }
            }).result.then(function (itemSelected) {
            	vm.company.currency = itemSelected.name;   
            	vm.company.currencyId = itemSelected.id;
            }, function () {

            }); 
		}
        
        function cancelEdit() {
        	$previousState.go();
        }

        function Save(item) {
        	
            var itemToSave = utilityService.clone(item);

            if (vm.isNewItem) {
                apiService.post('/web/api/saas/company', itemToSave,
                    function (response) {
                        notificationService.displaySuccess(itemToSave.denomination + ' a été créé avec succès !');
                        $previousState.go();
                    }, function (response) {
                        
                    });
            } else {
                apiService.put('/web/api/saas/company/' + itemToSave.id, itemToSave,
                    function (response) {
                        notificationService.displaySuccess(itemToSave.denomination + ' a été modifié avec succès');
                        $previousState.go();
                    }, function (response) {
                        
                    });
            }
        }

        vm.$onInit = function () {
            vm.isNewItem = vm.itemId ? false : true

            if (vm.isNewItem) {
            	vm.company = {};
                vm.saveLabel = "Créer";
                vm.title = "Créer une entreprise";
            } else {
                vm.saveLabel = "Modifier";
                
                apiService.get('/web/api/saas/company/' + vm.itemId, {},
                        function (response) {
                            vm.company = response.data;
                            vm.title = "Modifier l'entreprise " + vm.company.denomination;
                        });
            }
        }
    }
})(angular.module('lightpro'));