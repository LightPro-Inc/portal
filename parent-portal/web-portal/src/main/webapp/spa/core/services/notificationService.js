(function(app){
	'use strict';

	app.factory('notificationService', notificationService);

	notificationService.$inject = []
	function notificationService() {
	    
		toastr.options = {
			"debug": false,
			"positionClass": "toast-bottom-right",
			"onclick":null,
			"fadeIn": 300,
			"fadeOut": 1000,
			"timeOut": 5000,
			"extendedTimeOut": 1000,
		    "closeButton": true
		};

		var service = {
			displaySuccess: displaySuccess,
			displayError: displayError,
			displayWarning: displayWarning,
			displayInfo: displayInfo,
            clear: clear
		};

		function clear(toast) {
		    toastr.clear(toast);
		}

		function displaySuccess(message, title){
			return toastr.success(message, title);
		}

		function displayError(error, title) {
			if(Array.isArray(error)){
				error.forEach(function(err){
				    toastr.error(err, title);
				});
			}else{				
				if(typeof(error) === 'object' && error.data){
					return toastr.error(error.data.message, error.data.title);
				}else{
					return toastr.error(error, title);
				}			    
			}
		}

		function displayWarning(message, title) {
		    return toastr.warning(message, title);
		}

		function displayInfo(message, title) {
		    return toastr.info(message, title);
		}

		return service;		
	}
})(angular.module('common.core'));