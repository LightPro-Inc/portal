(function(app){
	'use strict';
	
	app.controller('chartCtrl', chartCtrl);
	
	chartCtrl.$inject = ['apiService', '$uibModal', '$confirm', 'notificationService', '$state'];	
	function chartCtrl(apiService, $uibModal, $confirm, notificationService, $state){
		var vm = this;
		
		vm.clearSearch = clearSearch;
		vm.search = search;	
		vm.addNew = addNew;
		vm.modifyItem = modifyItem;
		vm.deleteItem = deleteItem;
		
		vm.pageChanged = function() {
			search(vm.currentPage);
		}
		
		function addNew(){
			editItem(null, function(itemAdded){
				search();
			});
		}
		
		function modifyItem(item){
			editItem(item, function(itemModified){
				search(vm.currentPage);
			});
		}
		
		function deleteItem(item){
			$confirm({ text: String.format("Souhaitez-vous supprimer le compte {0} ?", item.code), title: "Supprimer un compte", ok: 'Oui', cancel: 'Non' })
        	.then(function () {

        		apiService.remove(String.format("/web/api/compta/account/{0}", item.id), {},
    					function(response){
    						search();    						
    						notificationService.displaySuccess(String.format("Le compte {0} a été supprimé avec succès !", item.code));
    					},
    					function(error){
    						
    					}
    			);
        	});  	
		}
		
		function editItem(item, callback){
			$uibModal.open({
                templateUrl: 'modules/compta/settings/chart/editAccountView.html',
                controller: 'editAccountCtrl as vm',
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
		                filter: vm.filter,
		                typeId: vm.typeId
		            }	
			};
			            
			vm.loadingData = true;
			apiService.get('/web/api/compta/chart/active/account/search', config, 
					function(result){					
						vm.loadingData = false;
			            vm.totalCount = result.data.totalCount;
			            vm.currentPage = result.data.page;
			            
						vm.items = result.data.items;
					});
		}
		
		this.$onInit = function(){
			vm.pageSize = 10;
			
			apiService.get('/web/api/compta/chart/active', {}, 
					function(result){					
			            vm.chart = result.data;
					});
			
			apiService.get('/web/api/compta/account/type', null, 
					function(response){
						vm.types = response.data;
						vm.typeId = vm.types[0].id;
					}
			);
			
			search();			
		}
	}
	
})(angular.module('lightpro'));