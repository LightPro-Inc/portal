(function (app) {
    'use strict';

    app.factory('apiService', apiService);

    apiService.$inject = ['$http', '$state', 'notificationService', '$rootScope', 'rootUrl'];

    function apiService($http, $state, notificationService, $rootScope, rootUrl) {
    	
        var service = {
            get: get,
            post: post,
            put: put,
            remove: remove,
            buildReport: buildReport
        };

        function buildReport(url, data, success, failure) {
        	url = url.replace("/web", rootUrl);
            return $http.post(url, data, { responseType: "arraybuffer" }).
                          then(function (response) {
                              if(success)
                                success(response.data);
                          }, function (error, status) {
                              if (error.status == -1) {
                                  notificationService.displayError('Connexion au serveur momentanément interrompue.');
                              } else if (error.status == '401') {
                                  notificationService.displayError(error);
                                  $rootScope.simpleLogout();
                              } else if(error.status == '400') {
                              	notificationService.displayInfo(error);
                              } else if (error.status == '500') {
                                  notificationService.displayError("Une erreur inattendue s'est produite ! Veuillez contacter votre administrateur si elle persiste.");
                              } 
                              
                              if(failure)
                                  failure(error);
                          });
        }

        function get(url, config, success, failure) {
        	url = url.replace("/web", rootUrl);
            return $http.get(url, config, null)
                    .then(function (result) {
                        if(success)
                            success(result);
                    }, function (error) {
                        if (error.status == '401') {
                            notificationService.displayError(error);
                            $rootScope.simpleLogout();
                        } else if (error.status == '500') {
                            notificationService.displayError("Une erreur inattendue s'est produite ! Veuillez contacter votre administrateur si elle persiste.");
                        } else if(error.status == '400') {
                        	notificationService.displayInfo(error);
                        }
                        else if (error.status == -1) {
                            notificationService.displayError('Connexion au serveur momentanément interrompue.');
                        }
                        
                        if (failure) {
                            failure(error);
                        }
                    });
        }

        function post(url, data, success, failure) {
        	url = url.replace("/web", rootUrl);
            return $http.post(url, data, null)
                    .then(function (result) {
                        if(success)
                            success(result);
                    }, function (error) {
                        if (error.status == '401') {
                            notificationService.displayError(error);
                            $rootScope.simpleLogout();
                        } else if(error.status == '400') {
                        	notificationService.displayInfo(error);
                        } else if (error.status == '500') {
                            notificationService.displayError("Une erreur inattendue s'est produite ! Veuillez contacter votre administrateur si elle persiste.");
                        } else if (error.status == -1) {
                            notificationService.displayError('Connexion au serveur momentanément interrompue.');
                        }
                        
                        if (failure) {
                            failure(error);
                        }
                    });
        }
        
        function put(url, data, success, failure) {
        	url = url.replace("/web", rootUrl);
            return $http.put(url, data, null)
                    .then(function (result) {
                        if(success)
                            success(result);
                    }, function (error) {
                        if (error.status == '401') {
                            notificationService.displayError(error);
                            $rootScope.simpleLogout();
                        } else if(error.status == '400') {
                        	notificationService.displayInfo(error);
                        } else if (error.status == '500') {
                            notificationService.displayError("Une erreur inattendue s'est produite ! Veuillez contacter votre administrateur si elle persiste.");
                        } else if (error.status == -1) {
                            notificationService.displayError('Connexion au serveur momentanément interrompue.');
                        } 
                        
                        if (failure) {
                            failure(error);
                        }
                    });
        }
        
        function remove(url, data, success, failure) {
        	url = url.replace("/web", rootUrl);
            return $http.delete(url, data, null)
                    .then(function (result) {
                        if(success)
                            success(result);
                    }, function (error) {
                        if (error.status == '401') {
                            notificationService.displayError(error);
                            $rootScope.simpleLogout();
                        } else if(error.status == '400') {
                        	notificationService.displayInfo(error);
                        } else if (error.status == '500') {
                            notificationService.displayError("Une erreur inattendue s'est produite ! Veuillez contacter votre administrateur si elle persiste.");
                        } else if (error.status == -1) {
                            notificationService.displayError('Connexion au serveur momentanément interrompue.');
                        }
                        
                        if (failure) {
                            failure(error);
                        }
                    });
        }

        return service;
    }

})(angular.module('common.core'));