(function (app) {
    'use strict';

    app.factory('apiService', apiService);

    apiService.$inject = ['$http', '$state', 'notificationService', '$rootScope'];

    function apiService($http, $state, notificationService, $rootScope) {

        var service = {
            get: get,
            post: post,
            put: put,
            remove: remove,
            buildReport: buildReport
        };

        function buildReport(url, data, success, failure) {
            return $http.post(url, data, { responseType: "arraybuffer" }).
                          success(function (data) {
                              if(success)
                                success(data);
                          }).
                          error(function (error, status) {
                              if (error.status == -1) {
                                  notificationService.displayError('Connexion au serveur momentanément interrompue.');
                              }else if(failure)
                                  failure(error);
                          });
        }

        function get(url, config, success, failure) {
            return $http.get(url, config, null)
                    .then(function (result) {
                        if(success)
                            success(result);
                    }, function (error) {
                        if (error.status == '401') {
                            notificationService.displayError('Authentication required.');
                            $state.go('login');
                        } else if (error.status == -1) {
                            notificationService.displayError('Connexion au serveur momentanément interrompue.');
                        }
                        else if (failure) {
                            failure(error);
                        }
                    });
        }

        function post(url, data, success, failure) {
            return $http.post(url, data, null)
                    .then(function (result) {
                        if(success)
                            success(result);
                    }, function (error) {
                        if (error.status == '401') {
                            notificationService.displayError('Authentication required.');
                            $state.go('login');
                        } else if (error.status == -1) {
                            notificationService.displayError('Connexion au serveur momentanément interrompue.');
                        }
                        else if (failure) {
                            failure(error);
                        }
                    });
        }
        
        function put(url, data, success, failure) {
            return $http.put(url, data, null)
                    .then(function (result) {
                        if(success)
                            success(result);
                    }, function (error) {
                        if (error.status == '401') {
                            notificationService.displayError('Authentication required.');
                            $state.go('login');
                        } else if (error.status == -1) {
                            notificationService.displayError('Connexion au serveur momentanément interrompue.');
                        }
                        else if (failure) {
                            failure(error);
                        }
                    });
        }
        
        function remove(url, data, success, failure) {
            return $http.delete(url, data, null)
                    .then(function (result) {
                        if(success)
                            success(result);
                    }, function (error) {
                        if (error.status == '401') {
                            notificationService.displayError('Authentication required.');
                            $state.go('login');
                        } else if (error.status == -1) {
                            notificationService.displayError('Connexion au serveur momentanément interrompue.');
                        }
                        else if (failure) {
                            failure(error);
                        }
                    });
        }

        return service;
    }

})(angular.module('common.core'));