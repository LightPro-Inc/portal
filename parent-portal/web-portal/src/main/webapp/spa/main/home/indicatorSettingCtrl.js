(function(app){
	'use strict';
	
	app.controller('indicatorSettingCtrl', indicatorSettingCtrl);
	
	indicatorSettingCtrl.$inject = ['data', 'apiService', '$uibModalInstance', 'utilityService'];
	function indicatorSettingCtrl(data, apiService, $uibModalInstance, utilityService){
		var vm = this;
		
        vm.close = close;
        vm.selectItem = selectItem;        
        vm.moduleChanged = moduleChanged;
        
        function moduleChanged(module){
        	loadIndicators(module);
        }
        
        function selectItem(item) {
        	item.choosed = !item.choosed;
        	
        	if(item.choosed)
        	{
        		apiService.post(String.format('/web/api/dashboard-tool/indicator/{0}', item.id), {},
	        			function(response){	        			
		        	}
	        	);
        	}else{
        		apiService.remove(String.format('/web/api/dashboard-tool/indicator/{0}', item.id), {},
	        			function(response){	        			
		        	}
	        	);
        	}
        }

        function close() {
        	$uibModalInstance.close();
        }
        
		function loadIndicators(module){
			apiService.get(String.format('/web/api/module/{0}/indicator', module.typeId), {}, 
					function(response){						
						vm.items = response.data;
						
						apiService.get(String.format('/web/api/module/general-indicator'), {}, 
								function(response1){						
									vm.itemsSelected = response1.data;
									
									angular.forEach(vm.items, function(indicator){
										var itemSelected = utilityService.findSingle(vm.itemsSelected, 'id', indicator.id);
										if(itemSelected)
											indicator.choosed = true;
									});								
								}
						);
					}
			);				
		}
		
		function loadModules(){
			apiService.get(String.format('/web/api/module/used'), {}, 
					function(response){
						vm.modules = response.data;
						
						if(vm.modules.length > 0)
						{
							vm.moduleSelected = vm.modules[0];
							moduleChanged(vm.moduleSelected);
						}
					}
			);					
		}
		
		this.$onInit = function(){
			loadModules();		
		}
	}
	
})(angular.module('lightpro'));