(function(app){
	'use strict';
	
	app.controller('articleCategoryCtrl', articleCategoryCtrl);
	
	articleCategoryCtrl.$inject = ['apiService', '$uibModal', '$confirm', 'notificationService', '$state', '$previousState'];	
	function articleCategoryCtrl(apiService, $uibModal, $confirm, notificationService, $state, $previousState){
		var vm = this;
		
		vm.addNew = addNew;
		vm.openEditDialog = openEditDialog;
		vm.clearSearch = clearSearch;
		vm.search = search;
		vm.deleteItem = deleteItem;		
		vm.showFamilies = showFamilies;
		
		function showFamilies(item){		
			$state.go('main.stocks.article-family', {categoryId: item.id});
		}
		
		function deleteItem(item){
			$confirm({ text: String.format("Souhaitez-vous supprimer la catégorie d'article {0} ?", item.name), title: "Supprimer une catégorie d'article", ok: 'Oui', cancel: 'Non' })
        	.then(function () {

        		apiService.remove("/web/api/article-category/" + item.id, {},
    					function(response){
    						search();    						
    						notificationService.displaySuccess("La catégorie d'article " + item.name + " a été supprimée avec succès !");
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
                templateUrl: 'modules/stocks/settings/article-category/editArticleCategoryView.html',
                controller: 'editArticleCategoryCtrl as vm',
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
			apiService.get('/web/api/article-category/search', config, 
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