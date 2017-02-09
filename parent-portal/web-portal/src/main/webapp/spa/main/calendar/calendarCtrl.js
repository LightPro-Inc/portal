
(function (app) {
    'use strict';

    app.controller('calendarCtrl', calendarCtrl);

    calendarCtrl.$inject = ['data', '$timeout','notificationService', '$uibModalInstance'];
    function calendarCtrl(data, $timeout, notificationService, $uibModalInstance) {
        var vm = this;

        // Data
        vm.dateSelected = angular.copy(data.date);
        vm.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        vm.datepicker = { format: 'yyyy-MM-dd' };

        // Function
        vm.cancelEdit = cancelEdit;
        vm.validate = validate;

        function validate() {            
            $uibModalInstance.close(vm.dateSelected);
        }

        function cancelEdit() {
            $uibModalInstance.dismiss();
        }

        vm.$onInit = function () {
            
        }
    }
})(angular.module('lightpro'));