
(function (app) {
    'use strict';

    app.controller('unfinishedOperationCtrl', unfinishedOperationCtrl);

    unfinishedOperationCtrl.$inject = ['$rootScope', '$stateParams', '$scope', 'apiService', 'notificationService', '$q', '$confirm', '$uibModal', 'utilityService', '$state', '$previousState'];
    function unfinishedOperationCtrl($rootScope, $stateParams, $scope, apiService, notificationService, $q, $confirm, $uibModal, utilityService, $state, $previousState) {
        var vm = this;

        vm.operationTypeId = $stateParams.operationTypeId;
        vm.close = close;
        vm.modifyItem = modifyItem;
        vm.deleteItem = deleteItem;
        
        function deleteItem(item){
        	$confirm({ text: String.format("Souhaitez-vous supprimer l'opération {0} ?", item.reference), title: "Supprimer une opération", ok: 'Oui', cancel: 'Non' })
        	.then(function () {

        		apiService.remove("/web/api/operation/" + item.id, {},
    					function(response){
        				loadItems();    						
    						notificationService.displaySuccess(String.format("L'opération {0} a été supprimé avec succès !", item.reference));
    					},
    					function(error){
    						notificationService.displayError(error);
    					}
    			);
        	});  
        }

        function modifyItem(item){
        	$state.go('main.stocks.edit-operation', {operationTypeId: item.typeId, operationId: item.id});
        }
        
        function close() {
        	$state.go('main.stocks.warehouse-operation-type', {warehouseId: vm.type.warehouseId});
        }

        function loadItems(){
        	apiService.get(String.format('/web/api/operation-type/{0}/operation/unfinished', vm.operationTypeId), {},
    			    function (response) {
    			        vm.loadingData = false;
    			        vm.items = response.data;
    			    }
    			);
        }
        
        vm.$onInit = function () {
            vm.loadingData = true;

            loadItems();
            
            apiService.get(String.format('/web/api/operation-type/{0}', vm.operationTypeId), {},
    			    function (response) {
    			        vm.loadingData = false;
    			        vm.type = response.data;
    			    }
    		);
        }
    }
})(angular.module('lightpro'));