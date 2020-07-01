/**
 * 
 */

(function(app){
	'use strict';
	
	app.controller('roomCtrl', roomCtrl);
	
	roomCtrl.$inject = ['apiService', '$uibModal', '$confirm', 'notificationService', '$stateParams', '$state', '$rootScope', '$previousState'];
	function roomCtrl(apiService, $uibModal, $confirm, notificationService, $stateParams, $state, $rootScope, $previousState){
		var vm = this;
		
		vm.categoryId = $stateParams.categoryId;
		
		vm.addNew = addNew;
		vm.openEditDialog = openEditDialog;
		vm.clearSearch = clearSearch;
		vm.search = search;
		vm.deleteItem = deleteItem;		
		vm.goPreviousPage = goPreviousPage;
		
		function deleteItem(item){
			$confirm({ text: String.format("Souhaitez-vous supprimer la chambre N° {0} ?", item.number), title: 'Supprimer une chambre', ok: 'Oui', cancel: 'Non' })
        	.then(function () {

        		apiService.remove("/web/api/room/" + item.id, {},
    					function(response){
    						search();    						
    						notificationService.displaySuccess("La chambre N° " + item.number + " a été supprimée avec succès !");
    					},
    					function(error){
    						
    					}
    			);
        	});  	
		}
		
		function openEditDialog(item){
			editItem(item, function(){
				 search(vm.currentPage);
			 });
		}
		
		function addNew(){
			 editItem({categoryId : vm.categoryId }, function(){
				 search();
			 });
		}
		
		function editItem(item, callback){

			$uibModal.open({
                templateUrl: 'modules/hotel/settings/room/editRoomView.html',
                controller: 'editRoomCtrl as vm',
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
		
		vm.pageChanged = function(){
			search(vm.currentPage);
		}
		
		function clearSearch(){
			vm.filter = "";
			search();
		}
		
		function search(page){
			page = page ? page : 1;

			var config = {
				params : {
		                page: page,
		                pageSize: vm.pageSize,
		                filter: vm.filter
		            }	
			};
			            
			vm.loadingData = true;
			
			if(vm.categoryId){
				apiService.get('/web/api/roomCategory/' + vm.categoryId + '/room/search', config, 
						function(result){					
							vm.loadingData = false;
				            vm.totalCount = result.data.totalCount;
				            vm.currentPage = result.data.page;
				            
							vm.items = result.data.items;
						},
						function(error){
							vm.loadingData = true;						
						});
			}else{
				apiService.get('/web/api/room/search', config, 
						function(result){					
							vm.loadingData = false;
				            vm.totalCount = result.data.totalCount;
				            vm.currentPage = result.data.page;
				            
							vm.items = result.data.items;
						},
						function(error){
							vm.loadingData = true;						
						});
			}
			
		}
		
		function goPreviousPage(){
			$previousState.go();
		}
		
		this.$onInit = function(){
			vm.pageSize = 4;
			
			search();	
			
			if(vm.categoryId){
				apiService.get('/web/api/roomCategory/' + vm.categoryId, null, 
						function(response){
							vm.roomCategory = response.data;
						}
				);
			}			
		}
	}
	
})(angular.module('lightpro'));