(function(app){
	'use strict';
	
	app.controller('guestCardexCtrl', guestCardexCtrl);
	
	guestCardexCtrl.$inject = ['$state', '$rootScope', '$stateParams', 'apiService', '$timeout', 'notificationService', '$uibModal', '$confirm', '$previousState'];
	function guestCardexCtrl($state, $rootScope, $stateParams, apiService, $timeout, notificationService, $uibModal, $confirm, $previousState){
		var vm = this;
		
		vm.guestId = $stateParams.guestId;
		
		// Function
		vm.editItem = editItem;
		vm.goPreviousPage = goPreviousPage;
		
		function editItem(){
			vm.loadingGuestData = true;
			apiService.put(String.format('/web/api/guest/{0}', vm.guestId), vm.item,
											function(response){
												$timeout(function(){
													vm.loadingGuestData = false;
													
													vm.item = response.data;													
													notificationService.displaySuccess('Informations enregistrées avec succès !');
												});												
											},
											function(error){
												vm.loadingGuestData = false;
												notificationService.displayError(error);
											}
			);
		}
		
		function goPreviousPage(){
			$previousState.go();
		}
		
		this.$onInit = function(){
			vm.loadingGuestData = true;
			apiService.get(String.format('/web/api/guest/{0}', vm.guestId), null,
							function(response){
								vm.item = response.data;
								if (!(vm.item.birthDate == null))
				                    vm.item.birthDate = new Date(vm.item.birthDate);
								
								vm.loadingGuestData = false;
							},
							function(error){
								notificationService.displayError(error);
								vm.loadingGuestData = false;
							}
			);
			
			vm.loadingBookingData = true;
			apiService.get(String.format('/web/api/guest/{0}/bookings', vm.guestId), null,
							function(response){
								vm.bookings = response.data;
								vm.loadingBookingData = false;
							},
							function(error){
								notificationService.displayError(error);
								vm.loadingBookingData = false;
							}
			);
		}
	}
	
})(angular.module('lightpro'));