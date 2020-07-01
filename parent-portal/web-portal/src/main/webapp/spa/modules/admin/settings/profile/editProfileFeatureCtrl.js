
(function (app) {
	
    'use strict';

    app.controller('editProfileFeatureCtrl', editProfileFeatureCtrl);

    editProfileFeatureCtrl.$inject = ['$stateParams', '$rootScope', '$scope', 'apiService', 'notificationService', '$q', '$confirm', '$uibModal', 'utilityService', '$timeout', '$state', '$previousState'];
    function editProfileFeatureCtrl($stateParams, $rootScope, $scope, apiService, notificationService, $q, $confirm, $uibModal, utilityService, $timeout, $state, $previousState) {
        var vm = this;

        vm.profileId = $stateParams.profileId;
        
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
        vm.moduleChanged = moduleChanged;
        vm.goPreviousPage = goPreviousPage;
		
        function goPreviousPage(){
        	$previousState.go();
        }
        
		function moduleChanged(module){
			vm.currentMenuSelected = null;
			
			loadCategories(module);
		}
		
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
            
            Save();
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
            	
            	if(menu.choosed){
            		if(!feature.choosed)
            			addFeature(feature);
            	}            		
            	else if(feature.choosed)
            		removeFeature(feature);
            });
            
            Save();
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
        	
            apiService.post(String.format('/web/api/profile/{0}/module/{1}/feature', vm.profileId, vm.moduleSelected.typeId), data,
                registerItemCompleted,
                saveItemLoadFailed);
        }

        function registerItemCompleted(response) {            
        	featuresToAdd = [];
        	featuresToDelete = [];
        }

        function saveItemLoadFailed(response) {
            
        }

        function loadFeatures(menuFeature) {
            vm.loadingFeatures = true;

            return apiService.get(String.format('/web/api/module/{0}/feature/category/{1}/child/subscribed', vm.moduleSelected.typeId, menuFeature.id), {},
                function (response) {
                    vm.loadingFeatures = false;
                    menuFeature.features = response.data;
                    
                    if(menuFeature.choosed){
        				apiService.get(String.format('/web/api/profile/{0}/module/{1}/feature/category/{2}/child', vm.profileId, vm.moduleSelected.typeId, menuFeature.id), {},
                                function (response1) {           							
                        			angular.forEach(response1.data, function(feature){
                        				var ft = utilityService.findSingle(menuFeature.features, 'id', feature.id);
                        				ft.choosed = true;
                        			});                        			                        		
                                });
        			}
                });
        }

        function loadCategories(module){
        	        	
        	vm.loadingMenuFeatures = true;
        	apiService.get(String.format('/web/api/module/{0}/feature/category/subscribed', module.typeId), {},
                    function (response) {          
        				vm.loadingMenuFeatures = false;
        				
            			vm.menuFeatures = response.data;
            			
            			if(vm.menuFeatures.length > 0){
            				apiService.get(String.format('/web/api/profile/{0}/module/{1}/feature/category', vm.profileId, module.typeId), {},
                                    function (response1) {   
            							
                            			angular.forEach(response1.data, function(feature){
                            				var ft = utilityService.findSingle(vm.menuFeatures, 'id', feature.id);
                            				ft.choosed = true;
                            			});                        			                        		
                                    });
            			}
                    });
        }
        
        vm.$onInit = function () {           

            vm.loadingData = true;

            var profilePromise = apiService.get(String.format('/web/api/profile/{0}', vm.profileId), {},
                    function (response) {                    
                        vm.profile = response.data;
                    });
            
            var modulePromise = apiService.get(String.format('/web/api/module/subscribed'), {},
                function (response) {                    
                    vm.modules = response.data;
                    
                    if(vm.modules.length > 0)
                	{
                		vm.moduleSelected = vm.modules[0];
                		loadCategories(vm.moduleSelected);
                	}
                });            
            
            $q.all([modulePromise, profilePromise]).then(function () {
                vm.loadingData = false;
            });
        }
    }
})(angular.module('lightpro'));