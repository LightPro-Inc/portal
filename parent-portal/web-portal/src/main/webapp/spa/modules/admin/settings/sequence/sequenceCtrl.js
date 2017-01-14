(function(app){
	'use strict';
	
	app.controller('sequenceCtrl', sequenceCtrl);
	
	sequenceCtrl.$inject = ['apiService', '$uibModal', '$confirm', 'notificationService', '$state'];	
	function sequenceCtrl(apiService, $uibModal, $confirm, notificationService, $state){
		var vm = this;
		
		vm.addNew = addNew;
		vm.openEditDialog = openEditDialog;
		vm.clearSearch = clearSearch;
		vm.search = search;
		vm.deleteItem = deleteItem;		
		
		function deleteItem(item){
			$confirm({ text: String.format("Souhaitez-vous supprimer la séquence {0} ?", item.name), title: "Supprimer une séquence", ok: 'Oui', cancel: 'Non' })
        	.then(function () {

        		apiService.remove(String.format("/web/api/sequence/{0}", item.id), {},
    					function(response){
    						search();    						
    						notificationService.displaySuccess("La séquence " + item.name + " a été supprimée avec succès !");
    					},
    					function(error){
    						notificationService.displayError(error);
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
                templateUrl: 'modules/admin/settings/sequence/editSequenceView.html',
                controller: 'editSequenceCtrl as vm',
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
			apiService.get('/web/api/sequence/search', config, 
					function(result){					
						vm.loadingData = false;
			            vm.totalCount = result.data.totalCount;
			            vm.currentPage = result.data.page;
			            
						vm.items = result.data.items;
					});
		}
		
		this.$onInit = function(){
			vm.pageSize = 2;
			
			search();			
		}
	}
	
})(angular.module('lightpro'));