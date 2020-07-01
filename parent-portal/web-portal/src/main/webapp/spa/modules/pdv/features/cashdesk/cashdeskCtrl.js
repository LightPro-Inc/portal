
(function (app) {
    'use strict';

    app.controller('cashdeskCtrl', cashdeskCtrl);

    cashdeskCtrl.$inject = ['$state', '$previousState' ,'$scope', '$q', '$rootScope', '$stateParams', '$timeout', '$uibModal', '$confirm', 'utilityService', 'apiService', 'notificationService', 'Guid', '$document', 'contactService'];
    function cashdeskCtrl($state, $previousState, $scope, $q, $rootScope, $stateParams, $timeout, $uibModal, $confirm, utilityService, apiService, notificationService, Guid, $document, contactService) {
        var vm = this;

        vm.sessionId = $stateParams.sessionId;
        var currentPosition = 0;
        var beginSelectPanelArticle = false;
        
        // Function
        vm.addNewOrder = addNewOrder;
        vm.close = close;
        vm.addArticle = addArticle;
        vm.calculateTotalAmounTtc = calculateTotalAmounTtc;
        vm.selectTabOrder = selectTabOrder;
        vm.openSearchCustomer = openSearchCustomer;
        vm.cancelOrder = cancelOrder;
        vm.changerOrderDate = changerOrderDate;
        vm.selectPanelArticle = selectPanelArticle;
        vm.addNumber = addNumber;
        vm.retirerNumber = retirerNumber;
        vm.retirerArticle = retirerArticle;
        vm.pay = pay;
        vm.terminateSession = terminateSession;
        vm.reset = reset;
        vm.clearSearch = clearSearch;
		vm.search = search;
		vm.invoice = invoice;
		
		function invoice(){
			if(vm.currentOrder == null)
                return;
            
			$confirm({ text: "Souhaitez-vous émettre une facture pour ce client ?", title: 'Emettre une facture', ok: 'Oui', cancel: 'Non' })
        	.then(function () {
        		
        		vm.invoicing = true;
    			apiService.post(String.format('/web/api/pdv/session/{0}/order/{1}/invoice', vm.sessionId, vm.currentOrder.id), {},
  					  function(response){
    				      vm.invoicing = false; 
    				      notificationService.displaySuccess("Emission de facture réalisée avec succès !");
    				      loadInitialData();					  
  					  },function(error){
  						  vm.invoicing = false;
  						  
  					  }
  			  	);
        	});
		}
		
        vm.pageChanged = function(){
			search(vm.currentPage);
		}
		
		function clearSearch(){
			vm.filter = "";
			search();
		}
		
		function search(page){
			page = page ? page : 1;

			var config = {
				params : {
		                page: page,
		                pageSize: vm.pageSize,
		                filter: vm.filter,
		                categoryId: vm.categoryId
		            }	
			};
			            
			vm.loadingDataPdToSale = true;
			apiService.get(String.format('/web/api/pdv/pdv/{0}/product-to-sale/search', vm.currentSession.pdvId), config, 
					function(result){					
						vm.loadingDataPdToSale = false;
			            vm.totalCount = result.data.totalCount;
			            vm.currentPage = result.data.page;
			            
			            vm.products = result.data.items;
					});
		}
        
        function reset(){
        	beginSelectPanelArticle = true;
        	addNumber('1');
        }
        
        function terminateSession(){
        	$confirm({ text: "Souhaitez-vous clôturer votre session ?", title: 'Clôturer session', ok: 'Oui', cancel: 'Non' })
        	.then(function () {
        		
        		vm.terminatingSession = true;
    			apiService.post(String.format('/web/api/pdv/session/{0}/terminate', vm.sessionId), {},
  					  function(response){
    				      vm.terminatingSession = false; 
    				      notificationService.displaySuccess("Clôture réalisée avec succès !");
    				      closeDirectly();						  
  					  },function(error){
  						  vm.terminatingSession = false;
  						  
  					  }
  			  	);
        	});
        }
        
        function pay(order){
            if(!order)
                return;
            
            $uibModal.open({
                templateUrl: 'modules/pdv/features/cashdesk/payOrderView.html',
                controller: 'payOrderCtrl as vm',
                size: 'md',
                resolve: {
                    data: {
                    	sessionId: vm.sessionId,
                        orderId: order.id
                    }
                }
            }).result.then(function (payment) {
            	loadInitialData();
            }, function () {
            });
        }
        
        function retirerArticle() {
        	
            if (vm.currentOrder == null)
                return;

            if (vm.currentOrder.currentIndex == null)
                return;

            vm.currentOrder.products[vm.currentOrder.currentIndex].deleted = true;
            saveOrder(vm.currentOrder, function(orderSaved){
            	vm.currentOrder.totalAmountHt = orderSaved.totalAmountHt;
    			vm.currentOrder.totalTaxAmount = orderSaved.totalTaxAmount;
    			vm.currentOrder.totalAmountTtc = orderSaved.totalAmountTtc;
    			vm.currentOrder.products = orderSaved.products;
    			notificationService.displaySuccess("L'article a été supprimé avec succès !");
    			
    			vm.refresh();
    		});
        }
        
        function retirerNumber() {
        	
            if (vm.currentOrder == null)
                return;            

            if (vm.currentOrder.currentIndex == null)
                return;

            var arst = angular.copy(vm.currentOrder.products[vm.currentOrder.currentIndex]);

            if (vm.btnQteEnabled) {
                if (arst.quantity > 0) {
                    var length = arst.quantity.toString().length;
                    if (length == 1){
                    	if(arst.quantity > 1)
                    		arst.quantity = 1;
                    	else if(arst.quantity == 1)
                    		arst.quantity = 0;
                    }                            
                    else {
                        var number = arst.quantity.toString().slice(0, length - 1);
                        arst.quantity = parseInt(number);
                    }
                }
            }

            calculateProductPrice(arst.productId, arst.quantity, arst.reductionAmount, vm.currentOrder.orderDate, arst.taxes, function(itemCalulated){
            	arst.unitPrice = itemCalulated.unitPrice;
            	arst.totalAmountHt = itemCalulated.totalAmountHt;
            	arst.totalTaxAmount = itemCalulated.totalTaxAmount;
            	arst.totalAmountTtc = itemCalulated.totalAmountTtc;  
            	arst.reduceAmount = itemCalulated.reduceAmount;
            	arst.taxesDescription = itemCalulated.taxesDescription;
            	
            	vm.currentOrder.products[vm.currentOrder.currentIndex] = arst;
            	
            	saveOrder(vm.currentOrder, function(orderSaved){
            		vm.currentOrder.totalAmountHt = orderSaved.totalAmountHt;
        			vm.currentOrder.totalTaxAmount = orderSaved.totalTaxAmount;
        			vm.currentOrder.totalAmountTtc = orderSaved.totalAmountTtc;
            	});
        	});        
        }
        
        function incrementArticleQte(arst, number){
            arst.quantity += number;

            calculateProductPrice(arst.productId, arst.quantity, arst.reductionAmount, vm.currentOrder.orderDate, arst.taxes, function(itemCalulated){
            	
            	arst.unitPrice = itemCalulated.unitPrice;
            	arst.totalAmountHt = itemCalulated.totalAmountHt;
            	arst.totalTaxAmount = itemCalulated.totalTaxAmount;
            	arst.totalAmountTtc = itemCalulated.totalAmountTtc;
            	arst.reduceAmount = itemCalulated.reduceAmount;
            	arst.taxesDescription = itemCalulated.taxesDescription;
            	
            	vm.currentOrder.products[vm.currentOrder.currentIndex] = arst;
            	saveOrder(vm.currentOrder, function(orderSaved){
            		vm.currentOrder.totalAmountHt = orderSaved.totalAmountHt;
        			vm.currentOrder.totalTaxAmount = orderSaved.totalTaxAmount;
        			vm.currentOrder.totalAmountTtc = orderSaved.totalAmountTtc;
            	});
        	});
        }
        
        function addNumber(caracter) {

            if (vm.currentOrder == null)
                return;
                        
            if (vm.currentOrder.currentIndex == null)
                return;

            var arst = angular.copy(vm.currentOrder.products[vm.currentOrder.currentIndex]);

            if (vm.btnQteEnabled) {
                
                if (beginSelectPanelArticle) {
                    beginSelectPanelArticle = false;
                    if(parseInt(caracter) == 0 && arst.quantity > 0)
                    	arst.quantity = parseInt(arst.quantity + "" + caracter);
                    else
                    	arst.quantity = parseInt(caracter);
                } else {
                    arst.quantity = parseInt(arst.quantity + "" + caracter);
                }
            }

            calculateProductPrice(arst.productId, arst.quantity, arst.reductionAmount, vm.currentOrder.orderDate, arst.taxes, function(itemCalulated){
            	
            	arst.unitPrice = itemCalulated.unitPrice;
            	arst.totalAmountHt = itemCalulated.totalAmountHt;
            	arst.totalTaxAmount = itemCalulated.totalTaxAmount;
            	arst.totalAmountTtc = itemCalulated.totalAmountTtc;
            	arst.reduceAmount = itemCalulated.reduceAmount;
            	arst.taxesDescription = itemCalulated.taxesDescription;
            	
            	vm.currentOrder.products[vm.currentOrder.currentIndex] = arst;
            	saveOrder(vm.currentOrder, function(orderSaved){
            		vm.currentOrder.totalAmountHt = orderSaved.totalAmountHt;
        			vm.currentOrder.totalTaxAmount = orderSaved.totalTaxAmount;
        			vm.currentOrder.totalAmountTtc = orderSaved.totalAmountTtc;
            	});
        	});            
        }
        
        function selectPanelArticle(index) {            
            if (index == null || index == undefined || vm.currentOrder.currentIndex == index)
                return;

            beginSelectPanelArticle = true;

            var arst = vm.currentOrder.products[index];
            vm.currentOrder.currentIndex = index;
            arst.selected = true;
            
            vm.btnQteEnabled = true;          

            angular.forEach(vm.currentOrder.products, function (value) {
                if (arst.id != value.id)
                    value.selected = false;
            });
        }
        
        function changerOrderDate(order){			
			$uibModal.open({
                templateUrl: 'main/calendar/calendarView.html',
                controller: 'calendarCtrl as vm',
                size: 'md',
                resolve: {
                    data: {
                        date: order.orderDate
                    }
                }
            }).result.then(function (dateSelected) {
            	
            	var orderToSave = angular.copy(order);
            	orderToSave.orderDate = dateSelected;
            	orderToSave.expirationDate = dateSelected;
            	
            	saveOrder(orderToSave, function(orderSaved){
            		$timeout(function(){
            			order.orderDate = orderSaved.orderDate;
                    	order.expirationDate = orderSaved.expirationDate;
                    	vm.currentOrder.totalAmountHt = orderSaved.totalAmountHt;
            			vm.currentOrder.totalTaxAmount = orderSaved.totalTaxAmount;
            			vm.currentOrder.totalAmountTtc = orderSaved.totalAmountTtc;
                		order.products = orderSaved.products;
            		})            		
            	})
            }, function () {
            });
		}        
        
        function removeOrderFromList(order){
        	utilityService.remove(vm.orders, "orderPosition", order.orderPosition);
			
    		if(vm.orders.length == 0)
    			addNewOrder();
    		else
    			selectTabOrder(vm.orders[0]); 
        }
        
        function cancelOrder(order){
        	$confirm({ text: "Souhaitez-vous annuler la commande en cours ?", title: 'Annuler une commande', ok: 'Oui', cancel: 'Non' })
        	.then(function () {
        		
        		if(!order.id) {           
        			removeOrderFromList(order);           		
        		}else {
        			vm.cancelingOrder = true;
        			apiService.remove(String.format('/web/api/pdv/session/{0}/order/{1}', vm.sessionId, order.id), {},
      					  function(response){
        				      vm.cancelingOrder = false;
        				      removeOrderFromList(order);
    						  notificationService.displaySuccess("Annulation de la commande réalisée avec succès!");
      					  },function(error){
      						  vm.cancelingOrder = false;
      						  
      					  }
      			  );
        		}
        	});           	
        }
        
        function openSearchCustomer(){
        	contactService.search('all', function(itemChoosed){
        		vm.currentOrder.customer = itemChoosed.name;
            	vm.currentOrder.customerId = itemChoosed.id;
            	
            	saveOrder(vm.currentOrder);
        	});
        }
        
        function calculateTotalAmounTtc(order){
        	if(!order)
        		return;
        	
        	var total = 0;
        	angular.forEach(order.products, function(value){
        		total+=value.totalAmountTtc;
        	});
        	
        	return total;
        }
        
        function calculateProductPrice(productId, quantity, reductionAmount, orderDate, taxes, callback){
        	
        	apiService.post(String.format('/web/api/product/{0}/calculate-amount', productId), {quantity: quantity, reductionAmount: reductionAmount, orderDate : orderDate, taxes: taxes },
					  function(response){		        		
	        			if(callback)
	        				callback(response.data);
	        			
					  },function(error){
						  
					  }
			  );
        }
        
        function saveOrder(order, callback){
        	
        	if(!angular.isDefined(order.id)){
				
				return apiService.post(String.format('/web/api/pdv/session/{0}/order', vm.sessionId), order,
						function(response){
					
						  	if(callback)
						  		callback(response.data);
						},
						function(error){							
							
						});
			}else{
				return apiService.put(String.format('/web/api/pdv/session/{0}/order/{1}', vm.sessionId, order.id), order,
						function(response){
							if(callback)
								callback(response.data);
						},
						function(error){
							
						});
			}	
        }
        
        function addArticle(item){
        	if(!angular.isDefined(vm.currentOrder))
        		return;
        	        	
        	var panelItem = utilityService.findSingle(vm.currentOrder.products, "productId", item.id);
        	
        	if(panelItem){
        		incrementArticleQte(panelItem, 1);
        		return;
        	}
        	
        	var newItem = {};
        	newItem.taxesDescription = item.taxesDescription;
        	newItem.product = item.name;
        	newItem.quantity = 1;
        	newItem.reductionAmount = 0;
        	newItem.productId = item.id;
        	newItem.paymentConditionId = 0; // immédiat
        	
        	apiService.get(String.format('/web/api/product/{0}/tax', item.id), {}, 
					function(response){
						newItem.taxes = response.data;	
						
						calculateProductPrice(item.id, newItem.quantity, newItem.reductionAmount, vm.currentOrder.orderDate, newItem.taxes, function(itemCalulated){
			        		
							newItem.unitPrice = itemCalulated.unitPrice;
			        		var order = angular.copy(vm.currentOrder);
			        		order.products.push(newItem);
			        		
			        		saveOrder(order, function(orderSaved){
			        			vm.currentOrder.id = orderSaved.id; 
			        			vm.currentOrder.reference = orderSaved.reference;
			        			vm.currentOrder.totalAmountHt = orderSaved.totalAmountHt;
			        			vm.currentOrder.totalTaxAmount = orderSaved.totalTaxAmount;
			        			vm.currentOrder.totalAmountTtc = orderSaved.totalAmountTtc;
			        			vm.currentOrder.products = orderSaved.products;
			        		});
			        	});
					});        	        	
        }
        
        function close(){
        	$confirm({ text: "Etes-vous sûr de fermer cette session ?", title: 'Fermer la caisse', ok: 'Oui', cancel: 'Non' })
        	.then(function () {
        		closeDirectly();
        	});        	
        }
        
        function closeDirectly(){
        	$state.go('main.pdv.pdv-settings');
        }

        function loadInitialData() {        	
        	vm.modeSelected = {typeId: undefined};
        	apiService.get(String.format('/web/api/pdv/session/{0}/order/done', vm.sessionId), {},
                    function (response) {
                        vm.ordersDone = response.data;
                        currentPosition = vm.ordersDone.length;
                        
                        apiService.get(String.format('/web/api/pdv/session/{0}/order/in-progress', vm.sessionId), {},
                                function (response) {
                                    vm.orders = response.data;                                    
                                    
                                    if (vm.orders.length == 0)
                                        addNewOrder();
                                    else {
                                    	
                                    	angular.forEach(vm.orders, function(order){
                                    		currentPosition += 1;
                                    		order.orderPosition = currentPosition;
                                    	});

                                    	if(vm.currentOrder){
                                    		var order = utilityService.findSingle(vm.orders, 'orderPosition', vm.currentOrder.orderPosition);
                                    		selectTabOrder(order);
                                    	}else{
                                    		 selectTabOrder(vm.orders[0]);
                                    	}
                                    }
                                });
                    });
        	
        	apiService.get(String.format('/web/api/pdv/session/{0}/turnover', vm.sessionId), {},
        			function(response){
        				vm.totalAmountPaid = response.data.turnover;
	        		}
	        	);
        }

        vm.refresh = function () {
            loadInitialData();
        }
        
        function selectTabOrder(order) {
            vm.currentOrder = order;
        }

        function addNewOrder() {
            currentPosition += 1;
            var newOrder = { products : [], orderDate: moment(new Date()).format('YYYY-MM-DD'), expirationDate : moment(new Date()).format("YYYY-MM-DD"), sellerId: vm.currentSession.cashierId, orderPosition: currentPosition};
            vm.orders.push(newOrder);

            selectTabOrder(newOrder);                       
        }

        vm.$onInit = function () {            
        	vm.orders = [];
        	vm.pageSize = 12;  
        	
            var sessionPromise = apiService.get(String.format('/web/api/pdv/session/{0}', vm.sessionId), {},
                function (response) {
                    vm.currentSession = response.data; 
                    
                    loadInitialData();
                    
                    apiService.get(String.format('/web/api/pdv/pdv/{0}/product-category-to-sale', vm.currentSession.pdvId), {}, 
        					function(result){					
        			            vm.categories = result.data;
        					});
                    
                    search();
                }); 
        }
    }
})(angular.module('lightpro'));