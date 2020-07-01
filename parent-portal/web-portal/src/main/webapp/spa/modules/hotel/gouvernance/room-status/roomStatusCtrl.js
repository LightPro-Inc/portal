(function(app){
	'use strict';
	
	app.controller('roomStatusCtrl', roomStatusCtrl);
	
	roomStatusCtrl.$inject = ['apiService', '$scope', '$rootScope', 'notificationService', '$interval', 'utilityService', '$confirm'];
	function roomStatusCtrl(apiService, $scope, $rootScope, notificationService, $interval, utilityService, $confirm){
		var vm = this;

		vm.getStatusColor = getStatusColor;
		vm.markDirty = markDirty;
		vm.markCleanup = markCleanup;
		vm.markOutOfService = markOutOfService;
		vm.markInService = markInService;
		
		function markDirty(room){
			$confirm({ text: String.format("Souhaitez-vous marquer sale la chambre N° {0} ?", room.number), title: "Marquer une chambre sale", ok: 'Oui', cancel: 'Non' })
        	.then(function () {

        		apiService.post(String.format('/web/api/room/{0}/mark-dirty', room.id), {}, 
    					function(response){
    						utilityService.replace(vm.rooms, room, response.data, 'id');	
    						notificationService.displaySuccess("Chambre marquée sale avec succès !");
    					},
    					function(error){
    						
    					}
    			);	
        	});  			
		}
		
		function markCleanup(room){
			$confirm({ text: String.format("Souhaitez-vous marquer propre la chambre N° {0} ?", room.number), title: "Marquer une chambre propre", ok: 'Oui', cancel: 'Non' })
        	.then(function () {

        		apiService.post(String.format('/web/api/room/{0}/mark-cleanup', room.id), {}, 
    					function(response){
    						utilityService.replace(vm.rooms, room, response.data, 'id');	
    						notificationService.displaySuccess("Chambre marquée propre avec succès !");
    					},
    					function(error){
    						
    					}
    			);	
        	});  				
		}
		
		function markInService(room){
			$confirm({ text: String.format("Souhaitez-vous mettre en service la chambre N° {0} ?", room.number), title: "Mettre une chambre en service", ok: 'Oui', cancel: 'Non' })
        	.then(function () {

        		apiService.post(String.format('/web/api/room/{0}/mark-in-service', room.id), {}, 
    					function(response){
    						utilityService.replace(vm.rooms, room, response.data, 'id');	
    						notificationService.displaySuccess("Chambre mise en service avec succès !");
    					},
    					function(error){
    						
    					}
    			);		
        	});			
		}
		
		function markOutOfService(room){
			$confirm({ text: String.format("Souhaitez-vous mettre hors service la chambre N° {0} ?", room.number), title: "Mettre une chambre hors service", ok: 'Oui', cancel: 'Non' })
        	.then(function () {

        		apiService.post(String.format('/web/api/room/{0}/mark-out-of-service', room.id), {}, 
    					function(response){
    						utilityService.replace(vm.rooms, room, response.data, 'id');	
    						notificationService.displaySuccess("Chambre mise hors service avec succès!");
    					},
    					function(error){
    						
    					}
    			);		
        	});				
		}
		
		
		function getStatusColor(room) {
			switch (room.statusId) {
	            case 'READY':
	                return 'green';
	            case 'DIRTY':
	                return 'red';
	            case 'CLEANUP':
	                return 'orange';
	            default:
	                return '#CECECE';
	        }
		}
		
		function loadItems() {
			apiService.get(String.format('/web/api/room'), {}, 
					function(response){
						vm.rooms = response.data;	
					}
			);		
		}
		
		this.$onInit = function(){
			loadItems();					
		}
	}
	
})(angular.module('lightpro'));