
(function (app) {
    'use strict';

    app.controller('articlePlanningCtrl', articlePlanningCtrl);

    articlePlanningCtrl.$inject = ['$rootScope', '$stateParams', '$scope', 'apiService', 'notificationService', '$q', '$confirm', '$uibModal', 'utilityService', '$state', '$previousState'];
    function articlePlanningCtrl($rootScope, $stateParams, $scope, apiService, notificationService, $q, $confirm, $uibModal, utilityService, $state, $previousState) {
        var vm = this;

        vm.articleId = $stateParams.articleId;
        vm.cancel = cancel;
        vm.save = save;

        function save(plannings) {
            apiService.post(String.format('/web/api/article/{0}/planning', vm.articleId), plannings,
                saveItemCompleted,
                saveItemLoadFailed);
        }

        function saveItemCompleted(response) {
            notificationService.displaySuccess('Mise à jour effecutée avec succès!');
            close();
        }

        function saveItemLoadFailed(error) {
            
        }

        function close() {
        	$previousState.go();
        }

        function cancel() {
            close();
        }

        vm.$onInit = function () {
            vm.loadingData = true;

            apiService.get(String.format('/web/api/article/{0}/planning', vm.articleId), {},
			    function (response) {
			        vm.loadingData = false;
			        vm.plannings = response.data;
			    }
			);
            
            apiService.get(String.format('/web/api/article/{0}', vm.articleId), {},
    			    function (response) {
    			        vm.loadingData = false;
    			        vm.article = response.data;
    			    }
    		);
        }
    }
})(angular.module('lightpro'));