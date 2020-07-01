
(function (app) {
    'use strict';

    app.controller('changeMyPasswordCtrl', changeMyPasswordCtrl);

    changeMyPasswordCtrl.$inject = ['data', '$rootScope', '$scope', 'apiService', 'notificationService', '$q', '$confirm', '$uibModalInstance', 'utilityService'];
    function changeMyPasswordCtrl(data, $rootScope, $scope, apiService, notificationService, $q, $confirm, $uibModalInstance, utilityService) {
        var vm = this;

        vm.item = { fullUsername: data.username }

        vm.Save = Save;
        vm.cancelEdit = cancelEdit;

        function cancelEdit() {
            $uibModalInstance.dismiss();
        }

        function Save(item) {
            if (item.confirmPassword != item.newPassword) {
                notificationService.displayInfo("Le mot de passe de confirmation ne correspond pas !");
                return;
            }
            
            if (item.oldPassword == item.newPassword) {
                notificationService.displayInfo("Le nouveau mot de passe est identique à l'ancien !");
                return;
            }

            apiService.post('/web/api/membership/change-password/', item,
                   function (response) {
                       notificationService.displaySuccess("Mot de passe changé avec succès");
                       $uibModalInstance.close();
                   }, function (response) {
                       
                   });
        }

        vm.$onInit = function () {

        }
    }
})(angular.module('lightpro'));