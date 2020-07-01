(function(app){
	'use strict';
	
	app.controller('newBookCtrl', newBookCtrl);
	
	newBookCtrl.$inject = ['data', '$uibModalInstance', 'apiService', 'utilityService', 'notificationService'];
	function newBookCtrl(data, $uibModalInstance, apiService, utilityService, notificationService){
		var vm = this;
		
		vm.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

	    vm.datepicker = { format: 'dd/MM/yyyy' };
	    
	    // Function
	    vm.openStartDatePicker = openStartDatePicker;
	    vm.openEndDatePicker = openEndDatePicker;
		vm.cancelEdit = cancelEdit;
        vm.saveItem = saveItem;
        vm.roomChanged = roomChanged;
        
        function roomChanged(roomId){
        	var room = utilityService.findSingle(vm.rooms, "id", roomId);
        	vm.item.nightPriceApplied = room.nightPrice;
        }
        
        function openStartDatePicker($event) {
            $event.preventDefault();
            $event.stopPropagation();

            vm.datepicker.openedStart = true;
        };
        
        function openEndDatePicker($event) {
            $event.preventDefault();
            $event.stopPropagation();

            vm.datepicker.openedEnd = true;
        };
        
        function saveItem() {
        	apiService.post(String.format('/web/api/room/{0}/book', vm.item.roomId), vm.item,
            		function(response){
            			notificationService.displaySuccess("La réservation a été effectuée avec succès !");
            			$uibModalInstance.close(response.data);
            		},
            		function(error){
            			
            		}
            );         
        }
        
        function cancelEdit() {
            $uibModalInstance.dismiss();
        }
        
        this.$onInit = function(){
        	
        	vm.item = angular.copy(data);
    		vm.item.start = new Date(vm.item.start);
        	vm.item.end = new Date(vm.item.end);
			
			apiService.get('/web/api/room', null, function(response){
        		vm.rooms = response.data;
        		
        		roomChanged(vm.item.roomId);
        	});        	        
        }
	}
})(angular.module('lightpro'));