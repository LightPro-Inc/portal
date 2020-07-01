(function(app){
	'use strict';
	
	app.controller('editInvoiceProductCtrl', editInvoiceProductCtrl);
	
	editInvoiceProductCtrl.$inject = ['data', '$uibModalInstance', 'apiService', 'notificationService', 'utilityService', 'Guid', '$scope', '$timeout', '$uibModal'];
	function editInvoiceProductCtrl(data, $uibModalInstance, apiService, notificationService, utilityService, Guid, $scope, $timeout, $uibModal){
		var vm = this;		
		
		vm.cancelEdit = cancelEdit;
		vm.saveItem = saveItem;
		vm.productChanged = productChanged;				
		vm.searchProduct = searchProduct;
		
		function searchProduct(){
			$uibModal.open({
                templateUrl: 'modules/sales/settings/product/productSearchView.html',
                controller: 'productSearchCtrl as vm',
                size: 'lg',
                resolve: {
                    data: { }
                }
            }).result.then(function (itemSelected) {
            	productChanged(itemSelected);
            }, function () {

            });
		}
		
		function productChanged(product){
			if(product){
								
				apiService.get(String.format('/web/api/product/{0}/tax', product.id), {}, 
						function(response){
							vm.item.productId = product.id;
							vm.item.product = product.name;				
							vm.item.name = product.name;
							vm.item.category = product.category;
							vm.item.description = product.description;
							vm.item.pricingModeId = product.pricingModeId;
							vm.item.pricingMode = product.pricingMode;
							vm.item.taxes = response.data;						
						});
			}else
			{				
				vm.item.name = undefined;				
				vm.item.productId = undefined;
				vm.item.product = undefined;
				vm.item.category = undefined;
				vm.item.description = undefined;
				vm.item.pricingModeId = undefined;
				vm.item.pricingMode = undefined;
				vm.item.taxes = [];
			}			
		}
		
		function saveItem(){				
			
			if(vm.isNewItem){									
				return apiService.post(String.format('/web/api/invoice/{0}/product', vm.orderId), vm.item,
						function(response){						
							notificationService.displaySuccess("L'article a été ajouté avec succès !");
							$uibModalInstance.close(response.data);
						},
						function(error){							
							
						});
			}else{
				return apiService.put(String.format('/web/api/invoice/{0}/product/{1}', vm.orderId, vm.item.id), vm.item,
						function(response){
							notificationService.displaySuccess("L'article a été modifié avec succès !");
							$uibModalInstance.close(response.data);
						},
						function(error){
							
						});
			}		
		}
		
		function cancelEdit(){
			$uibModalInstance.dismiss();
		}		
		
		this.$onInit = function(){

			var isFirstCall = true;
			
			vm.isNewItem = data.item ? false : true;
			vm.item = angular.copy(data.item);
			vm.orderDate = data.orderDate;
			vm.orderId = data.orderId;
			
			if(vm.isNewItem){
				vm.item = {id:Guid.newGuid(), reduceAmount:0, unitPrice : 0, quantity: 1, totalTaxAmount: 0, totalAmountHt: 0, totalAmountTtc: 0, taxes: []};
				vm.title = "Ajouter une ligne de produit";
				vm.btnSaveLabel = "Créer";					
			}else{
				vm.title = "Modifier une ligne de produit";
				vm.btnSaveLabel = "Modifier";
			}		
			
			apiService.get('/web/api/tax', {}, 
					function(response){
						vm.taxes = response.data;		
					});
						
			$scope.$watchGroup(['vm.item.quantity', 'vm.item.productId', 'vm.item.taxes.length', 'vm.item.unitPrice'], function(newValues, oldValues, scope) {
				  
				  if(!vm.isNewItem && isFirstCall){
					  isFirstCall = false;
					  return;
				  }
				  
				  isFirstCall = false;
				  
				  if(vm.loadingCalculAmount)
					  return;
				  
				  var quantity = newValues[0];
				  var productId = newValues[1];
				  var unitPrice = newValues[3];		  
				  
				  if(productId){
					  
					  var config = {
							  quantity:quantity, 
							  orderDate: vm.orderDate, 
							  unitPrice: unitPrice, 
							  taxes: vm.item.taxes
					  };
				  
				  	  vm.loadingCalculAmount = true;
					  apiService.post(String.format('/web/api/product/{0}/calculate-amount', productId), config,
							  function(response){
						  			vm.item.unitPrice = response.data.unitPrice;
						  			vm.item.reduceAmount = response.data.reduceAmount;
						  			vm.item.totalAmountHt = response.data.totalAmountHt;
						  			vm.item.netCommercial = response.data.netCommercial;
						  			vm.item.totalTaxAmount = response.data.totalTaxAmount;
						  			vm.item.totalAmountTtc = response.data.totalAmountTtc;
						  			
						  			$timeout(function(){						  				
							  			vm.loadingCalculAmount = false;
						  			}, 500);
												  			
							  },function(error){
								  
							  }
					  );					  
				  }else{
					  	vm.item.unitPrice = 0;
			  			vm.item.reduceAmount = 0;
			  			vm.item.totalAmountHt = 0;
			  			vm.item.netCommercial = 0;
			  			vm.item.totalTaxAmount = 0;
			  			vm.item.totalAmountTtc = 0;
				  }
			});
		}
	}
	
})(angular.module('lightpro'));