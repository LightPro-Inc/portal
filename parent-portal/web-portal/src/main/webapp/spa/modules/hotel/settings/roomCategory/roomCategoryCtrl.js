(function(app){
	'use strict';
	
	app.controller('roomCategoryCtrl', roomCategoryCtrl);
	
	roomCategoryCtrl.$inject = ['apiService', '$uibModal', '$confirm', 'notificationService', '$state'];	
	function roomCategoryCtrl(apiService, $uibModal, $confirm, notificationService, $state){
		var vm = this;
		
		vm.addNew = addNew;
		vm.openEditDialog = openEditDialog;
		vm.clearSearch = clearSearch;
		vm.search = search;
		vm.deleteItem = deleteItem;
		vm.showRooms = showRooms;
		
		function showRooms(item){
			$state.go('main.hotel.room', {categoryId: item.id}, {location:true});
		}
		
		function deleteItem(item){
			$confirm({ text: String.format("Souhaitez-vous supprimer la catégorie de chambre {0} ?", item.name), title: 'Supprimer une catégorie de chambre', ok: 'Oui', cancel: 'Non' })
        	.then(function () {

        		apiService.remove("/web/api/roomCategory/" + item.id, {},
    					function(response){
    						search();    						
    						notificationService.displaySuccess("La catégorie " + item.name + " a été supprimée avec succès !");
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
			 editItem(null, function(){
				 search();
			 });
		}
		
		function editItem(item, callback){

			$uibModal.open({
                templateUrl: 'modules/hotel/settings/roomCategory/editRoomCategoryView.html',
                controller: 'editRoomCategoryCtrl as vm',
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
			apiService.get('/web/api/roomCategory/search', config, 
					function(result){					
						vm.loadingData = false;
			            vm.totalCount = result.data.totalCount;
			            vm.currentPage = result.data.page;
			            
						vm.items = result.data.items;
					});
		}
		
		this.$onInit = function(){
			vm.pageSize = 4;
			
			search();			
		}
	}
	
})(angular.module('lightpro'));