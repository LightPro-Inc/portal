(function (app) {
    'use strict';

    app.controller('myAccountCtrl', myAccountCtrl);

    myAccountCtrl.$inject = ['$uibModal', '$timeout', 'apiService', 'notificationService', 'webcamService', 'membershipService', 'utilityService', '$scope', '$rootScope'];
    function myAccountCtrl($uibModal, $timeout, apiService, notificationService, webcamService, membershipService, utilityService, $scope, $rootScope) {

        var vm = this;

        // Data
        vm.imgHeight = 105;
        vm.imgWidth = 140;
        vm.saveItem = saveItem;

        vm.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        vm.datepicker = { format: 'dd/MM/yyyy' };

        // Function
        vm.openDatePicker = openDatePicker;
        vm.captureAnImage = captureAnImage;
        vm.changePassword = changePassword;

        function changePassword() {
            $uibModal.open({
                templateUrl: 'modules/admin/settings/my-account/changeMyPasswordView.html',
                controller: 'changeMyPasswordCtrl as vm',
                size: 'sm',
                resolve: {
                	data :{
                		username : $rootScope.repository.loggedUser.username
                	}
                }
            }).result.then(function () {
                // déconnecter l'utilisateur
                membershipService.simpleLogout();
                $timeout(function () {
                    notificationService.displayInfo("Reconnectez-vous, s'il vous plait.");
                }, 1000);
            }, function () {
            });
        }

        function captureAnImage() {
            webcamService.captureImage(vm.imgWidth, vm.imgHeight)
                         .result
                         .then(function (imgUrl) {
                             vm.item.photo = imgUrl;
                         });
        }

        function saveItem() {
            apiService.put('/web/api/membership/user/' + $rootScope.repository.loggedUser.id, vm.item,
                modifyItemCompleted,
                saveItemLoadFailed);
        }

        function modifyItemCompleted(response) {
            notificationService.displaySuccess('Informations enregistrées avec succès!');
        }

        function saveItemLoadFailed(response) {
            notificationService.displayError(response.data);
        }

        function openDatePicker($event) {
            $event.preventDefault();
            $event.stopPropagation();

            vm.datepicker.opened = true;
        };

        $scope.$watch('vm.photo', function (newValue, oldValue) {
        	
            if (newValue && newValue.compressed)
                vm.item.photo = newValue.compressed.dataURL;
        });

        vm.$onInit = function () {
            apiService.get('/web/api/membership/user/current', {},
                function (response) {
                    vm.item = response.data;
                });           
        }
    }

})(angular.module('lightpro'));