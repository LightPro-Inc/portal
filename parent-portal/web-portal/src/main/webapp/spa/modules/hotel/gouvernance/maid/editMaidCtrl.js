(function (app) {
    'use strict';

    app.controller('editMaidCtrl', editMaidCtrl);

    editMaidCtrl.$inject = ['data', '$uibModalInstance', '$timeout', 'apiService', 'notificationService', 'webcamService', '$scope'];
    function editMaidCtrl(data, $uibModalInstance, $timeout, apiService, notificationService, webcamService, $scope) {

        var vm = this;

        // Data
        vm.imgHeight = 105;
        vm.imgWidth = 140;
        vm.cancelEdit = cancelEdit;
        vm.saveItem = saveItem;
        vm.item = data.item || {sex : 'M'};
        vm.isNew = data.item == null;

        vm.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        vm.datepicker = { format: 'yyyy-MM-dd' };

        // Function
        vm.openDatePicker = openDatePicker;
        vm.captureAnImage = captureAnImage;

        function captureAnImage() {
            webcamService.captureImage(vm.imgWidth, vm.imgHeight)
                         .result
                         .then(function (imgUrl) {
                             vm.Item.Photo = imgUrl;
                         });
        }

        function saveItem() {
            if (vm.isNew) {
                apiService.post('/web/api/maid', vm.item,
                registerItemCompleted,
                saveItemLoadFailed);
            } else {
                apiService.put(String.format('/web/api/maid/{0}', vm.item.id), vm.item,
                modifyItemCompleted,
                saveItemLoadFailed);
            }
        }

        $scope.$watch('vm.photo', function (newValue, oldValue) {
            if (newValue && newValue.compressed)
                vm.item.photo = newValue.compressed.dataURL;
        });

        function registerItemCompleted(response) {
            notificationService.displaySuccess(response.data.fullName + ' a été créé avec succès !');
            $uibModalInstance.close(response.data);
        }

        function modifyItemCompleted(response) {
            notificationService.displaySuccess("L'employé a été modifié avec succès !");
            $uibModalInstance.close(response.data);
        }

        function saveItemLoadFailed(error) {
            
        }

        function cancelEdit() {
            $uibModalInstance.dismiss();
        }

        function openDatePicker($event) {
            $event.preventDefault();
            $event.stopPropagation();

            vm.datepicker.opened = true;
        };

        vm.$onInit = function () {

            if (vm.isNew) {
                vm.title = "Créer un employé";
                vm.saveLabel = "Créer";
            } else {
                vm.title = "Modifier " + vm.item.fullName;
                vm.saveLabel = "Modifier";

                if (!(vm.item.birthDate == null))
                    vm.item.birthDate = new Date(vm.item.birthDate);
            }
        }
    }

})(angular.module('lightpro'));