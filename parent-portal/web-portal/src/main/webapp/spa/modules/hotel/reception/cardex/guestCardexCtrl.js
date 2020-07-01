(function(app){
	'use strict';
	
	app.controller('guestCardexCtrl', guestCardexCtrl);
	
	guestCardexCtrl.$inject = ['$state', '$rootScope', '$stateParams', 'apiService', '$timeout', 'notificationService', '$uibModal', '$confirm', '$previousState'];
	function guestCardexCtrl($state, $rootScope, $stateParams, apiService, $timeout, notificationService, $uibModal, $confirm, $previousState){
		var vm = this;
		
		vm.guestId = $stateParams.guestId;
		
		// Function
		vm.goPreviousPage = goPreviousPage;
		
		function goPreviousPage(){
			$previousState.go();
		}
		
		this.$onInit = function(){
			
			apiService.get(String.format('/web/api/guest/{0}', vm.guestId), {},
							function(response){
								vm.item = response.data;
							},
							function(error){								
								
							}
			);
			
			vm.loadingBookingData = true;
			apiService.get(String.format('/web/api/guest/{0}/bookings', vm.guestId), {},
							function(response){
								vm.bookings = response.data;
								vm.loadingBookingData = false;
							},
							function(error){								
								vm.loadingBookingData = false;
							}
			);
		}
	}
	
})(angular.module('lightpro'));