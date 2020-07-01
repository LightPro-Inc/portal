(function (app) {
    'use strict';

    app.controller('editContactSocietyCtrl', editContactSocietyCtrl);

    editContactSocietyCtrl.$inject = ['data', '$uibModal', '$uibModalInstance', '$timeout', 'apiService', 'notificationService', 'webcamService', '$scope'];
    function editContactSocietyCtrl(data, $uibModal, $uibModalInstance, $timeout, apiService, notificationService, webcamService, $scope) {

        var vm = this;

        // Data
        vm.imgHeight = 105;
        vm.imgWidth = 140;
        vm.cancelEdit = cancelEdit;
        vm.saveItem = saveItem;        

        // Function
        vm.captureAnImage = captureAnImage;
        
        function captureAnImage() {
            webcamService.captureImage(vm.imgWidth, vm.imgHeight)
                         .result
                         .then(function (imgUrl) {
                             vm.item.photo = imgUrl;
                         });
        }

        function saveItem() {
            if (vm.isNewItem) {
                apiService.post('/web/api/contact/society', vm.item,
                registerItemCompleted,
                saveItemLoadFailed);
            } else {
                apiService.put(String.format('/web/api/contact/society/{0}', vm.item.id), vm.item,
                modifyItemCompleted,
                saveItemLoadFailed);
            }
        }

        $scope.$watch('vm.photo', function (newValue, oldValue) {
            if (newValue && newValue.compressed)
                vm.item.photo = newValue.compressed.dataURL;
        });

        function registerItemCompleted(response) {
            notificationService.displaySuccess(response.data.name + ' a été créé avec succès !');
            $uibModalInstance.close(response.data);
        }

        function modifyItemCompleted(response) {
            notificationService.displaySuccess('Le contact a été modifié avec succès !');
            $uibModalInstance.close(response.data);
        }

        function saveItemLoadFailed(error) {
            
        }

        function cancelEdit() {
            $uibModalInstance.dismiss();
        }

        vm.$onInit = function () {

        	vm.isNewItem = data.id == null;
        	
            if (vm.isNewItem) {
                vm.title = "Créer une société";
                vm.saveLabel = "Créer";
                vm.item = {};
            } else {
            	apiService.get(String.format('/web/api/contact/society/{0}', data.id), {}, 
            			function(response){
            		
            		vm.item = response.data;
            		vm.title = "Modifier " + vm.item.name;
                    vm.saveLabel = "Modifier";
            	});                
            }
        }
    }

})(angular.module('lightpro'));