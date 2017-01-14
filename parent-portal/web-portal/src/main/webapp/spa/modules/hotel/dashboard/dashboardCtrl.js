(function(app){
	'use strict';
	
	app.controller('hotelDashboardCtrl', hotelDashboardCtrl);
	
	hotelDashboardCtrl.$inject = ['apiService', '$rootScope', 'notificationService'];
	function hotelDashboardCtrl(apiService, $rootScope, notificationService){
		var vm = this;
		
		vm.loadResumeLocations = loadResumeLocations;
		
		function loadResumeLocations() {

	        vm.loadingLocations = true;
	        apiService.get('/web/api/booking/resumeStat', null,
					        function (response) {					            
					            vm.resumeStat = response.data;
					            
					            var data = [];
			                    angular.forEach(vm.resumeStat.stats, function (value) {
			                        data.push({
			                            label: value.roomCategory,
			                            value: value.amount
			                        });
			                    });

			                    vm.locationsByRoomCategory = {
			                        chart: {
			                            caption: "Chiffres d'affaire réparti par catégorie de chambre",
			                            subcaption: "",
			                            startingangle: "120",
			                            showlabels: "0",
			                            showlegend: "1",
			                            enablemultislicing: "0",
			                            slicingdistance: "15",
			                            showpercentvalues: "1",
			                            showpercentintooltip: "0",
			                            plottooltext: "Produit : $label / Montant : $datavalue FCFA",
			                            theme: "fint"
			                        },
			                        data: data
			                    };
			                    
			                    vm.loadingLocations = false;			                    
					        },
					        function(error){
					        	notificationService.displayError(error);
					        	vm.loadingLocations = false;
					        }
	        );
	    }
		
		this.$onInit = function(){
			loadResumeLocations();
		}
	}
	
})(angular.module('lightpro'));