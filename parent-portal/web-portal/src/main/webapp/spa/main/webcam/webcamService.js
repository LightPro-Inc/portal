(function (app) {
    'use strict';

    app.factory('webcamService', webcamService);

    webcamService.$inject = ['notificationService', '$uibModal', 'apiService']
    function webcamService(notificationService, $uibModal, apiService) {

        var service = {
            captureImage: captureImage
        };

        function captureImage(width, height) {
            return $uibModal.open({
                templateUrl: 'main/webcam/webcamView.html',
                controller: 'webcamCtrl',
                size: 'md',
                resolve: {
                    data: {
                        width: width,
                        height: height
                    }
                }
            });
        }

        return service;
    }
})(angular.module('lightpro'));