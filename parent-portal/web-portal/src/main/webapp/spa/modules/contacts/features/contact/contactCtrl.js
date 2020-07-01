(function(app){
	'use strict';
	
	app.controller('contactCtrl', contactCtrl);
	
	contactCtrl.$inject = ['apiService', '$uibModal', '$confirm', 'notificationService', '$state'];	
	function contactCtrl(apiService, $uibModal, $confirm, notificationService, $state){
		var vm = this;
		
		vm.addNew = addNew;
		vm.openEditDialog = openEditDialog;
		vm.clearSearch = clearSearch;
		vm.search = search;
		vm.deleteItem = deleteItem;
		
		function deleteItem(item){
			$confirm({ text: String.format("Souhaitez-vous supprimer le contact {0} ?", item.name), title: 'Supprimer un contact', ok: 'Oui', cancel: 'Non' })
        	.then(function () {

        		apiService.remove("/web/api/contact/" + item.id, {},
    					function(response){
    						search();    						
    						notificationService.displaySuccess("Le contact " + item.name + " a été supprimé avec succès !");
    					},
    					function(error){
    						
    					}
    			);
        	});  	
		}
		
		function openEditDialog(item){
			editItem({natureId: item.natureId, id: item.id}, function(){
				 search(vm.currentPage);
			 });
		}
		
		function addNew(natureId){
			 editItem({natureId: natureId, id: null}, function(){
				 search();
			 });
		}
		
		function editItem(param, callback){

			if(!param.natureId)
				return;
			
			var templateUrl, controller;
			
			switch(param.natureId){
			case 1:
				templateUrl = 'modules/contacts/features/contact/editContactPersonView.html';
				controller = 'editContactPersonCtrl as vm';
				break;
			case 2:
				templateUrl = 'modules/contacts/features/contact/editContactSocietyView.html';
				controller = 'editContactSocietyCtrl as vm';
				break;
			}
			
			$uibModal.open({
                templateUrl: templateUrl,
                controller: controller,
                size: "lg",
                resolve: {
                    data: {
                    	id : param.id
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
			apiService.get('/web/api/contact/search', config, 
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