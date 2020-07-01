(function(app){
	'use strict';
	
	app.factory('membershipService', membershipService);
	
	membershipService.$inject = ['$rootScope', 'apiService', 'notificationService', 'localStorageService', '$base64', '$http', '$state'];
	function membershipService($rootScope, apiService, notificationService, localStorageService, $base64, $http, $state){
		
		function login(credentials, completed){
			apiService.post('/web/api/membership/authenticate', credentials, 
					function(response){
										
						$rootScope.repository = {
							loggedUser : {
		                            username: credentials.fullUsername,
		                            id: response.data.idUser,
		                            token: response.data.token,
		                            photo: response.data.photo
		                        },
		                    rememberMe: credentials.rememberMe,
	                        domain: response.data.domain
	                    };		
						
						saveRepository($rootScope.repository);
						setAuthentication($rootScope.repository.loggedUser);
						
						completed(response);
					},
					loginFailed);
		}
		
		function loginFailed(error){
			
		}
		
		function saveRepository(repository){
			var repositoryToSave = angular.copy(repository);
			
			if(!repositoryToSave.rememberMe)
				repositoryToSave.loggedUser = undefined;
			
			localStorageService.set('repository', $base64.encode(JSON.stringify(repositoryToSave)));
		}
		
		function setAuthentication(loggedUser){	
			$http.defaults.headers.common['Authorization'] = 'Bearer ' + loggedUser.token;			
		}
		
		function setAuthenticationIfAlreadyLogged(){
			
			var repositoryData = localStorageService.get('repository');		
			$rootScope.repository = repositoryData ? JSON.parse($base64.decode(repositoryData)) : {};
	        
			if ($rootScope.repository.rememberMe) {            
	            setAuthentication($rootScope.repository.loggedUser);
	        }
		}
		
		function logout(){		
			apiService.post(String.format('/web/api/membership/{0}/logout', $rootScope.repository.loggedUser.username), {});
			$rootScope.repository.loggedUser = undefined;
			$rootScope.repository.rememberMe = false;
			
			saveRepository($rootScope.repository);
		}
		
		function simpleLogout(){		
			$rootScope.repository.loggedUser = undefined;
			$rootScope.repository.rememberMe = false;
			saveRepository($rootScope.repository);
			$state.go('login');
		}
		
		function isUserLoggedIn() {
            return !($rootScope.repository.loggedUser == undefined);
        }
		
		return {
			login: login,
			logout: logout,
			setAuthenticationIfAlreadyLogged: setAuthenticationIfAlreadyLogged,
			isUserLoggedIn: isUserLoggedIn,
			simpleLogout: simpleLogout,
			saveRepository: saveRepository
		};
	}
})(angular.module('common.core'));