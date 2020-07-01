(function(app){
	'use strict';

	app.controller('nettoyageCtrl', nettoyageCtrl);

	nettoyageCtrl.$inject = ['apiService', '$timeout', '$scope', '$compile', 'uiCalendarConfig', 'notificationService', '$uibModal'];
	function nettoyageCtrl(apiService, $timeout, $scope, $compile, uiCalendarConfig, notificationService, $uibModal) {
	    var vm = this;
	    
	    // Function
	    vm.alertEventOnClick = alertEventOnClick;	    
	    vm.alertOnDrop = alertOnDrop;	    
	    vm.alertOnResize = alertOnResize;
	    vm.eventOnDragStop = eventOnDragStop;
	    vm.eventOnReceive = eventOnReceive;
	    vm.eventOnRender = eventOnRender;
	    
	    function eventOnRender( event, element, view ) { 
	        element.attr({'uib-tooltip': event.description});
	        $compile(element)($scope);
	    };
	    
	    function eventOnReceive(event){	    	
	    	uiCalendarConfig.calendars.planningCalendar.fullCalendar('removeEvents', event._id);	    		   
	    	
	    	apiService.post(String.format('/web/api/maid/{0}/plan', event.id), event.start._d,
	    			function(response){
	    				var value = response.data;
	    				
	    				var event = {
	    			    			id: value.id,
	        						title: value.maid,
	        		                description: String.format("{0} ({1})", value.maid, value.status),
	        		                start: value.day,
	        		                end: value.day,
	        		                allDay: true,
	        		                stick: true,
	        		                color: value.statusColor
	        			    	};
	    				
	    				uiCalendarConfig.calendars.planningCalendar.fullCalendar('addEventSource', [event]);	    				
	    				notificationService.displaySuccess("Plannification effectuée avec succès !");
	    			},
	    			function(error){    				
	    				
	    			}
	    	);
	    }
	    
	    function eventOnDragStop(event, jsEvent, ui, view){
	    	uiCalendarConfig.calendars.planningCalendar.fullCalendar('refetchEvents');
	    }
	    
	    function alertOnResize(){
	    	uiCalendarConfig.calendars.planningCalendar.fullCalendar('refetchEvents');
	    }
	    
	    function alertOnDrop(){
	    	
	    }
	    
	    function alertEventOnClick(event, jsEvent, view){
	    	
	    	$uibModal.open({
                templateUrl: 'modules/hotel/gouvernance/nettoyage/editDayJobView.html',
                controller: 'editDayJobCtrl as vm',
                resolve: {
                    data: {
                    	dayJobId : event.id
                    }
                }
            }).result.then(function (itemEdited) {
            	if(itemEdited){
            		event.description = String.format("{0} ({1})", itemEdited.maid, itemEdited.status);
                	event.color = itemEdited.statusColor;
                	
                	uiCalendarConfig.calendars.planningCalendar.fullCalendar('updateEvent', event);	
            	}else {  // suppression
            		uiCalendarConfig.calendars.planningCalendar.fullCalendar('removeEvents', event.id);	    		   
            	}
            	    		   
            }, function () {

            }); 
	    }	       
	    
	    vm.uiConfig = {
	      calendar:{
	        height: 450,
	        editable: true,
	        droppable: true, // this allows things to be dropped onto the calendar
            dragRevertDuration: 0,
	        header:{
	          left: 'month basicWeek basicDay',
	          center: 'title',
	          right: 'today prev,next'
	        },
	        eventClick: vm.alertEventOnClick,
	        eventResize: vm.alertOnResize,
	        eventDragStop: vm.eventOnDragStop,
	        eventReceive: vm.eventOnReceive,
	        eventRender: eventOnRender
	      }
	    };
	    
	    vm.loadEvents = function (start, end, timezone, callback){
	    	
	    	if(uiCalendarConfig.calendars.planningCalendar)
	    		uiCalendarConfig.calendars.planningCalendar.fullCalendar('removeEvents');
	    	
	    	apiService.post('/web/api/maid/dayjob', {start:start.format(), end:end.format()},
	    			function(response){
	    				var events = [];
	    				angular.forEach(response.data, function(value){
	    					events.push({
	    			    		id: value.id,
	    						title: value.maid,
	    		                description: String.format("{0} ({1})", value.maid, value.status),
	    		                start: value.day,
	    		                end: value.day,
	    		                allDay: true,
	    		                stick: true,
	    		                color: value.statusColor
	    			    	});		    					    				
	    				});
	    				
	    				callback(events);
	    			},
	    			function(error){
	    				callback([]);
	    			}
	    	);
	    }
	    
	    this.$onInit = function(){
	    	vm.uiConfig.calendar.dayNames = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
	        vm.uiConfig.calendar.dayNamesShort = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];	    
	    	
	        vm.eventSources = [vm.loadEvents];
	    	
	    	apiService.get('/web/api/maid/active', {}, 
					function(response){					
						vm.maids = response.data;
						
						$timeout(function(){
							$('#external-events .fc-event').each(function() {

					            // store data so the calendar knows to render an event upon drop
					            $(this).data('event', {
					                id: $(this).attr('id'),
					            	title: $.trim($(this).text()), // use the element's text as the event title
					                stick: true // maintain when user navigates (see docs on the renderEvent method)
					            });

					            // make the event draggable using jQuery UI
					            $(this).draggable({
					                zIndex: 999,
					                revert: true,      // will cause the event to go back to its
					                revertDuration: 0  //  original position after the drag
					            });

					        });
						});	 
					});
	    }
	}
})(angular.module('lightpro'));