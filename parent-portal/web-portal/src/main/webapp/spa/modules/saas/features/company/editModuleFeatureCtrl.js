
(function (app) {
	
    'use strict';

    app.controller('editModuleFeatureCtrl', editModuleFeatureCtrl);

    editModuleFeatureCtrl.$inject = ['data', '$rootScope', '$uibModalInstance', '$scope', 'apiService', 'notificationService', '$q', '$confirm', '$uibModal', 'utilityService', '$timeout', '$state'];
    function editModuleFeatureCtrl(data, $rootScope, $uibModalInstance,  $scope, apiService, notificationService, $q, $confirm, $uibModal, utilityService, $timeout, $state) {
        var vm = this;

        vm.companyId = data.companyId;
        vm.moduleTypeId = data.moduleTypeId;
        
        vm.currentMenuSelected = null;
        var featuresToAdd = [];
        var featuresToDelete = [];

        // Function
        vm.Save = Save;
        vm.cancelEdit = cancelEdit;
        vm.selectMenuFeature = selectMenuFeature;        
        vm.chooseMenu = chooseMenu;        
        vm.selectFeature = selectFeature;
        vm.chooseFeature = chooseFeature;

        function chooseFeature(feature) {
            if (!vm.currentMenuSelected)
                return;

            if (!feature.choosed) {
                removeFeature(feature);

                if (allFeaturesUnchecked(vm.currentMenuSelected.features))
                    removeFeature(vm.currentMenuSelected);
            } else {
                addFeature(feature);

                if (!vm.currentMenuSelected.choosed)
                    addFeature(vm.currentMenuSelected);
            }
        }

        function selectFeature(item) {
        	item.selected = true;
        	unselectOthersFeatures(vm.currentMenuSelected.features, item);
        }

        function allFeaturesUnchecked(features) {
            var allAreUncheck = true;
            angular.forEach(features, function (value) {
                if (value.choosed)
                    allAreUncheck = false;
            });

            return allAreUncheck;
        }
        
        function unselectOthersFeatures(features, item){
        	angular.forEach(features, function (value) {
                if (item.id != value.id)
                    value.selected = false;
            });
        }

        function removeFeature(feature) {
            feature.choosed = false;
            featuresToDelete.push(feature);            
            utilityService.remove(featuresToAdd, 'id', feature);
        }

        function addFeature(feature) {
            feature.choosed = true;
            featuresToAdd.push(feature);
            utilityService.remove(featuresToDelete, 'id', feature);
        }

        function chooseMenu(menu) {
            if (!menu.choosed) {
                removeFeature(menu);
            } else {
                addFeature(menu);
            }  
            
            angular.forEach(menu.features, function(feature){
            	
            	if(menu.choosed)
            		addFeature(feature);
            	else
            		removeFeature(feature);
            });
        }

        function selectMenuFeature(item) {
        	
            $timeout(function () {
                item.selected = true;
                unselectOthersFeatures(vm.menuFeatures, item);
                
                if (!item.features)
                    loadFeatures(item).then(function () {
                        vm.currentMenuSelected = item;
                    });
                else {
            		vm.currentMenuSelected = item;            		
                }
            }, 0);
        }

        function close(){
        	$uibModalInstance.close();
        }
        
        function cancelEdit() {
        	$uibModalInstance.dismiss();
        }

        function Save() {
            
        	var data = {
        		featuresToAdd : [],
        		featuresToDelete : []
            }

        	angular.forEach(featuresToAdd, function(feature){
        		data.featuresToAdd.push(feature.id);
        	});
        	
        	angular.forEach(featuresToDelete, function(feature){
        		data.featuresToDelete.push(feature.id);
        	});
        	
            apiService.post(String.format('/web/api/saas/company/{0}/module/{1}/feature/subscribe', vm.companyId, vm.moduleTypeId), data,
                registerItemCompleted,
                saveItemLoadFailed);
        }

        function registerItemCompleted(response) {
            notificationService.displaySuccess("Fonctionnalités configurées avec succès !");
            close();
        }

        function saveItemLoadFailed(response) {
            
        }

        function loadFeatures(menuFeature) {
            vm.loadingFeatures = true;

            return apiService.get(String.format('/web/api/saas/company/{0}/module/{1}/feature/category/{2}/child/proposed', vm.companyId, vm.moduleTypeId, menuFeature.id), {},
                function (response) {
                    vm.loadingFeatures = false;
                    menuFeature.features = response.data;
                    
                    if(menuFeature.choosed){
                    	if(menuFeature.features.length > 0){
            				apiService.get(String.format('/web/api/saas/company/{0}/module/{1}/feature/category/{2}/child/subscribed', vm.companyId, vm.moduleTypeId, menuFeature.id), {},
                                    function (response1) {           							
                            			angular.forEach(response1.data, function(feature){
                            				var ft = utilityService.findSingle(menuFeature.features, 'id', feature.id);
                            				ft.choosed = true;
                            			});                        			                        		
                                    });
            			}
                    }                    
                });
        }

        vm.$onInit = function () {           

            vm.loadingData = true;

            var modulePromise = apiService.get(String.format('/web/api/saas/company/{0}/module/subscribed/{1}', vm.companyId, vm.moduleTypeId), {},
                function (response) {                    
                    vm.module = response.data;
                });

            var categoryPromise = apiService.get(String.format('/web/api/saas/company/{0}/module/{1}/feature/category/proposed', vm.companyId, vm.moduleTypeId), {},
                    function (response) {                    
            			vm.menuFeatures = response.data;
            			
            			if(vm.menuFeatures.length > 0){
            				apiService.get(String.format('/web/api/saas/company/{0}/module/{1}/feature/category/subscribed', vm.companyId, vm.moduleTypeId), {},
                                    function (response1) {   
            							
                            			angular.forEach(response1.data, function(feature){
                            				var ft = utilityService.findSingle(vm.menuFeatures, 'id', feature.id);
                            				ft.choosed = true;
                            			});                        			                        		
                                    });
            			}
                    });
            
            $q.all([modulePromise, categoryPromise]).then(function () {
                vm.loadingData = false;
            });
        }
    }
})(angular.module('lightpro'));