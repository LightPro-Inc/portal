(function(app){
	'use strict';
	
	app.controller('editBookCtrl', editBookCtrl);
	
	editBookCtrl.$inject = ['$state', '$rootScope', '$stateParams', 'apiService', '$timeout', 'notificationService', '$uibModal', '$confirm', '$previousState', 'contactService'];
	function editBookCtrl($state, $rootScope, $stateParams, apiService, $timeout, notificationService, $uibModal, $confirm, $previousState, contactService){
		var vm = this;
		
		vm.bookingId = $stateParams.bookingId;		
		
		vm.dateOptions = {
	            formatYear: 'yy',
	            startingDay: 1
	        };

        vm.datepicker = { format: 'dd/MM/yyyy' };
        vm.datepickerDeliveredBy = { format: 'dd/MM/yyyy' };
        
        // Function
        vm.openDatePicker = openDatePicker;
        vm.openDatePickerDeliveredBy = openDatePickerDeliveredBy;
        vm.goPreviousPage = goPreviousPage;
		
		vm.save = save;
		vm.searchCustomer = searchCustomer;
		vm.modifyCustomer = modifyCustomer;
		vm.searchGuest = searchGuest;
		vm.modifyGuest = modifyGuest;
		vm.invoice = invoice;
		
		function invoice(){
			$state.go('main.sales.edit-purchase-order', {purchaseOrderId: vm.item.orderId}, {location: false});         
		}
		
		function modifyGuest(){
			apiService.get(String.format('/web/api/contact/{0}', vm.item.guestId), {},
					function(response){
						contactService.edit(response.data, function(person){
							vm.item.guest = person.name;
						});
					}
			);			
		}
		
		function searchGuest(){
			contactService.search("all", function(person){
				vm.item.guest = person.name;
				vm.item.guestId = person.id;
			});
		}
		function modifyCustomer(){
			apiService.get(String.format('/web/api/contact/{0}', vm.item.customerId), {},
					function(response){
						contactService.edit(response.data, function(person){
							vm.item.customer = person.name;
						});
					}
			);			
		}
		
		function searchCustomer(){
			contactService.search("all", function(person){
				
				if(vm.item.customerId == vm.item.guestId){
					vm.item.guestId = person.id;
					vm.item.guest = person.name;
				}
				
				vm.item.customer = person.name;
				vm.item.customerId = person.id;
			});
		}
		
		function save(){
			vm.loadingBooking = true;
			apiService.put(String.format('/web/api/booking/{0}', vm.bookingId), vm.item,
											function(response){
												vm.loadingBooking = false;	
												
												$timeout(function(){
																							
													notificationService.displaySuccess('Réservation modifiée avec succès !');
													
													if(vm.canClose)
														goPreviousPage();
													else {
														loadBooking();
													}
												});												
											},
											function(error){
												vm.loadingBooking = false;													
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
		
		function confirm(){
			$confirm({ text: String.format("Souhaitez-vous confirmer cette réservation ?"), title: 'Confirmer une réservation', ok: 'Oui', cancel: 'Non' })
        	.then(function () {

        		apiService.post(String.format('/web/api/booking/{0}/confirm', vm.bookingId), null,
    					function(response){
        					goPreviousPage();
        					notificationService.displaySuccess("La réservation a été confirmée avec succès !");
    					},
    					function(error){    						
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
    						
    					}
    			);
        	});  					
		}
		
		function checkIn(){
			$confirm({ text: String.format("Souhaitez-vous loger l'hôte ?"), title: 'Loger un hôte', ok: 'Oui', cancel: 'Non' })
        	.then(function () {

        		apiService.post(String.format('/web/api/booking/{0}/checkIn', vm.bookingId), null,
    					function(response){
        					goPreviousPage();
        					notificationService.displaySuccess("L'hôte a été logé avec succès !");
    					},
    					function(error){
    						
    					}
    			);
        	});  					
		}
		
		function checkOut(){
			$confirm({ text: String.format("Souhaitez-vous mettre terme à cette réservation ?"), title: 'Mettre terme à une réservation', ok: 'Oui', cancel: 'Non' })
        	.then(function () {

        		apiService.post(String.format('/web/api/booking/{0}/checkOut', vm.bookingId), null,
    					function(response){
        					goPreviousPage();
        					notificationService.displaySuccess("La réservation a été clôturée avec succès !");
    					},
    					function(error){
    						
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
					},
					function(error){
							vm.loadingBooking = false;							
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