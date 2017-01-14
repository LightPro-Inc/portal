(function(app){
	'use strict';
	
	app.controller('editOperationCtrl', editOperationCtrl);
	
	editOperationCtrl.$inject = ['apiService', '$stateParams', 'notificationService', '$rootScope', '$state', '$previousState', '$uibModal', 'utilityService', '$timeout', '$confirm'];
	function editOperationCtrl(apiService, $stateParams, notificationService, $rootScope, $state, $previousState, $uibModal, utilityService, $timeout, $confirm){
		var vm = this;
		
		vm.operationTypeId = $stateParams.operationTypeId;	
		vm.operationId = $stateParams.operationId;
		
		vm.dateOptions = {
	            formatYear: 'yy',
	            startingDay: 1
	        };

	    vm.datepicker = { format: 'yyyy-MM-dd' };
		
		vm.cancel = cancel;
		vm.saveItem = saveItem;
		vm.addNew = addNew;
		vm.modifyItem = modifyItem;
		vm.deleteItem = deleteItem;
		vm.validate = validate;
		vm.openDatePicker = openDatePicker;
		
		function openDatePicker($event) {
            $event.preventDefault();
            $event.stopPropagation();

            vm.datepicker.opened = true;
        };
		
		function validate(){			
			registerItem(function(itemSaved){
				$confirm({ text: String.format("Souhaitez-vous valider l'opération {0} ?", itemSaved.reference), title: "Valider une opération", ok: 'Oui', cancel: 'Non' })
	        	.then(function () {
	        		  apiService.post(String.format('/web/api/operation/{0}/validate', itemSaved.id), {},
							function(response){
								notificationService.displaySuccess("L'opération a été validée avec succès!");
								close();
							},
							function(error){
								notificationService.displayError(error);
							});	        		
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
							notificationService.displayError(error);
						});
			}else{
				return apiService.put(String.format('/web/api/operation/{0}', vm.item.id), vm.item,
						function(response){
							if(callback)
								callback(response.data);
						},
						function(error){
							notificationService.displayError(error);
						});
			}		
		}
		
		function saveItem() {
			registerItem(function(itemSaved){
				if(vm.isNewItem){
					notificationService.displaySuccess("L'opération a été créé avec succès!");
				}else{
					notificationService.displaySuccess("La modification s'est effectuée avec succès!");					
				}
				
				close();
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