(function(app){
	'use strict';
	
	app.controller('editDayJobCtrl', editDayJobCtrl);
	
	editDayJobCtrl.$inject = ['data', '$uibModalInstance', 'apiService', 'notificationService'];
	function editDayJobCtrl(data, $uibModalInstance, apiService, notificationService){
		var vm = this;
		
		vm.dayJobId = data.dayJobId;
		
		vm.cancelEdit = cancelEdit;
		vm.markAbsent = markAbsent;
		vm.markPresent = markPresent;
		vm.deleteItem = deleteItem;
		
		function deleteItem(){
			apiService.remove(String.format('/web/api/maid/dayjob/{0}', vm.dayJobId), {},
					function(response){
						notificationService.displaySuccess("Le jour de travail a été supprimé avec succès !");
						$uibModalInstance.close();
					},
					function(error){
						notificationService.displayError(error);
					});
		}
		
		function markAbsent() {
			apiService.post(String.format('/web/api/maid/{0}/mark-absent', vm.dayJob.maidId), new Date(vm.dayJob.day),
					function(response){
						notificationService.displaySuccess("L'employé a été marqué absent !");
						$uibModalInstance.close(response.data);
					},
					function(error){
						notificationService.displayError(error);
					});		
		}
		
		function markPresent() {
			apiService.post(String.format('/web/api/maid/{0}/mark-present', vm.dayJob.maidId), new Date(vm.dayJob.day),
					function(response){
						notificationService.displaySuccess("L'employé a été marqué présent !");
						$uibModalInstance.close(response.data);
					},
					function(error){
						notificationService.displayError(error);
					});		
		}
		
		function cancelEdit(){
			$uibModalInstance.dismiss();
		}
		
		this.$onInit = function(){
			
			apiService.get(String.format('/web/api/maid/dayjob/{0}', vm.dayJobId), {}, 
					function(response){
						vm.dayJob = response.data;
						vm.title = String.format("{0} - {1}", vm.dayJob.maid, vm.dayJob.day);
					}
			);	
		}
	}
	
})(angular.module('lightpro'));