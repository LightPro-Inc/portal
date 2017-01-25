(function(app){
	'use strict';
	
	app.factory('membershipService', membershipService);
	
	membershipService.$inject = ['$rootScope', 'apiService', 'notificationService', 'localStorageService', '$base64'];
	function membershipService($rootScope, apiService, notificationService, localStorageService, $base64){
		
		function login(credentials, completed){
			apiService.post('/web/api/membership/authenticate', credentials, 
					function(response){
						
						if(response.data.isValid){
							
							$rootScope.repository = {
                                loggedUser: {
                                    username: credentials.username,
                                    id: response.data.idUser,
                                    tokens: response.data.tokens,
                                    rememberMe: credentials.rememberMe
                                }
														
                            };														
							
							initializeAfterLogin($rootScope.repository);
						}
						
						completed(response);
					},
					loginFailed);
		}
		
		function loginFailed(response){
			notificationService.displayError(response.data);
		}
		
		function initializeAfterLogin(repository){						
			if(repository.loggedUser.rememberMe){
				localStorageService.set('repository', $base64.encode(JSON.stringify(repository)));
			}
		}
		
		function logout(){		
			apiService.post(String.format('/web/api/membership/{0}/logout', $rootScope.repository.loggedUser.username), {});
			$rootScope.repository = {};
			localStorageService.remove('repository');
		}
		
		function isUserLoggedIn() {
            return $rootScope.repository.loggedUser != null;
        }
		
		return {
			login: login,
			logout: logout,
			initializeAfterLogin: initializeAfterLogin,
			isUserLoggedIn: isUserLoggedIn
		};
	}
})(angular.module('common.core'));