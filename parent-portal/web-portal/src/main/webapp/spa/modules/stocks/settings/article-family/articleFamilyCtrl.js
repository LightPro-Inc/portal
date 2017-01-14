(function(app){
	'use strict';
	
	app.controller('articleFamilyCtrl', articleFamilyCtrl);
	
	articleFamilyCtrl.$inject = ['apiService', '$uibModal', '$confirm', 'notificationService', '$stateParams', '$state', '$rootScope', '$previousState'];
	function articleFamilyCtrl(apiService, $uibModal, $confirm, notificationService, $stateParams, $state, $rootScope, $previousState){
		var vm = this;
		
		vm.categoryId = $stateParams.categoryId;
		
		vm.addNew = addNew;
		vm.openEditDialog = openEditDialog;
		vm.clearSearch = clearSearch;
		vm.search = search;
		vm.deleteItem = deleteItem;		
		vm.goPreviousPage = goPreviousPage;
		vm.showArticles = showArticles;
		
		function showArticles(item){
			$state.go('main.stocks.article', {familyId: item.id});
		}
		
		function deleteItem(item){
			$confirm({ text: String.format("Souhaitez-vous supprimer la famille d'article {0} ?", item.name), title: "Supprimer une famille d'article", ok: 'Oui', cancel: 'Non' })
        	.then(function () {

        		apiService.remove("/web/api/article-family/" + item.id, {},
    					function(response){
    						search();    						
    						notificationService.displaySuccess(String.format("La famille d'article {0} a été supprimée avec succès !", item.name));
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
			 editItem({categoryId : vm.categoryId }, function(){
				 search();
			 });
		}
		
		function editItem(item, callback){

			$uibModal.open({
                templateUrl: 'modules/stocks/settings/article-family/editArticleFamilyView.html',
                controller: 'editArticleFamilyCtrl as vm',
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
				apiService.get('/web/api/article-category/' + vm.categoryId + '/family', config, 
						function(result){					
							vm.loadingData = false;
							vm.items = result.data;
						},
						function(error){
							vm.loadingData = true;						
						});
			}else{
				apiService.get('/web/api/article-family/search', config, 
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
				apiService.get('/web/api/article-category/' + vm.categoryId, null, 
						function(response){
							vm.category = response.data;
						}
				);
			}			
		}
	}
	
})(angular.module('lightpro'));