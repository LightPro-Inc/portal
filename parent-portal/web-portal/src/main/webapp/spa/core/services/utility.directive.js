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
    
    app.directive('dateFormat', function() {
    	  return {
    	    require: 'ngModel',
    	    link: function(scope, element, attr, ngModelCtrl) {
    	      //Angular 1.3 insert a formater that force to set model to date object, otherwise throw exception.
    	      //Reset default angular formatters/parsers
    	      ngModelCtrl.$formatters.length = 0;
    	      ngModelCtrl.$parsers.length = 0;
    	    }
    	  };
    	});
    
    app.directive("uibDatepickerPopup", uibDatepickerPopup);
    
    uibDatepickerPopup.$inject = ['dateFilter', 'uibDateParser', 'uibDatepickerPopupConfig'];
    function uibDatepickerPopup(dateFilter, uibDateParser, uibDatepickerPopupConfig){
    	return {
    		restrict: 'A',
            priority: 1,
            require: 'ngModel',
            link: function (scope, element, attr, ngModel) {
                var dateFormat = attr.uibDatepickerPopup || uibDatepickerPopupConfig.datepickerPopup;
                
                ngModel.$formatters.push(function(value) {
                	                	
                	if(!value)
                		return undefined;
                	                	
                    if (angular.isNumber(value) || angular.isString(value)) {
                        return new Date(value);
                    }
                    
                    return value;
                });
                
                ngModel.$parsers.push(function(value) {
                	
                	if(!value)
                		return undefined;
                	
                    if (angular.isDate(value)) {
                        return moment(value).format("YYYY-MM-DD");
                    }
                    
                    return value;
                });
                
                ngModel.$validators.date = function(modelValue, viewValue) {
                    var value = viewValue || modelValue;
                    
                    if (!attr.ngRequired && !value) {
                        return true;
                    }
                    
                    if (angular.isNumber(value)) {
                        value = new Date(value);
                    }
                    if (!value) {
                        return true;
                    } else if (angular.isDate(value) && !isNaN(value)) {
                        return true;
                    } else if (angular.isString(value)) {
                        var date = uibDateParser.parse(value, dateFormat);                        
                        return !isNaN(date);
                    } else {
                        return false;
                    }
                };
            }
    	  };
    }
    	
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