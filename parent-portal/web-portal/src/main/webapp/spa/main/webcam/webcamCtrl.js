(function (app) {
    'use strict';

    app.controller('webcamCtrl', webcamCtrl);

    webcamCtrl.$inject = ['data', '$scope', 'notificationService', 'apiService', '$uibModalInstance'];
    function webcamCtrl(data, $scope, notificationService, apiService, $uibModalInstance) {

        // Data     
        var mediaRecorder = null;
        var videoHeight = 735;
        var videoWidth = 535;

        $scope.myChannel = {
            // the fields below are all optional
            videoHeight: videoHeight,
            videoWidth: videoWidth,
            video: null // Will reference the video element on success
        };

        // Methods
        $scope.closeDialog = closeDialog;
        $scope.chooseImage = chooseImage;
        $scope.onError = function (err) {
        
        };

        $scope.onStream = function (stream) {
            mediaRecorder = new MediaRecorder(stream);
        };

        $scope.onSuccess = function () {
            mediaRecorder.start();
        };

        //////////
        function chooseImage() {
            var hiddenCanvas = document.createElement('canvas');
            hiddenCanvas.width = data.width;
            hiddenCanvas.height = data.height;
            var ctx = hiddenCanvas.getContext('2d');
            ctx.drawImage($scope.myChannel.video, 0, 0, data.width, data.height);

            $uibModalInstance.close(hiddenCanvas.toDataURL('image/jpeg'));
        }

        function closeDialog() {
            $uibModalInstance.dismiss();
        }

        $scope.$onInit = function () {

        }

        $scope.$destroy = function () {
            mediaRecorder.stop();
        };
    }
})(angular.module('lightpro'));