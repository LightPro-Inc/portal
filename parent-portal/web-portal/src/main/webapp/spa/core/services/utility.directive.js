(function(app){
    'use strict';

    app.directive('clickOnce', clickOnce);

    clickOnce.$inject = ['$http']; 
    function clickOnce($http) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {

                var oldNgClick = attrs.ngClick != undefined ? attrs.ngClick : attrs.ngSubmit;
                scope.isLoading = function () {
                    return $http.pendingRequests.length > 0;
                };

                scope.$watch(scope.isLoading, function (value) {
                    if (value) {
                        element.attr("disabled", "disabled");
                        $(element).click(function (event) {
                            event.preventDefault();
                        });
                    } else {
                        $(element).unbind('click');
                        element.removeAttr("disabled");
                    }
                });
            }
        };
    };

    app.directive("appFilereader", appFilereader);
    
    appFilereader.$inject = ['$rootScope', '$q'];
    function appFilereader($rootScope, $q) {
        var slice = Array.prototype.slice;

        return {
            restrict: 'A',
            require: '?ngModel',
            link: function (scope, element, attrs, ngModel) {

                if (!ngModel) return;

                ngModel.$render = function () { };

                element.bind('change', function (e) {
                    var element = e.target;
                    if (!element.value) return;

                    var eventNameToListenTo = angular.isUndefined(element.id) ? "changed" : element.id + "-changed";

                    $rootScope.$emit(eventNameToListenTo, { detail: { fileName: element.value } });

                    element.disabled = true;
                    $q.all(slice.call(element.files, 0).map(readFile))
                      .then(function (values) {
                          if (element.multiple) ngModel.$setViewValue(values);
                          else ngModel.$setViewValue(values.length ? values[0] : null);
                          element.value = null;
                          element.disabled = false;
                      });

                    function readFile(file) {
                        var deferred = $q.defer();

                        var reader = new FileReader();
                        reader.onload = function (e) {
                            deferred.resolve(e.target.result);
                        };
                        reader.onerror = function (e) {
                            deferred.reject(e);
                        };

                        reader.readAsDataURL(file);

                        return deferred.promise;
                    }

                }); //change

            } //link

        }; //return
    }

})(angular.module('common.core'));