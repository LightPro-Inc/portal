(function(app){
	'use strict';
	
	app.controller('cardexCtrl', cardexCtrl);
	
	cardexCtrl.$inject = ['apiService', 'notificationService', '$state', 'contactService'];
	function cardexCtrl(apiService, notificationService, $state, contactService){
		var vm = this;
		
		vm.showBookings = showBookings;
		vm.clearSearch = clearSearch;
		vm.search = search;
		vm.editItem = editItem;
		
		function editItem(item){
			contactService.edit(item, function(personEdited){
				search(vm.currentPage);
			});
		}
		
		function showBookings(item){
			$state.go('main.hotel.cardex-guest', { guestId: item.id }, { location: false });   
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
			apiService.get('/web/api/guest/search', config, 
					function(result){					
						vm.loadingData = false;
			            vm.totalCount = result.data.totalCount;
			            vm.currentPage = result.data.page;
			            
						vm.items = result.data.items;
					}, 
					function(error){
						
					});
		}
		
		this.$onInit = function(){
			vm.pageSize = 4;
			
			search();			
		}
	}
})(angular.module('lightpro'));