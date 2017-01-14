(function(app){
	'use strict';
	
	app.service('roomSettingsService', roomSettingsService);
	
	roomSettingsService.$inject = [];
	function roomSettingsService(){
		
		function getColorStatus(status) {
			var color = "";

            switch (status) {
                case "NEW":
                	color = 'orange';
                    break;
                case "EXPIRED":
                	color = 'red';
                	break;
                case "CONFIRMED":
                	color = "green";
                    break;
                case "LATE_ARRIVAL":
                	color = "#f41616";  // red
                	break;
                case 'ARRIVED': // arrived
                	color = "#1691f4";  // blue
                    break;
                case 'LATE_CHECKOUT':
                	color = "#f41616";  // red
                	break;
                case 'CHECKEDOUT': // checked out
                    color = "gray";
                    break;
                default:
                    color = "black";
                    break;    
            }
            
            return color;
		}
		
		function getStatus(statusId) {
			var status = "";

            // customize the reservation bar color and tooltip depending on status
            switch (statusId) {
                case "NEW":
                    status = 'Nouveau';
                    break;
                case "EXPIRED":
                    status = 'Expirée (pas confirmée à temps)';
                	break;
                case "CONFIRMED":
                    status = "Confirmée";
                    break;
                case "LATE_ARRIVAL":
                    status = 'Arrivée tardive';
                	break;
                case 'ARRIVED': // arrived
                    status = "Arrivé";
                    break;
                case 'LATE_CHECKOUT':
                    status = "Départ tardif";
                	break;
                case 'CHECKEDOUT': // checked out
                    status = "Parti";
                    break;
                default:
                    status = "Etat non attendu";
                    break;    
            }
            
            return status;
		}
		
		return {
			getColorStatus : getColorStatus,
			getStatus : getStatus
		}
	}
	
})(angular.module('lightpro'));