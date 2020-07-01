(function(app){
	'use strict';
	
	app.controller('pieceCtrl', pieceCtrl);
	
	pieceCtrl.$inject = ['apiService', '$uibModal', '$confirm', 'notificationService', '$state', '$q', '$stateParams'];	
	function pieceCtrl(apiService, $uibModal, $confirm, notificationService, $state, $q, $stateParams){
		var vm = this;
		
		vm.clearSearch = clearSearch;
		vm.search = search;	
		vm.addNew = addNew;
		vm.modifyItem = modifyItem;
		vm.deleteItem = deleteItem;
		vm.searchPieceTypes = searchPieceTypes;
		vm.razPieceType = razPieceType;
		vm.startChanged = startChanged;
		vm.endChanged = endChanged;
		vm.setExercicePeriod = setExercicePeriod;
		
		function setExercicePeriod(){
			var config = {
					params : {
			                date: vm.query.start,
			            }	
				};
			
			apiService.get('/web/api/compta/exercise', config, function(response){
				vm.query.start = response.data.start ? new Date(response.data.start) : null;
				vm.query.end = response.data.end ? new Date(response.data.end) : null;
				
				search();
			});
		}
		
		function startChanged(){
			if(vm.query.start)
				vm.query.end = vm.query.start;
			
			if(!vm.query.start)
				vm.query.end = undefined;
			
			search();
		}
		
		function endChanged(){
			if(vm.query.end && !vm.query.start)
				vm.query.start = vm.query.end;
			
			if(!vm.query.end)
				vm.query.start = undefined;
			
			search();
		}
		
		function razPieceType(){
			vm.query.pieceTypeId = undefined;
			vm.query.pieceType = undefined;
			
			search();
		}
		
		function searchPieceTypes(){
			$uibModal.open({
                templateUrl: 'modules/compta/settings/piece-type/pieceTypeSearchView.html',
                controller: 'pieceTypeSearchCtrl as vm',
                size: 'lg',
                resolve: {
                    data: { }
                }
            }).result.then(function (itemSelected) {
            	vm.query.pieceType = itemSelected.name;   
            	vm.query.pieceTypeId = itemSelected.id;
            	
            	search();
            }, function () {

            }); 
		}
		
		vm.pageChanged = function() {
			search(vm.currentPage);
		}
		
		function addNew(){
			$state.go('main.compta.edit-piece', {journalId:vm.query.journalId, typeId: vm.query.pieceTypeId}, {location:false});
		}
		
		function modifyItem(item){
			$state.go('main.compta.edit-piece', {pieceId : item.id}, {location:false});
		}
		
		function deleteItem(item){
			$confirm({ text: String.format("Souhaitez-vous supprimer la pièce de référence {0} ?", item.reference), title: "Supprimer une pièce", ok: 'Oui', cancel: 'Non' })
        	.then(function () {

        		apiService.remove(String.format("/web/api/compta/piece/{0}", item.id), {},
    					function(response){
    						search();    						
    						notificationService.displaySuccess(String.format("La pièce de référence {0} a été supprimée avec succès !", item.reference));
    					},
    					function(error){
    						
    					}
    			);
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
		                typeId: vm.query.pieceTypeId,
		                statusId: vm.query.pieceStatusId,
		                start: vm.query.start,
		                end: vm.query.end
		            }	
			};
			            
			vm.loadingData = true;
			apiService.get('/web/api/compta/piece/search', config, 
					function(result){					
						vm.loadingData = false;
			            vm.totalCount = result.data.totalCount;
			            vm.currentPage = result.data.page;
			            
						vm.items = result.data.items;
					});
		}
		
		this.$onInit = function(){
			vm.pageSize = 10;					
			
			var pieceStatusPromise = apiService.get('/web/api/compta/piece/status', {}, function(response){
										vm.pieceStatus = response.data;
									});
			
			var currentExercicePromise = apiService.get('/web/api/compta/exercise/current', {}, function(response){
										vm.currentExercice = response.data;
									});
			
			vm.loadingDataFeature = true;
			$q.all([pieceStatusPromise, currentExercicePromise]).then(function(){
				vm.loadingDataFeature = false;				
				
				vm.query = {pieceStatusId : 0, start : vm.currentExercice.start ? new Date(vm.currentExercice.start) : null, end : vm.currentExercice.end ? new Date(vm.currentExercice.end) : null };
				search();
			});					
		}
	}
	
})(angular.module('lightpro'));