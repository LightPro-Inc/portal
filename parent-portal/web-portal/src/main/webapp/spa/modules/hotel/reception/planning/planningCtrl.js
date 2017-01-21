/**
 * 
 */
(function(app){
	'use strict';
	
	app.controller('planningCtrl', planningCtrl);
	
	planningCtrl.$inject = ['apiService', '$scope', '$rootScope', '$timeout', '$uibModal', '$confirm', 'notificationService', '$state', '$stateParams'];
	function planningCtrl(apiService, $scope, $rootScope, $timeout, $uibModal, $confirm, notificationService, $state, $stateParams){

		var vm = this;
		var dp;
		
		vm.navigatorConfig = {
		          selectMode: "month",
		          showMonths: 3,
		          skipMonths: 3,
		          onTimeRangeSelected: function(args) {
	        	  
		              if ($scope.scheduler.visibleStart().getDatePart() <= args.day && args.day < $scope.scheduler.visibleEnd()) {
		            	  $scope.scheduler.scrollTo(args.day, "fast");  // just scroll
		              }
		              else {
		                  loadEvents(args.day);  // reload and scroll
		              }
		          }
		      };			
		
		vm.schedulerConfig = {
				visible: false,
	            scale: "Manual",
	            timeline: getTimeline(),
	            timeHeaders: [ { groupBy: "Month", format: "MMMM yyyy" }, { groupBy: "Day", format: "d" } ],
	            eventDeleteHandling: "CallBack",
	            allowEventOverlap: false,
	            cellWidthSpec: "Auto",
	            eventHeight: 50,
	            rowHeaderColumns: [
	           	                {title: "Chambre", width: 80},
	           	                {title: "Capacité", width: 80},
	           	                {title: "Statut", width: 80}
	           	            ],
	            onBeforeResHeaderRender: function(args) {
	            	  var beds = function(count) {
	            	      return count + " Lit" + (count > 1 ? "s" : "");
	            	  };
	            	  
	            	  args.resource.html = args.resource.number;
	            	  args.resource.columns[0].html = beds(args.resource.capacity);
	            	  args.resource.columns[1].html = args.resource.status;
	            	  
	            	  switch (args.resource.statusId) {
	            	      case "DIRTY":
	            	          args.resource.cssClass = "status_dirty";
	            	          break;
	            	      case "CLEANUP":
	            	          args.resource.cssClass = "status_cleanup";
	            	          break;
	            	  }
	            },
	            onEventMoved: function (args) {
	            	var params = {
            			newStart : args.newStart.toString(), 
            			newEnd: args.newEnd.toString(),
            			newRoomId: args.newResource
                	};
                	
                	apiService.post(String.format("/web/api/booking/{0}/move", args.e.id()), params,
    					function(response){
        					loadRooms(args.newStart); 
        					
        					if(args.e.data.roomId == args.newResource){
        						notificationService.displaySuccess("Modification de la période effectuée avec succès !");
        	            	}else{
        	            		notificationService.displaySuccess("Relogement effectué avec succès !");
        	            	}    						
    					},
    					function(error){
    						notificationService.displayError(error);
    						loadRooms(args.newStart);
    					}
        			); 
                },
                onEventResized: function (args) {
                	var params = {
            			newStart : args.newStart.toString(), 
            			newEnd: args.newEnd.toString()
                	};

                	apiService.post(String.format("/web/api/booking/{0}/resize", args.e.id()), params,
        					function(response){
            					loadRooms(args.newStart);    						
        						notificationService.displaySuccess("Modification de la période effectuée avec succès !");
        					},
        					function(error){
        						notificationService.displayError(error);
        						loadRooms(args.newStart);
        					}
        			);           	
                },
	            onTimeRangeSelected: function (args) {
	            	
	            	$uibModal.open({
	                    templateUrl: 'modules/hotel/reception/planning/newBookView.html',
	                    controller: 'newBookCtrl as vm',
	                    resolve: {
	                        data: {
	                        	id: null,	                        	
	                            roomId: args.resource,
	                            start: args.start.toString(),
	                            end: args.end.toString()	                            
	                        }
	                    }
	                }).result.then(function () {
	                	dp.clearSelection();
	                	loadRooms(args.start);
	                }, function () {
	                	dp.clearSelection();
	                });                  
                },
                onEventClick: function(args) {
                	$state.go('main.hotel.booking', { bookingId: args.e.id() }, { location: false }); 
                },
                onEventDeleted: function(args){

                	$confirm({ text: String.format("Souhaitez-vous annuler cette réservation ?"), title: 'Annuler une réservation', ok: 'Oui', cancel: 'Non' })
                	.then(function () {

                		apiService.post(String.format('/web/api/booking/{0}/cancel', args.e.id()), null,
            					function(response){
                					loadRooms(args.e.start);    						
            						notificationService.displaySuccess("La réservation a été annulée avec succès !");
            					},
            					function(error){
            						notificationService.displayError(error);
            					}
            			);
                	}); 
                },
                onBeforeEventRender: function(args) {                	
                    
                    args.data.barColor = args.e.statusColor;
                    var status = args.e.status;
                    
                    // customize the reservation HTML: text, start and end dates
                    args.data.html = args.data.guest + " (" + args.data.start.toString("d/M/yyyy") + " - " + args.data.end.toString("d/M/yyyy") + ")" + "<br /><span style='color:gray'>" + status + "</span>";
                    
                    // reservation tooltip that appears on hover - displays the status text
                    args.e.toolTip = String.format("{0} - {1}", args.data.guest, status);

                    // add a bar highlighting how much has been paid already (using an "active area")
                    var paid = args.e.paidAmount;
                    var paidColor = "#aaaaaa";
                    args.data.areas = [
                        { bottom: 10, right: 4, html: "<div style='color:" + paidColor + "; font-size: 8pt;'>Paid: " + paid + "%</div>", v: "Visible"},
                        { left: 4, bottom: 8, right: 4, height: 2, html: "<div style='background-color:" + paidColor + "; height: 100%; width:" + paid + "%'></div>" }
                    ];
                    
                }
	        };
		
		function getTimeline(date) {
	          var date = date || DayPilot.Date.today();
	          var start = new DayPilot.Date(date).firstDayOfMonth();
	          var days = start.daysInMonth();

	          var timeline = [];
	          
	          var checkin = 12;
	          var checkout = 12;

	          for (var i = 0; i < days; i++) {
	              var day = start.addDays(i);
	              timeline.push({start: day.addHours(checkin), end: day.addDays(1).addHours(checkout) });
	          }

	          return timeline;                    
	      }
		
		function loadEvents(day){

			var from = $scope.scheduler.visibleStart();
            var to = $scope.scheduler.visibleEnd();
            if (day) {
                from = new DayPilot.Date(day).firstDayOfMonth();
                to = from.addMonths(1);
            }

            var params = {
    			start: from.toString(),
    			end: to.toString()
    		}

            apiService.post('/web/api/booking', params,
            				function(response){            					
            		            
				            	if (day) {
				            		vm.schedulerConfig.timeline = getTimeline(day);
				            		vm.schedulerConfig.scrollTo = day;
				            		vm.schedulerConfig.scrollToAnimated = "fast";
				            		vm.schedulerConfig.scrollToPosition = "left";              
					            }

				            	angular.forEach(response.data, function(value){
				            		value.resource = value.roomId;
				            	});
				            	
								vm.events = response.data;            		            
            				}
            );                       
		}			
		
		function loadRooms(date){
			date = date || DayPilot.Date.today();
			apiService.get('/web/api/room/available', null,
						function(response){
				
							vm.schedulerConfig.resources = response.data;
							vm.schedulerConfig.visible = true;
							
							loadEvents(date);							
						}
			);				
		}
		
		this.$onInit = function(){
			$timeout(function(){
				dp = $scope.scheduler;
			});			
			
			loadRooms($stateParams.startDate);
		}
	}
	
})(angular.module('lightpro'));