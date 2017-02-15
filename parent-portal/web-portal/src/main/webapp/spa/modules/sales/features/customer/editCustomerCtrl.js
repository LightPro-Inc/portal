(function (app) {
    'use strict';

    app.controller('editCustomerCtrl', editCustomerCtrl);

    editCustomerCtrl.$inject = ['data', '$uibModal', '$uibModalInstance', '$timeout', 'apiService', 'notificationService', 'webcamService', '$scope'];
    function editCustomerCtrl(data, $uibModal, $uibModalInstance, $timeout, apiService, notificationService, webcamService, $scope) {

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
        vm.searchPerson = searchPerson;
        vm.razPerson = razPerson;
        
        function razPerson(){
        	vm.item = {sex : 'M'};
        }
        
        function searchPerson() {
        	$uibModal.open({
                templateUrl: 'main/person/personSearchView.html',
                controller: 'personSearchCtrl as vm',
                resolve: {
                    data: { }
                }
            }).result.then(function (personSelected) {
            	vm.item = personSelected;           	
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
            if (vm.isNew) {
            	console.log(vm.item);
                apiService.post('/web/api/customer', vm.item,
                registerItemCompleted,
                saveItemLoadFailed);
            } else {
                apiService.put(String.format('/web/api/customer/{0}', vm.item.id), vm.item,
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
            notificationService.displaySuccess('Le client a été modifié avec succès !');
            $uibModalInstance.close(response.data);
        }

        function saveItemLoadFailed(error) {
            notificationService.displayError(error);
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
                vm.title = "Créer un client";
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