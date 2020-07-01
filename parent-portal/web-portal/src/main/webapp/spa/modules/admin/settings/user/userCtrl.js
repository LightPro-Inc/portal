
(function (app) {
    'use strict';

    app.controller('userCtrl', userCtrl);

    userCtrl.$inject = ['$rootScope', 'apiService', 'notificationService', '$scope', '$uibModal', 'utilityService', '$confirm', '$document', '$state'];
    function userCtrl($rootScope, apiService, notificationService, $scope, $uibModal, utilityService, $confirm, $document, $state) {
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
        vm.lockUser = lockUser;
        vm.unlockUser = unlockUser;
        vm.initPassword = initPassword;

        vm.pageChanged = function(){
			search(vm.currentPage);
		}
        
        function initPassword(item) {
        	$confirm({ text: "Souhaitez-vous initialiser le mot de passe de l'utilisateur " + item.name + " ?", title: 'Initialiser un mot de passe', ok: 'Oui', cancel: 'Non' })
        	.then(function () {
        		apiService.post( String.format('/web/api/membership/user/{0}/init-password', item.id), {},
                        function (response) {
                            notificationService.displaySuccess('Initialisation du mot de passe effectuée avec succès !');
                        }, function (response) {
                            
                        });
        	});        	
        }

        function lockUser(item) {
        	$confirm({ text: "Souhaitez-vous verrouiller le compte de l'utilisateur " + item.name + " ?", title: 'Verrouiller un compte', ok: 'Oui', cancel: 'Non' })
        	.then(function () {
        		apiService.post(String.format('/web/api/membership/user/{0}/lock', item.id), { isLocked : true },
                        function (response) {
                            item.isLocked = true;
                            notificationService.displaySuccess("Le compte de " + item.name + " a été verrouillé avec succès !");
                        }, function (response) {
                            
                        });
        	});               
        }

        function unlockUser(item) {
        	$confirm({ text: "Souhaitez-vous déverrouiller le compte de l'utilisateur " + item.name + " ?", title: 'Déverrouiller un compte', ok: 'Oui', cancel: 'Non' })
        	.then(function () {
        		apiService.post(String.format('/web/api/membership/user/{0}/lock', item.id), { isLocked : false },
                        function (response) {
                            item.isLocked = false;
                            notificationService.displaySuccess("Le compte de " + item.name + ' a été déverrouillé avec succès !');
                        }, function (response) {
                            
                        });
        	});           	        
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
            return apiService.get('/web/api/membership/user/search/', config,
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
            $state.go("main.settings.edit-user", { itemId: id }, { location: false });
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
            $confirm({ text: "Etes-vous sûr de supprimer l'utilisateur " + item.name + " ?", title: 'Supprimer un utilisateur', ok: 'Oui', cancel: 'Non' })
        	.then(function () {
        	    apiService.remove('/web/api/membership/user/' + item.id, {},
        		function (response) {
        		    notificationService.displayInfo(item.name + ' supprimé avec succès');
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