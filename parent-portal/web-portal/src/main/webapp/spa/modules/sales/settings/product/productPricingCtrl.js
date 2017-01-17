(function(app){
	'use strict';
	
	app.controller('productPricingCtrl', productPricingCtrl);
	
	productPricingCtrl.$inject = ['apiService', '$uibModal', '$confirm', 'notificationService', '$state', '$stateParams', '$rootScope', '$previousState', '$timeout', 'Guid'];	
	function productPricingCtrl(apiService, $uibModal, $confirm, notificationService, $state, $stateParams, $rootScope, $previousState, $timeout, Guid){
		var vm = this;
		
		vm.productId = $stateParams.productId;
	
		vm.goPreviousPage = goPreviousPage;
		vm.addNewInterval = addNewInterval;		
		vm.deleteInterval = deleteInterval;
		vm.setFixMode = setFixMode;
		vm.setTrancheMode = setTrancheMode;
		vm.saveItem = saveItem;
		vm.cancelEdit = cancelEdit;
		
		function cancelEdit(){
			goPreviousPage();
		}
		
		function saveItem(){
			apiService.post(String.format('/web/api/product/{0}/pricing', vm.productId), vm.item,
					function(response){
						notificationService.displaySuccess("La tarification a été modifiée avec succès!");
						goPreviousPage();
					},
					function(error){
						notificationService.displayError(error);
					});
		}
		
		function setTrancheMode(){
			
			if(vm.contentToEnable == 'tranche')
			{
				$timeout(function(){
					vm.item.fixPrice = 0;
					vm.item.modeId = vm.trancheModes[0].id;
				})				
			}
		}

		function setFixMode(){
			
			if(vm.contentToEnable == 'fix')
			{
				angular.forEach(vm.item.intervals, function(value){
					value.deleted = true;
				})

				vm.item.modeId = 1;
			}
		}

		function deleteInterval(item){
			item.deleted = true;
		}
		
		function addNewInterval(modeId) {
			vm.item.intervals.push({id:Guid.newGuid(), priceTypeId: vm.priceTypes[0].id});
		}
		
		function goPreviousPage(){
			$previousState.go();
		}
		
		this.$onInit = function(){			
			vm.loadingData = true;
			
			apiService.get(String.format('/web/api/product/pricing-mode/tranche'), {}, 
					function(response){					
						vm.loadingData = false;

						vm.trancheModes = response.data;						
					});
			
			apiService.get(String.format('/web/api/product/{0}/pricing', vm.productId), {}, 
					function(response){					
						vm.loadingData = false;

						vm.item = response.data;
						vm.contentToEnable = vm.item.modeId == 1 ? 'fix' : 'tranche';
					});
			
			apiService.get(String.format('/web/api/product/price-type'), {}, 
					function(response){					
						vm.loadingData = false;

						vm.priceTypes = response.data;
					});			
			
			apiService.get(String.format('/web/api/product/{0}', vm.productId), {}, 
					function(response){					
						vm.loadingData = false;

						vm.product = response.data;
					});			
		}
	}
	
})(angular.module('lightpro'));