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
		/*vm.setFixMode = setFixMode;
		vm.setTrancheMode = setTrancheMode;*/
		vm.saveItem = saveItem;
		vm.cancelEdit = cancelEdit;
		vm.setModeChanged = setModeChanged;
		
		function setModeChanged(contentToEnable){

			switch(contentToEnable){
			case 'known_in_saling':
				angular.forEach(vm.item.intervals, function(value){
					value.deleted = true;
				});
				
				$timeout(function(){
					vm.item.fixPrice = 0;
					vm.item.modeId = 4;
				});
				break;
			case 'tranche':
				$timeout(function(){
					vm.item.fixPrice = 0;
					vm.item.modeId = vm.trancheModes[0].id;
				});
				break;
			case 'fix':
				angular.forEach(vm.item.intervals, function(value){
					value.deleted = true;
				})

				vm.item.modeId = 1;
				break;
			}
		}
		
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
						
					});
		}
		
		function deleteInterval(item){
			item.deleted = true;
		}
		
		function addNewInterval(modeId) {
			vm.item.intervals.push({id:Guid.newGuid(), priceTypeId: vm.priceTypes[0].id, taxNotApplied: false});
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
						
						switch(vm.item.modeId){
							case 1:
								vm.contentToEnable = 'fix';
								break;
							case 2:
							case 3:
								vm.contentToEnable = 'tranche';
								break;
							case 4:
								vm.contentToEnable = 'known_in_saling';
								break;
						}						
					});
			
			apiService.get(String.format('/web/api/product/price-type'), {}, 
					function(response){					
						vm.loadingData = false;

						vm.priceTypes = response.data;
					});			
			
			apiService.get(String.format('/web/api/product/reduce-amount/value-type'), {}, 
					function(response){					
						vm.loadingData = false;

						vm.reduceValueTypes = response.data;
					});	
			
			apiService.get(String.format('/web/api/product/{0}', vm.productId), {}, 
					function(response){					
						vm.loadingData = false;

						vm.product = response.data;
					});			
		}
	}
	
})(angular.module('lightpro'));