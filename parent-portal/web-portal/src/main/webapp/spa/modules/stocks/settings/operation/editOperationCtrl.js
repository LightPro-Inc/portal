(function(app){
	'use strict';
	
	app.controller('editOperationCtrl', editOperationCtrl);
	
	editOperationCtrl.$inject = ['apiService', '$stateParams', 'notificationService', '$rootScope', '$state', '$previousState', '$uibModal', 'utilityService', '$timeout', '$confirm', 'contactService'];
	function editOperationCtrl(apiService, $stateParams, notificationService, $rootScope, $state, $previousState, $uibModal, utilityService, $timeout, $confirm, contactService){
		var vm = this;
		
		vm.operationTypeId = $stateParams.operationTypeId;	
		vm.operationId = $stateParams.operationId;
		
		vm.dateOptions = {
	            formatYear: 'yy',
	            startingDay: 1
	        };

	    vm.datepicker = { format: 'dd/MM/yyyy' };
		
		vm.cancel = cancel;
		vm.saveItem = saveItem;
		vm.addNew = addNew;
		vm.modifyItem = modifyItem;
		vm.deleteItem = deleteItem;
		vm.validate = validate;
		vm.execute = execute;
		vm.openDatePicker = openDatePicker;
		vm.searchPerson = searchPerson;
		vm.modifyPartner = modifyPartner;
		vm.removePartner = removePartner;
		
		function removePartner(){
			vm.item.partner = undefined;
			vm.item.partnerId = undefined;
		}
		
		function modifyPartner(partnerId){			
			apiService.get(String.format('/web/api/contact/{0}', partnerId), {}, 
					function(response){
						var partner = response.data;
						
						contactService.edit(partner, function(itemEdited){
							vm.item.partner = itemEdited.name;
						});						
					},
					function(error){
						
					}
			);			
		}
		
		function searchPerson(){
			contactService.search('all', function (person) {
            	vm.item.partnerId = person.id;
                vm.item.partner = person.name;
            });
		}
		
		function openDatePicker($event) {
            $event.preventDefault();
            $event.stopPropagation();

            vm.datepicker.opened = true;
        };
		
		function validate(){			
			$confirm({ text: String.format("Souhaitez-vous valider l'opération {0} ?", vm.item.reference), title: "Valider une opération", ok: 'Oui', cancel: 'Non' })
        	.then(function () {
        		  apiService.post(String.format('/web/api/operation/{0}/validate', vm.item.id), {},
						function(response){
							notificationService.displaySuccess("L'opération a été validée avec succès!");
							vm.$onInit();
						},
						function(error){
							
						});	        		
        	}); 	
		}
		
		function execute(){			
			$confirm({ text: String.format("Souhaitez-vous exécuter l'opération {0} ?", vm.item.reference), title: "Exécuter une opération", ok: 'Oui', cancel: 'Non' })
        	.then(function () {
        		  apiService.post(String.format('/web/api/operation/{0}/execute', vm.item.id), {},
						function(response){
							notificationService.displaySuccess("L'opération a été exécutée avec succès!");
							close();
						},
						function(error){
							
						});	        		
        	}); 	
		}
		
		function deleteItem(item){
			$confirm({ text: String.format("Souhaitez-vous supprimer la ligne de l'article {0} ?", item.article), title: "Supprimer une ligne", ok: 'Oui', cancel: 'Non' })
        	.then(function () {
        		item.deleted = true;
        	});			
		}
		
		function modifyItem(item){
			editItem(item, function(itemModified){
				$timeout(function(){
					utilityService.replace(vm.item.movements, item, itemModified, "id");
				});				
			});  
		}
		
		function addNew(){
			editItem(null, function(item){
				vm.item.movements.push(item);
			});      
		}
		
		function editItem(item, callback){
			$uibModal.open({
                templateUrl: 'modules/stocks/settings/operation/editOperationDetailView.html',
                controller: 'editOperationDetailCtrl as vm',
                resolve: {
                    data: {
                    	item : item
                    }
                }
            }).result.then(function (itemEdited) {
            	if(callback)
            		callback(itemEdited);
            }, function () {

            });
		}
		
		function registerItem(callback){
			if(vm.isNewItem){
				return apiService.post(String.format('/web/api/operation-type/{0}/operation', vm.operationTypeId), vm.item,
						function(response){
							if(callback)
								callback(response.data);
						},
						function(error){
							
						});
			}else{
				return apiService.put(String.format('/web/api/operation/{0}', vm.item.id), vm.item,
						function(response){
							if(callback)
								callback(response.data);
						},
						function(error){
							
						});
			}		
		}
		
		function saveItem() {
			registerItem(function(itemSaved){
				if(vm.isNewItem){				
					vm.operationId = itemSaved.id;
					vm.$onInit();
					notificationService.displaySuccess("L'opération a été créé avec succès!");					
				}else{
					vm.$onInit();
					notificationService.displaySuccess("La modification s'est effectuée avec succès!");					
				}
			});
		}
		
		function close(){
			$previousState.go();
		}
		
		function cancel(){
			close();
		}
		
		this.$onInit = function(){
			
			vm.isNewItem = vm.operationId ? false : true;						
			
			apiService.get(String.format('/web/api/operation-type/{0}', vm.operationTypeId), {}, 
					function(response){
						vm.type = response.data;	
						
						apiService.get(String.format('/web/api/warehouse/{0}/location/all', vm.type.warehouseId), null, 
								function(response){
									vm.locations = response.data;
								}
						);
						
						if(vm.isNewItem){							
							vm.title = "Nouvelle opération";	
							vm.item = { typeId : vm.type.id, sourceLocationId: vm.type.defaultSourceLocationId, destinationLocationId: vm.type.defaultDestinationLocationId, movements: [] };
						}else{														
							apiService.get(String.format('/web/api/operation/{0}', vm.operationId), null, 
									function(response){
										vm.item = response.data;
										vm.item.movementDate = new Date(vm.item.movementDate);
										
										vm.title = String.format("Modifier l'opération {0}", vm.item.reference);
									}
							);
						}
					}
			);	
		}
	}
	
})(angular.module('lightpro'));