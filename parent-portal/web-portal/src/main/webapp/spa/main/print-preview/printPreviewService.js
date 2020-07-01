(function (app) {
    'use strict';

    app.factory('printPreviewService', printPreviewService);

    printPreviewService.$inject = ['notificationService', '$uibModal', 'apiService', '$rootScope']
    function printPreviewService(notificationService, $uibModal, apiService, $rootScope) {

        var service = {
            showReport: showReport
        };

        function showReport(request) {
        	$rootScope.$broadcast('print-preview', request);
            /*return $uibModal.open({
                        templateUrl: 'main/print-preview/printPreviewView.html',
                        controller: 'printPreviewCtrl',
                        size: 'lg',
                        resolve: {
                            data: {
                                url: parameters.url,
                                fromWebApi: parameters.reportParameters ? true : false,
                                reportParameters: parameters.reportParameters,
                            }
                        }
                    });*/
        }

        return service;
    }
})(angular.module('lightpro'));