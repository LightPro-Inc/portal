
(function (app) {
    'use strict';

    app.controller('editUserCtrl', editUserCtrl);

    editUserCtrl.$inject = ['$rootScope', '$stateParams', '$scope', 'apiService', 'notificationService', '$q', '$confirm', '$uibModal', 'utilityService', '$timeout', '$previousState'];
    function editUserCtrl($rootScope, $stateParams, $scope, apiService, notificationService, $q, $confirm, $uibModal, utilityService, $timeout, $previousState) {
        var vm = this;

        vm.itemId = $stateParams.itemId;
        
        vm.openSearchPerson = openSearchPerson;

        vm.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        vm.datepicker = { format: 'dd/MM/yyyy' };

        // Function
        vm.openDatePicker = openDatePicker;
        vm.selectProfile = selectProfile;
        vm.Save = Save;
        vm.cancelEdit = cancelEdit;

        function cancelEdit() {
        	$previousState.go();
        }

        function selectProfile(item) {
            item.choosed = true;

            angular.forEach(vm.profiles, function (value, index) {
                if (value.id != item.id) {
                    value.choosed = false;
                }
            });
        }

        function openDatePicker($event) {
            $event.preventDefault();
            $event.stopPropagation();

            vm.datepicker.opened = true;
        };

        function openSearchPerson() {
            $uibModal.open({
                templateUrl: 'main/person/personSearchView.html',
                controller: 'personSearchCtrl as vm',
                resolve: {
                    data: {
                        filter: 'personNotUser'
                    }
                }
            }).result.then(function (person) {
                vm.item = person;
            }, function () {
            });
        }

        function Save(item) {

            angular.forEach(vm.profiles, function (value, index) {
                if (value.choosed) {
            		item.profileId = value.id;
                }
            });

            if (!item.profileId) {
                notificationService.displayInfo("Vous devez renseigner un profil !");
                return;
            }

            var itemToSave = utilityService.clone(item);

            if (vm.isNewItem) {
                apiService.post('/web/api/membership/register/', itemToSave,
                    function (response) {
                        notificationService.displaySuccess(response.data.fullName + ' a été créé avec succès !');
                        $previousState.go();
                    }, function (response) {
                        notificationService.displayError(response.data);
                    });
            } else {
                apiService.put('/web/api/membership/user/' + itemToSave.id, itemToSave,
                    function (response) {
                        notificationService.displaySuccess(itemToSave.fullName + ' a été modifié avec succès');
                        $previousState.go();
                    }, function (response) {
                        notificationService.displayError(response.data);
                    });
            }
        }

        vm.$onInit = function () {
            vm.isNewItem = vm.itemId ? false : true

            if (vm.isNewItem) {
            	vm.item = {sex : 'M'};
                vm.saveLabel = "Créer";
                vm.title = "Créer un utilisateur";
            } else {
                vm.saveLabel = "Modifier";
                vm.title = "Modifier un utilisateur";
            }

            vm.loadingData = true;

            var profilePromise = apiService.get('/web/api/profile/', {},
                function (response) {
                    vm.profiles = response.data;
                });

            $q.all([profilePromise]).then(function () {
            	vm.loadingData = false;
            	
                if (vm.isNewItem)
                {                                       
                    if (vm.profiles.length > 0)
                    {
                        $timeout(function () {
                            selectProfile(vm.profiles[0]);
                        }, 100);
                    }
                }
                else
                {
                    apiService.get('/web/api/membership/user/' + vm.itemId, {},
                        function (response) {
                            vm.item = response.data;
                            vm.title = "Modifier l'utilisateur " + vm.item.fullName;

                            angular.forEach(vm.profiles, function (profile) {
                                if (profile.id == vm.item.profileId)
                                    $timeout(function () {
                                        profile.choosed = true;
                                    }, 0);                                            
                            });
                        });
                }
            });
        }
    }
})(angular.module('lightpro'));