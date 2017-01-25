(function(app){
	'use strict';
	
	app.controller('hotelDashboardCtrl', hotelDashboardCtrl);
	
	hotelDashboardCtrl.$inject = ['apiService', '$rootScope', 'notificationService', '$q', '$uibModal'];
	function hotelDashboardCtrl(apiService, $rootScope, notificationService, $q, $uibModal){
		var vm = this;
		
		vm.selectMonthRatePeriod = selectMonthRatePeriod;
		vm.selectWeekRatePeriod = selectWeekRatePeriod;
		vm.loadIndicators = loadIndicators;
		
		/*vm.loadResumeLocations = loadResumeLocations;
		
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
	    }*/
		
		function selectMonthRatePeriod(){			
			$uibModal.open({
                templateUrl: 'main/calendar/calendarView.html',
                controller: 'calendarCtrl as vm',
                size: 'md',
                resolve: {
                    data: {
                        date: vm.currentMonthRateDate
                    }
                }
            }).result.then(function (dateSelected) {
            	vm.currentMonthRateDate = dateSelected;
            	loadMonthRateOccupation(dateSelected);
            }, function () {
            });
		}
		
		function selectWeekRatePeriod(){			
			$uibModal.open({
                templateUrl: 'main/calendar/calendarView.html',
                controller: 'calendarCtrl as vm',
                size: 'md',
                resolve: {
                    data: {
                        date: vm.currentWeekRateDate
                    }
                }
            }).result.then(function (dateSelected) {
            	vm.currentWeekRateDate = dateSelected;
            	loadWeekRateOccupation(dateSelected);
            }, function () {
            });
		}
		
		function loadClientEnRecouche(){
			 apiService.get('/web/api/booking/day-occupation/client-en-recouche', {},
				        function (response) {					            				            		                    
		                    vm.numberOfClientEnRechouche = response.data.length;
				        },
				        function(error){
				        	notificationService.displayError(error);
				        }
			 );
		}
		
		function loadClientAttendu(){
			 apiService.get('/web/api/booking/day-occupation/client-attendu', {},
				        function (response) {					            				            		                    	
		                    vm.numberOfClientAttendu = response.data.length;
				        },
				        function(error){
				        	notificationService.displayError(error);
				        }
			 );
		}
		
		function loadClientArrive(){
			 return apiService.get('/web/api/booking/day-occupation/client-arrive', {},
				        function (response) {					            				            		                    	
		                    vm.numberOfClientArrive = response.data.length;
				        },
				        function(error){
				        	notificationService.displayError(error);
				        }
			 );
		}
		
		function loadRoomAvailable(){
			 return apiService.get('/web/api/room/free', {},
				        function (response) {					            				            		                    
		                    vm.numberOfFreeRooms = response.data.length;
				        },
				        function(error){
				        	notificationService.displayError(error);
				        }
			 );
		}
		
		function loadRoomOccupied(){
			 return apiService.get('/web/api/room/occupied', {},
				        function (response) {					            				            		                    
		                    vm.numberOfRoomOccupied = response.data.length;
				        },
				        function(error){
				        	notificationService.displayError(error);
				        }
			 );
		}
		
		function loadRoomDirty(){
			 vm.loadingRoomOccupied = true;
			 return apiService.get('/web/api/room/dirty', {},
				        function (response) {					            				            		                    
		                    vm.loadingRoomDirty = false;	
		                    vm.numberOfRoomDirty = response.data.length;
				        },
				        function(error){
				        	notificationService.displayError(error);
				        	vm.loadingRoomDirty = false;
				        }
			 );
		}
		
		function loadMonthRateOccupation(date){
			 vm.monthRate = {};
			 vm.monthRate.loadingData = true;
			 return apiService.post('/web/api/booking/rate-occupation/month', date,
				        function (response) {					            				            		                    
				 			vm.monthRate.loadingData = false;
				 			vm.monthRate.periodFormatted = response.data.periodFormatted;
		                    vm.monthRate.rate = response.data.rateInPercentFormatted;
				        },
				        function(error){
				        	notificationService.displayError(error);
				        	vm.monthRate.loadingData = false;
				        }
			 );
		}
		
		function loadWeekWorkDayRateOccupation(date){			 			
			 return apiService.post('/web/api/booking/rate-occupation/week-work-day', date,
				        function (response) {
				 			vm.weekWorkDayRate = {};
		                    vm.weekWorkDayRate.periodFormatted = response.data.periodFormatted;
		                    vm.weekWorkDayRate.rate = response.data.rateInPercentFormatted;
				        },
				        function(error){
				        	notificationService.displayError(error);
				        }
			 );
		}
		
		function loadWeekendRateOccupation(date){
			 return apiService.post('/web/api/booking/rate-occupation/weekend', date,
				        function (response) {	
				 			vm.weekendRate = {};
			 				vm.weekendRate.periodFormatted = response.data.periodFormatted;
			 				vm.weekendRate.rate = response.data.rateInPercentFormatted;
				        },
				        function(error){
				        	notificationService.displayError(error);
				        }
			 );
		}
		
		function loadWeekRateOccupation(date){
			vm.weekLoadingData = true;
			$q.all([loadWeekWorkDayRateOccupation(date), loadWeekendRateOccupation(date)]).then(function(){
				vm.weekLoadingData = false;
			}, function(){
				vm.weekLoadingData = false;
			});
		}
		
		function loadRoomAvailability(){
			vm.loadingRoomAvailability = true;
			$q.all([loadRoomAvailable(), loadRoomOccupied()]).then(function(){
				vm.loadingRoomAvailability = false;
			}, function(){
				vm.loadingRoomAvailability = false;
			});
		}
		
		function loadDayOccupation(){
			vm.loadingDayOccupation = true;
			$q.all([loadClientEnRecouche(), loadClientAttendu(), loadClientArrive()]).then(function(){
				vm.loadingDayOccupation = false;
			}, function(){
				vm.loadingDayOccupation = false;
			});
		}
		
		function loadIndicators(){			
			loadMonthRateOccupation(vm.currentMonthRateDate);						
			loadWeekRateOccupation(vm.currentWeekRateDate);
			
			loadRoomAvailability();
			loadRoomDirty()
			loadDayOccupation();		
		}
		
		this.$onInit = function(){
			vm.currentMonthRateDate = new Date();
			vm.currentWeekRateDate = new Date();
			loadIndicators();
		}
	}
	
})(angular.module('lightpro'));