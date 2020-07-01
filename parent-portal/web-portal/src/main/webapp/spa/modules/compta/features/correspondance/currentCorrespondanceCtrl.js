(function(app){
	'use strict';
	
	app.controller('currentCorrespondanceCtrl', currentCorrespondanceCtrl);
	
	currentCorrespondanceCtrl.$inject = ['apiService', '$uibModal', '$confirm', 'notificationService', '$state', '$previousState', '$stateParams', 'utilityService', '$q', '$scope'];	
	function currentCorrespondanceCtrl(apiService, $uibModal, $confirm, notificationService, $state, $previousState, $stateParams, utilityService, $q, $scope){
		var vm = this;
		
		vm.openEditDialog = openEditDialog;
		vm.search = search;	
		vm.pageChanged = pageChanged;
		vm.razTiersAccount = razTiersAccount;
		vm.searchTiersAccounts = searchTiersAccounts;
		vm.tiersTypeChanged = tiersTypeChanged;
		vm.deleteItem = deleteItem;
		vm.lettrer = lettrer;
		vm.delettrer = delettrer;
		
		function delettrer(item){
			$confirm({ text: String.format("Souhaitez-vous delettrer la correspondance ?"), title: "Delettrer une correspondance", ok: 'Oui', cancel: 'Non' })
        	.then(function () {

        		vm.loadingData = true;
        		apiService.post("/web/api/compta/reconcile/" + item.id + "/delettrer", {},
    					function(response){
        					vm.loadingData = false;
    						search();    						
    						notificationService.displaySuccess("La correspondance a été delettrée avec succès !");
    					},
    					function(error){
    						vm.loadingData = false;
    					}
    			);
        	});
		}
		
		function lettrer(item){
			$confirm({ text: String.format("Souhaitez-vous lettrer la correspondance ?"), title: "Lettrer une correspondance", ok: 'Oui', cancel: 'Non' })
        	.then(function () {

        		vm.loadingData = true;
        		apiService.post("/web/api/compta/reconcile/" + item.id + "/lettrer", {},
    					function(response){
        					vm.loadingData = false;
    						search();    						
    						notificationService.displaySuccess("La correspondance a été lettrée avec succès !");
    					},
    					function(error){
    						vm.loadingData = false;
    					}
    			);
        	});
		}
		
		function deleteItem(item){
			$confirm({ text: String.format("Souhaitez-vous supprimer la correspondance ?"), title: "Supprimer une correspondance", ok: 'Oui', cancel: 'Non' })
        	.then(function () {

        		vm.loadingData = true;
        		apiService.remove("/web/api/compta/reconcile/" + item.id, {},
    					function(response){
        			
        					vm.loadingData = false;
    						search();    						
    						notificationService.displaySuccess("La correspondance a été supprimée avec succès !");
    					},
    					function(error){
    						vm.loadingData = false;    						
    					}
    			);
        	});  	
		}
		
		function tiersTypeChanged(tiersTypeId){
			razTiersAccount();			
		}
		
		function searchTiersAccounts(){
			$uibModal.open({
                templateUrl: 'modules/compta/settings/chart/accountSearchView.html',
                controller: 'accountSearchCtrl as vm',
                size: 'lg',
                resolve: {
                    data: { tiersTypeId : vm.query.tiersTypeId }
                }
            }).result.then(function (selected) {
            	vm.query.tiersAccount = selected.name; 
            	vm.query.tiersAccountId = selected.id;
            }, function () {

            }); 
		}
		
		function razTiersAccount(){
			vm.query.tiersAccountId = undefined;
			vm.query.tiersAccount = "Aucun compte tiers";
			
			search();
		}
		
		function pageChanged(){
			search(vm.currentPage);
		}
		
		function clearSearch(){
			vm.filter = "";
			search();
		}
		
		function openEditDialog(item){
			$state.go('main.compta.edit-correspondance', {reconcileId: item.id}, {location:false});
		}
		
		function search(page){  
			
			page = page ? page : 1;

			var config = {
				params : {
		                page: page,
		                pageSize: vm.pageSize,
		                filter: "",
		                tiersTypeId: vm.query.tiersTypeId,
		                tiersAccountId: vm.query.tiersAccountId,
		                statusId: vm.query.statusId
		            }	
			};

			vm.loadingData = true;						
			apiService.get('/web/api/compta/reconcile/search', config, 
					function(result){					
						vm.loadingData = false;
						
			            vm.totalCount = result.data.totalCount;
			            vm.currentPage = result.data.page;
						vm.items = result.data.items;
					});
		}
		
		$scope.$on('reconcile', function(event, args){
			vm.query.tiersTypeId = args.query.tiersTypeId;
			vm.query.statusId = args.query.reconcileStatusId;
			
			search();
		});
		
		this.$onInit = function(){
			vm.pageSize = 1;
			
			vm.reconcileStatus = [{id:1, name: "Partielle"}, {id:2, name:"Complète"}, {id:3, name:"Lettrée"}];
			
			var tiersTypePromise = apiService.get('/web/api/compta/tiers/type', {}, 
									function(response){
										vm.tiersTypes = response.data;
									});
			
			vm.loadingDataFeature = true;
			$q.all([tiersTypePromise]).then(function(){
				vm.loadingDataFeature = false;
				
				vm.query = {tiersAccountId: null, tiersAccount: "Aucun compte tiers"};
				search();
			});			
		}
	}
	
})(angular.module('lightpro'));