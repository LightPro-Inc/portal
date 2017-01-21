(function(app){
	'use strict';
	
	app.controller('editBookCtrl', editBookCtrl);
	
	editBookCtrl.$inject = ['$state', '$rootScope', '$stateParams', 'apiService', '$timeout', 'notificationService', '$uibModal', '$confirm', '$previousState'];
	function editBookCtrl($state, $rootScope, $stateParams, apiService, $timeout, notificationService, $uibModal, $confirm, $previousState){
		var vm = this;
		
		vm.bookingId = $stateParams.bookingId;
		
		
		vm.dateOptions = {
	            formatYear: 'yy',
	            startingDay: 1
	        };

        vm.datepicker = { format: 'yyyy-MM-dd' };
        vm.datepickerDeliveredBy = { format: 'yyyy-MM-dd' };
        
        // Function
        vm.openDatePicker = openDatePicker;
        vm.openDatePickerDeliveredBy = openDatePickerDeliveredBy;
        vm.goPreviousPage = goPreviousPage;
		vm.identifyGuest = identifyGuest;
		vm.searchPerson = searchPerson;
		vm.razGuest = razGuest;
		vm.canSaveGuest = canSaveGuest;
		vm.canClearGuest = canClearGuest;
		vm.save = save;
		
		function canSaveGuest(){
			return vm.guest && (vm.guest.firstName && vm.guest.lastName)
		}
		
		function canClearGuest(){
			return canSaveGuest();
		}
        
        function razGuest(){
        	vm.guest = {sex: 'M', fullName : 'Non identifié' };
        }
        
		function searchPerson(){
			$uibModal.open({
                templateUrl: 'main/person/personSearchView.html',
                controller: 'personSearchCtrl as vm',
                resolve: {
                    data: { }
                }
            }).result.then(function (personSelected) {

            	$timeout(function(){
            		vm.guest = personSelected;
            		vm.guest.birthDate = new Date(personSelected.birthDate);            		            		
            	});            	
            }, function () {

            });    
		}
		
		function identifyGuest(){
			vm.loadingGuestData = true;
			apiService.post(String.format('/web/api/booking/{0}/guest', vm.bookingId), vm.guest,
											function(response){
												$timeout(function(){
													vm.loadingGuestData = false;
													
													vm.guest = response.data;	
													vm.guest.birthDate = new Date(vm.guest.birthDate);
													notificationService.displaySuccess('Hôte enregistré avec succès !');
												});												
											}
			);
		}
		
		function save(){
			vm.item.guest = vm.guest;
			vm.item.guestId = vm.guest.id;
			
			vm.loadingBooking = true;
			apiService.put(String.format('/web/api/booking/{0}', vm.bookingId), vm.item,
											function(response){
												vm.loadingBooking = false;	
												
												$timeout(function(){
																							
													notificationService.displaySuccess('Réservation modifiée avec succès !');
													vm.goPreviousPage();
												});												
											},
											function(error){
												vm.loadingBooking = false;	
												notificationService.displayError(error);
											}
			);
		}
		
		function goPreviousPage(){
			if($previousState.get().state.name == 'main.hotel.planning')
			{
				var previous = $previousState.get();
				previous.params.startDate = vm.item.start;
				$state.go(previous.state, previous.params);
			}
			else
				$previousState.go();
		}

		function loadGuest(){
			// obtenir l'hôte        	
			vm.loadingGuestData = true;
			apiService.get(String.format('/web/api/booking/{0}/guest', vm.bookingId), null,
							function(response){
								vm.guest = response.data;
								if (!(vm.guest.birthDate == null))
				                    vm.guest.birthDate = new Date(vm.guest.birthDate);
								vm.loadingGuestData = false;
							},
							function(error){
								notificationService.displayError(error);
								vm.loadingGuestData = false;
							}
			);
		}
		
		function confirm(){
			$confirm({ text: String.format("Souhaitez-vous confirmer cette réservation ?"), title: 'Confirmer une réservation', ok: 'Oui', cancel: 'Non' })
        	.then(function () {

        		apiService.post(String.format('/web/api/booking/{0}/confirm', vm.bookingId), null,
    					function(response){
    						loadBooking();
    					},
    					function(error){
    						notificationService.displayError(error);
    					}
    			);
        	});  					
		}	
		
		function cancel(){
			$confirm({ text: String.format("Souhaitez-vous annuler cette réservation ?"), title: 'Annuler une réservation', ok: 'Oui', cancel: 'Non' })
        	.then(function () {

        		apiService.post(String.format('/web/api/booking/{0}/cancel', vm.bookingId), null,
    					function(response){
        					goPreviousPage();
        					notificationService.displaySuccess("La réservation a été annulée avec succès !");
    					},
    					function(error){
    						notificationService.displayError(error);
    					}
    			);
        	});  					
		}
		
		function checkIn(){
			$confirm({ text: String.format("Souhaitez-vous loger l'hôte ?"), title: 'Loger un hôte', ok: 'Oui', cancel: 'Non' })
        	.then(function () {

        		apiService.post(String.format('/web/api/booking/{0}/checkIn', vm.bookingId), null,
    					function(response){
        					loadBooking();
        					notificationService.displaySuccess("L'hôte a été logé avec succès !");
    					},
    					function(error){
    						notificationService.displayError(error);
    					}
    			);
        	});  					
		}
		
		function checkOut(){
			$confirm({ text: String.format("Souhaitez-vous mettre terme à cette réservation ?"), title: 'Mettre terme à une réservation', ok: 'Oui', cancel: 'Non' })
        	.then(function () {

        		apiService.post(String.format('/web/api/booking/{0}/checkOut', vm.bookingId), null,
    					function(response){
        					loadBooking();
        					notificationService.displaySuccess("La réservation a été clôturée avec succès !");
    					},
    					function(error){
    						notificationService.displayError(error);
    					}
    			);
        	});  					
		}
		
		function loadBooking(){
			vm.loadingBooking = true;
			apiService.get(String.format('/web/api/booking/{0}', vm.bookingId), null, 
					function(response){
						vm.loadingBooking = false;
						vm.item = response.data; 
						
						if(vm.item.deliveredDatePiece)
							vm.item.deliveredDatePiece = new Date(vm.item.deliveredDatePiece);
						
						vm.bookingStatus = [                
						                    {
						                    	id: "CONFIRMED",
						                    	value: "Confirmer",
						                    	active: vm.item.canConfirm,
						                    	action: confirm
						                    },
						                    {
						                    	id: "CANCELLED",
						                    	value: "Annuler",
						                    	active: vm.item.canCancel,
						    					action: cancel
						                    },
						                    {
						                    	id: "ARRIVED",
						                    	value: "Loger",
						                    	active: vm.item.canCheckIn,
						    					action: checkIn
						                    },
						                    {
						                    	id: "CHECKEDOUT",
						                    	value: "Libérer",
						                    	active: vm.item.canCheckOut,
						                		action: checkOut
						                    }
						            	];
						
						if(vm.item.guestId){
							loadGuest();
						}else{
							razGuest();
						}						
					},
					function(error){
							vm.loadingBooking = false;
							notificationService.displayError(error);
						}
			);
		}		
		
		function openDatePicker($event) {
            $event.preventDefault();
            $event.stopPropagation();

            vm.datepicker.opened = true;
        };
        
		function openDatePickerDeliveredBy($event) {
            $event.preventDefault();
            $event.stopPropagation();

            vm.datepickerDeliveredBy.opened = true;
        };
        
		this.$onInit = function(){        	        	          	   
        	loadBooking();        	        	        	
        }
	}
	
})(angular.module('lightpro'));