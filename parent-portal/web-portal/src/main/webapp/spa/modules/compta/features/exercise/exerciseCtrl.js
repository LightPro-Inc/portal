(function(app){
	'use strict';
	
	app.controller('exerciseCtrl', exerciseCtrl);
	
	exerciseCtrl.$inject = ['apiService', '$uibModal', '$confirm', 'notificationService', '$state', '$previousState'];	
	function exerciseCtrl(apiService, $uibModal, $confirm, notificationService, $state, $previousState){
		var vm = this;
		
		vm.openNextExo = openNextExo;
		vm.openExo = openExo;
		vm.openEditDialog = openEditDialog;
		vm.search = search;
		vm.deleteItem = deleteItem;		
		vm.closeExo = closeExo;
		
		function closeExo(item){
			$confirm({ text: String.format("Souhaitez-vous clôturer l'exercice ?"), title: "Clôturer un exercice", ok: 'Oui', cancel: 'Non' })
        	.then(function () {

        		apiService.post(String.format('/web/api/compta/exercise/{0}/close', item.id), {},
    					function(response){
    						notificationService.displaySuccess("L'exercice a été clôturé avec succès !");
    						search();
    					},
    					function(error){
    						
    					});
        	});
		}
		
		function deleteItem(item){
			$confirm({ text: String.format("Souhaitez-vous supprimer l'exercice ?"), title: "Supprimer un exercice", ok: 'Oui', cancel: 'Non' })
        	.then(function () {

        		apiService.remove("/web/api/compta/exercise/" + item.id, {},
    					function(response){
    						search();    						
    						notificationService.displaySuccess("L'exercice a été supprimé avec succès !");
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
		
		function openNextExo(){
			$confirm({ text: String.format("Souhaitez-vous ouvrir l'exercice suivant ?"), title: "Ouvrir l'exercice suivant", ok: 'Oui', cancel: 'Non' })
        	.then(function () {

        		apiService.post('/web/api/compta/exercise/open-next', {},
    					function(response){
    						notificationService.displaySuccess("L'exercice suivant a été ouvert avec succès!");
    						search();
    					},
    					function(error){
    						
    					});
        	});			
		}
		
		function openExo(){
			 editItem(null, function(){
				 search();
			 });
		}
		
		function editItem(item, callback){

			$uibModal.open({
                templateUrl: 'modules/compta/features/exercise/editExerciseView.html',
                controller: 'editExerciseCtrl as vm',
                size:'sm',
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
			apiService.get('/web/api/compta/exercise/search', config, 
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