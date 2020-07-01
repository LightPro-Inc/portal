(function(app){
	'use strict';
	
	app.controller('articleCtrl', articleCtrl);
	
	articleCtrl.$inject = ['apiService', '$uibModal', '$confirm', 'notificationService', '$stateParams', '$state', '$rootScope', '$previousState'];
	function articleCtrl(apiService, $uibModal, $confirm, notificationService, $stateParams, $state, $rootScope, $previousState){
		var vm = this;
		
		vm.familyId = $stateParams.familyId;
		
		vm.addNew = addNew;
		vm.openEditDialog = openEditDialog;
		vm.clearSearch = clearSearch;
		vm.search = search;
		vm.deleteItem = deleteItem;		
		vm.goPreviousPage = goPreviousPage;
		vm.showPlannings = showPlannings;
		
		function showPlannings(item){
			$state.go('main.stocks.article-planning', {articleId: item.id}, {location:false});
		}
		
		function deleteItem(item){
			$confirm({ text: String.format("Souhaitez-vous supprimer l'article {0} ?", item.name), title: "Supprimer un article", ok: 'Oui', cancel: 'Non' })
        	.then(function () {

        		apiService.remove("/web/api/article/" + item.id, {},
    					function(response){
    						search();    						
    						notificationService.displaySuccess(String.format("L'article {0} a été supprimé avec succès !", item.name));
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
			 editItem({familyId : vm.familyId, cost : 0 }, function(){
				 search();
			 });
		}
		
		function editItem(item, callback){

			$uibModal.open({
                templateUrl: 'modules/stocks/settings/article/editArticleView.html',
                controller: 'editArticleCtrl as vm',
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
			
			if(vm.familyId){
				apiService.get('/web/api/article-family/' + vm.familyId + '/article', config, 
						function(result){					
							vm.loadingData = false;
							vm.items = result.data;
						},
						function(error){
							vm.loadingData = true;						
						});
			}else{
				apiService.get('/web/api/article/search', config, 
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
			
			apiService.get('/web/api/article-family', {}, 
					function(response){
						vm.families = response.data;
					}
			);	
		}
	}
	
})(angular.module('lightpro'));