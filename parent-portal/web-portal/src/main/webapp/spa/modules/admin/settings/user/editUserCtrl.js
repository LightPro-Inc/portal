
(function (app) {
    'use strict';

    app.controller('editUserCtrl', editUserCtrl);

    editUserCtrl.$inject = ['$rootScope', '$stateParams', '$scope', 'apiService', 'notificationService', '$q', '$confirm', '$uibModal', 'utilityService', '$timeout', '$previousState'];
    function editUserCtrl($rootScope, $stateParams, $scope, apiService, notificationService, $q, $confirm, $uibModal, utilityService, $timeout, $previousState) {
        var vm = this;

        vm.itemId = $stateParams.itemId;
        
        vm.identify = identify;
        vm.openSearchPerson = openSearchPerson;

        // Function
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
        
        function identify(){

        	if(!vm.item.id)
        		return;
			
			$uibModal.open({
                templateUrl: 'modules/contacts/features/contact/editContactPersonView.html',
                controller: 'editContactPersonCtrl as vm',
                size: "lg",
                resolve: {
                    data: {
                    	id : vm.item.id
                    }
                }
            }).result.then(function (itemEdited) {
            	vm.item.name = itemEdited.name;
            	setTitle(vm.item.name);
            }, function () {

            });           
		}
        
        function openSearchPerson() {
            $uibModal.open({
                templateUrl: 'modules/contacts/features/contact/contactSearchView.html',
                controller: 'contactSearchCtrl as vm',
                size: 'lg',
                resolve: {
                    data: {
                        filter: 'personNotUser'
                    }
                }
            }).result.then(function (person) {
            	vm.item.id = person.id;
                vm.item.name = person.name;
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
                        notificationService.displaySuccess(response.data.name + ' a été créé avec succès !');
                        $previousState.go();
                    }, function (response) {
                        
                    });
            } else {
                apiService.put('/web/api/membership/user/' + itemToSave.id, itemToSave,
                    function (response) {
                        notificationService.displaySuccess(itemToSave.name + ' a été modifié avec succès');
                        $previousState.go();
                    }, function (response) {
                        
                    });
            }
        }

        function setTitle(name){
        	if(vm.isNewItem)
        		vm.title = "Créer un utilisateur";
        	else
        		vm.title = "Modifier l'utilisateur " + name;
        }
        
        vm.$onInit = function () {
            vm.isNewItem = vm.itemId ? false : true

            setTitle();
            
            if (vm.isNewItem) {
            	vm.item = {sex : 'M'};
                vm.saveLabel = "Créer";                
            } else {
                vm.saveLabel = "Modifier";                
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
                            setTitle(vm.item.name);                            

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