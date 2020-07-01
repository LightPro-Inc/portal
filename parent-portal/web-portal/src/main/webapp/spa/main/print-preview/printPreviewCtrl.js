
(function (app) {
    'use strict';

    app.controller('printPreviewCtrl', printPreviewCtrl);

    printPreviewCtrl.$inject = ['$state','$scope', '$q', '$rootScope', '$stateParams', '$timeout', '$uibModal', '$confirm', 'utilityService', 'apiService', 'notificationService'];
    function printPreviewCtrl($state, $scope, $q, $rootScope, $stateParams, $timeout, $uibModal, $confirm, utilityService, apiService, notificationService) {
    	
    	// Data
        $scope.pdfName = "Report";
        $scope.fromWebApi = true;        
        
        // Methods
        $scope.print = print;
        $scope.goPrevious = goPrevious;
        $scope.goNext = goNext;
        $scope.exportPdf = exportPdf;
        $scope.exportXls = exportXls;
        $scope.refresh = refresh;
        $scope.close = close;

        function refresh(){
        	render({ format: 'PDF' }, function (url) {
                $scope.pdfUrl = url;
            });
        }
        
        function exportXls() {
            render({ format: 'XLS' }, function (url) {
                window.open(url, "_blank");
            });
        }

        function exportPdf() {
            window.open($scope.pdfUrl, "_blank");
        }

        function goNext() {
            $timeout(function(){
            	//console.log('go next');
            	if ($scope.pageNum + 1 > $scope.pageCount) {
	                $scope.canGoNext = false;
	                return;
	            }
	
	            $scope.pageNum += 1;
	            $scope.canGoPrevious = true;
	            //console.log($scope.canGoPrevious);
	
	            if ($scope.pageNum == $scope.pageCount) {
	                $scope.canGoNext = false;
	            }
            });
        }

        function goPrevious() {   
        	$timeout(function(){
        		if ($scope.pageNum - 1 < 1) {
                    $scope.canGoPrevious = false;
                    return;
                }

                $scope.pageNum -= 1;
                $scope.canGoNext = true;

                if ($scope.pageNum == 1) {
                    $scope.canGoPrevious = false;
                }
        	});            
        }

        $scope.onError = function (error) {
            console.log(error);
        }

        $scope.onLoad = function () {            
            setTimeout(function () {
                $scope.fit();
                $scope.canGoPrevious = false;
                $scope.canGoNext = $scope.pageCount > 1;
            }, 1000);
        }

        $scope.onProgress = function (progress) {
            // handle a progress bar
            // progress% = progress.loaded / progress.total

            // console.log(progress);
        }

        //////////

        function print() {
            render({ format: 'pdf' }, function (url) {
                window.open(url, "_blank");
            });            
        }

        function render(config, callback) {
            $scope.loadingData = true;

            if ($scope.fromWebApi) {
                var params = $scope.params ? angular.copy($scope.params) : {};
                params.format = config.format;

                apiService.buildReport($scope.url, params,
                function (arraybuffer) {
                	
                    var mimeType = null;
                    switch (params.format) {
                        case 'XLS':
                            mimeType = 'application/vnd.ms-excel';
                            break;
                        case 'postscript':
                            mimeType = 'application/postscript';
                            break;
                        default:
                            mimeType = 'application/pdf';
                            break;
                    }

                    var currentBlob = new Blob([arraybuffer], { type: mimeType });                    
                    var url = URL.createObjectURL(currentBlob);
                    
                    $scope.loadingData = false;

                    if (callback)
                        callback(url);

                }, function (response) {
                    $scope.loadingData = false;
                });
            } else {
            	$scope.loadingData = false;
                if (callback)
                    callback($scope.url);
            }            
        }

        $rootScope.$on('print-preview', function(event, args){
        	$rootScope.isInPrintPreviewState = true;
        	$scope.params = args.params;
            $scope.url = args.url;
            
        	render({ format: 'PDF' }, function (url) {
                $scope.pdfUrl = url;
            });
        	
        });
        
        function close(){
        	$rootScope.isInPrintPreviewState = false;
        }
        
        this.$onInit = function () {
   
        }
    }
})(angular.module('lightpro'));