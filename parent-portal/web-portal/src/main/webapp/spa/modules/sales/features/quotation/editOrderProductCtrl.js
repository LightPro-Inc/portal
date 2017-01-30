(function(app){
	'use strict';
	
	app.controller('editOrderProductCtrl', editOrderProductCtrl);
	
	editOrderProductCtrl.$inject = ['data', '$uibModalInstance', 'apiService', 'notificationService', 'utilityService', 'Guid', '$scope'];
	function editOrderProductCtrl(data, $uibModalInstance, apiService, notificationService, utilityService, Guid, $scope){
		var vm = this;
		
		vm.isNewItem = data.item ? false : true;
		vm.item = angular.copy(data.item);
		
		vm.cancelEdit = cancelEdit;
		vm.saveItem = saveItem;
		vm.productChanged = productChanged;		
		
		function productChanged(productId){
			var product = utilityService.findSingle(vm.products, 'id', productId);
			vm.item.product = product.name;
			vm.item.taxesDescription = product.taxesDescription;
		}
		
		function saveItem(){		
			$uibModalInstance.close(vm.item);			
		}
		
		function cancelEdit(){
			$uibModalInstance.dismiss();
		}		
		
		this.$onInit = function(){

			var isFirstCall = true;
			
			if(vm.isNewItem){
				vm.item = {id:Guid.newGuid(), reductionAmount:0, unitPrice : 0, quantity: 1, totalTaxAmount: 0, totalAmountHt: 0, totalAmountTtc: 0};
				vm.title = "Ajouter une ligne de produit";
				vm.btnSaveLabel = "Créer";					
			}else{
				vm.title = "Modifier une ligne de produit";
				vm.btnSaveLabel = "Modifier";
			}	
			
			apiService.get(String.format('/web/api/product'), {}, 
					function(response){
						vm.products = response.data;												
					}
			);	
			
			$scope.$watchGroup(['vm.item.quantity', 'vm.item.reductionAmount', 'vm.item.productId'], function(newValues, oldValues, scope) {
				  
				  if(!vm.isNewItem && isFirstCall){
					  isFirstCall = false;
					  return;
				  }
				  
				  isFirstCall = false;
				  
				  var quantity = newValues[0];
				  var reductionAmount = newValues[1];
				  var productId = newValues[2];
				  
				  if(productId){
					  apiService.post(String.format('/web/api/product/{0}/calculate-amount', productId), {quantity:quantity, reductionAmount:reductionAmount, orderDate: data.orderDate},
							  function(response){
						  			vm.item.unitPrice = response.data.unitPrice;
						  			vm.item.unitPriceApplied = response.data.unitPriceApplied;
						  			vm.item.totalAmountHt = response.data.totalAmountHt;
						  			vm.item.totalTaxAmount = response.data.totalTaxAmount;
						  			vm.item.totalAmountTtc = response.data.totalAmountTtc;
							  },function(error){
								  notificationService.displayError(error);
							  }
					  );
				  }
			});
		}
	}
	
})(angular.module('lightpro'));