(function (app) {
    'use strict';

    app.controller('detailsLogCtrl', detailsLogCtrl);

    detailsLogCtrl.$inject = ['data', '$uibModalInstance', 'apiService', 'notificationService', '$uibModal'];
    function detailsLogCtrl(data, $uibModalInstance, apiService, notificationService, $uibModal) {
        var vm = this;

        // Data
        vm.close = close;
        
        // Function
        function close(){
			$uibModalInstance.dismiss();
		}
        
        vm.$onInit = function () {
        	vm.details = angular.copy(data.details);
        }
    }
})(angular.module('lightpro'));