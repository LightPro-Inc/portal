(function(app){
	'use strict';
	
	app.controller('editParamCtrl', editParamCtrl);
	
	editParamCtrl.$inject = ['data', '$uibModalInstance', 'apiService', 'notificationService', '$uibModal'];
	function editParamCtrl(data, $uibModalInstance, apiService, notificationService, $uibModal){
		var vm = this;
		
		vm.params = angular.copy(data.params);

		vm.cancelEdit = cancelEdit;
		vm.saveItem = saveItem;
		
		function saveItem(){			
			$uibModalInstance.close(vm.params);
		}
		
		function cancelEdit(){
			$uibModalInstance.dismiss();
		}
		
		this.$onInit = function(){

		}		
	}
})(angular.module('lightpro'));