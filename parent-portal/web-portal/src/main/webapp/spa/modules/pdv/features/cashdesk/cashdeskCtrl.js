
(function (app) {
    'use strict';

    app.controller('cashdeskCtrl', cashdeskCtrl);

    cashdeskCtrl.$inject = ['$state', '$previousState' ,'$scope', '$q', '$rootScope', '$stateParams', '$timeout', '$uibModal', '$confirm', 'utilityService', 'apiService', 'notificationService', 'Guid', '$document'];
    function cashdeskCtrl($state, $previousState, $scope, $q, $rootScope, $stateParams, $timeout, $uibModal, $confirm, utilityService, apiService, notificationService, Guid, $document) {
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
        vm.changePaymentDate = changePaymentDate
        vm.selectPanelArticle = selectPanelArticle;
        vm.addNumber = addNumber;
        vm.retirerNumber = retirerNumber;
        vm.retirerArticle = retirerArticle;
        vm.btnRemClick = btnRemClick;
        vm.pay = pay;
        vm.cancelPayment = cancelPayment;
        vm.validPayment = validPayment;
        vm.totalAmountPaid = totalAmountPaid;
        vm.terminateSession = terminateSession;
        
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
  						  notificationService.displayError(error);
  					  }
  			  	);
        	});
        }
        
        function totalAmountPaid(){
        	if(!vm.ordersDone)
        		return;
        	
        	var total = 0;
        	angular.forEach(vm.ordersDone, function(order){
        		total += order.totalAmountTtc;
        	});
        	
        	return total;
        }
        
        function validPayment(order){
        	vm.payingOrder = true;
			apiService.post(String.format('/web/api/pdv/session/{0}/order/{1}', vm.sessionId, order.id), {paymentDate: order.paymentDate, orderId : order.id, paymentModeId : order.paymentModeId, montantVerse: order.montantVerse},
					  function(response){
					  	vm.payingOrder = false;	
					  	loadInitialData();
					  	notificationService.displaySuccess("Paiement de la commande réalisée avec succès!");
					  },function(error){
						  vm.payingOrder = false;
						  notificationService.displayError(error);
					  }
			  );
        }
        
        function cancelPayment() {
            if (vm.currentOrder == null)
                return;

            vm.currentOrder.doPayment = false;
            vm.currentOrder.montantVerse = 0;
            vm.currentOrder.montantRembourse = 0;
        }
        
        function pay(){
            if(vm.currentOrder == null)
                return;

            vm.currentOrder.doPayment = true;
            vm.currentOrder.montantVerse = 0;
            vm.currentOrder.montantRembourse = 0;
            vm.currentOrder.paymentModeId = 2;
            vm.currentOrder.paymentDate = new Date();
        }
        
        function btnRemClick() {
        	
            if (vm.currentOrder == null)
                return;

            if (vm.currentOrder.currentIndex == null)
                return;

            vm.btnRemEnabled = true;
            vm.btnQteEnabled = false;
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
    		});
        }
        
        function retirerNumber() {
        	
            if (vm.currentOrder == null)
                return;            

            if (vm.currentOrder.doPayment) {
                if (vm.currentOrder.montantVerse > 0) {
                    var length = vm.currentOrder.montantVerse.toString().length;
                    if (length == 1)
                        vm.currentOrder.montantVerse = 0;
                    else {
                        var number = vm.currentOrder.montantVerse.toString().slice(0, length - 1);
                        vm.currentOrder.montantVerse = parseInt(number);
                    }

                    var monnaie = vm.currentOrder.montantVerse - vm.currentOrder.totalAmountTtc;
                    if (monnaie < 0)
                        vm.currentOrder.montantRembourse = 0;
                    else
                        vm.currentOrder.montantRembourse = monnaie;
                }                
            } else {
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
                } else if (vm.btnRemEnabled) {                    
                    if (arst.reductionAmount > 0) {
                        var length = arst.reductionAmount.toString().length;
                        if (length == 1){
                        	if(arst.reductionAmount > 0)
                        		arst.reductionAmount = 0;
                        } else {
                        	var number = arst.reductionAmount.toString().slice(0, length - 1);
                            arst.reductionAmount = parseInt(number);
                        }                       	
                    }
                }

                calculateProductPrice(arst.productId, arst.quantity, arst.reductionAmount, vm.currentOrder.orderDate, function(itemCalulated){
                	arst.unitPrice = itemCalulated.unitPrice;
                	arst.totalAmountHt = itemCalulated.totalAmountHt;
                	arst.totalTaxAmount = itemCalulated.totalTaxAmount;
                	arst.totalAmountTtc = itemCalulated.totalAmountTtc;  
                	
                	vm.currentOrder.products[vm.currentOrder.currentIndex] = arst;
                	
                	saveOrder(vm.currentOrder, function(orderSaved){
                		vm.currentOrder.totalAmountHt = orderSaved.totalAmountHt;
            			vm.currentOrder.totalTaxAmount = orderSaved.totalTaxAmount;
            			vm.currentOrder.totalAmountTtc = orderSaved.totalAmountTtc;
                	});
            	});
            }            
        }
        
        function addNumber(caracter) {

            if (vm.currentOrder == null)
                return;
                        
            if (vm.currentOrder.doPayment) {
                vm.currentOrder.montantVerse = parseInt(vm.currentOrder.montantVerse + "" + caracter);
                var monnaie = vm.currentOrder.montantVerse - vm.currentOrder.totalAmountTtc;
                if (monnaie < 0)
                    vm.currentOrder.montantRembourse = 0;
                else
                    vm.currentOrder.montantRembourse = monnaie;

            } else {
                if (vm.currentOrder.currentIndex == null)
                    return;

                var arst = angular.copy(vm.currentOrder.products[vm.currentOrder.currentIndex]);

                if (vm.btnQteEnabled) {
                    
                    if (beginSelectPanelArticle) {
                        beginSelectPanelArticle = false;
                        arst.quantity = parseInt(caracter);
                    } else {
                        arst.quantity = parseInt(arst.quantity + "" + caracter);
                    }
                } else if (vm.btnRemEnabled) {

                    if (beginSelectPanelArticle)
                    {
                        beginSelectPanelArticle = false;
                        arst.reductionAmount = parseInt(caracter);
                    } else {
                        arst.reductionAmount = parseInt(arst.reductionAmount + "" + caracter);
                    }                   
                }

                calculateProductPrice(arst.productId, arst.quantity, arst.reductionAmount, vm.currentOrder.orderDate, function(itemCalulated){
                	
                	arst.unitPrice = itemCalulated.unitPrice;
                	arst.totalAmountHt = itemCalulated.totalAmountHt;
                	arst.totalTaxAmount = itemCalulated.totalTaxAmount;
                	arst.totalAmountTtc = itemCalulated.totalAmountTtc;  
                	
                	vm.currentOrder.products[vm.currentOrder.currentIndex] = arst;
                	saveOrder(vm.currentOrder, function(orderSaved){
                		vm.currentOrder.totalAmountHt = orderSaved.totalAmountHt;
            			vm.currentOrder.totalTaxAmount = orderSaved.totalTaxAmount;
            			vm.currentOrder.totalAmountTtc = orderSaved.totalAmountTtc;
                	});
            	});
            }            
        }
        
        function selectPanelArticle(index) {            
            if (index == null || index == undefined || vm.currentOrder.currentIndex == index)
                return;

            beginSelectPanelArticle = true;

            var arst = vm.currentOrder.products[index];
            vm.currentOrder.currentIndex = index;
            arst.selected = true;
            
            vm.btnQteEnabled = true;
            vm.btnRemEnabled = false;          

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
        
        function changePaymentDate(order){			
			$uibModal.open({
                templateUrl: 'main/calendar/calendarView.html',
                controller: 'calendarCtrl as vm',
                size: 'md',
                resolve: {
                    data: {
                        date: order.paymentDate
                    }
                }
            }).result.then(function (dateSelected) {            	
            	order.paymentDate = dateSelected;
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
      						  notificationService.displayError(error);
      					  }
      			  );
        		}
        	});           	
        }
        
        function openSearchCustomer(){
        	$uibModal.open({
                templateUrl: 'modules/sales/features/customer/customerSearchView.html',
                controller: 'customerSearchCtrl as vm',
                size : 'lg',
                resolve: {
                    data: {}
                }
            }).result.then(function (itemChoosed) {
            	vm.currentOrder.customer = itemChoosed.fullName;
            	vm.currentOrder.customerId = itemChoosed.id;
            	
            	saveOrder(vm.currentOrder);
            }, function () {

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
        
        function calculateProductPrice(productId, quantity, reductionAmount, orderDate, callback){
        	
        	apiService.post(String.format('/web/api/product/{0}/calculate-amount', productId), {quantity: quantity, reductionAmount: reductionAmount, orderDate : orderDate },
					  function(response){		        		
	        			if(callback)
	        				callback(response.data);
	        			
					  },function(error){
						  notificationService.displayError(error);
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
							notificationService.displayError(error);
						});
			}else{
				return apiService.put(String.format('/web/api/pdv/session/{0}/order/{1}', vm.sessionId, order.id), order,
						function(response){
							if(callback)
								callback(response.data);
						},
						function(error){
							notificationService.displayError(error);
						});
			}	
        }
        
        function addArticle(item){
        	if(!angular.isDefined(vm.currentOrder))
        		return;
        	        	
        	var panelItem = utilityService.findSingle(vm.currentOrder.products, "productId", item.id);
        	
        	var newItem = {};
        	newItem.taxesDescription = item.taxesDescription;
        	newItem.product = item.name;
        	newItem.quantity = 1;
        	newItem.reductionAmount = 0;
        	newItem.productId = item.id;
        	newItem.paymentConditionId = 0; // immédiat
        	
        	calculateProductPrice(item.id, newItem.quantity, newItem.reductionAmount, vm.currentOrder.orderDate, function(itemCalulated){
        		
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
        	        	
            var sessionPromise = apiService.get(String.format('/web/api/pdv/session/{0}', vm.sessionId), {},
                function (response) {
                    vm.currentSession = response.data; 
                    
                    apiService.get(String.format("/web/api/pdv/pdv/{0}/product-to-sale", vm.currentSession.pdvId), {},
                            function (response) {
                                vm.products = response.data;
                                
                                loadInitialData();
                            }
                        );                              
                }); 
            
            apiService.get('/web/api/company', {}, 
    				function(response){
    					$rootScope.companyCurrency = response.data.currencyShortName;
    				});
            
            apiService.get(String.format('/web/api/sales/payment/mode'), {}, 
					function(response){
						vm.paymentModes = response.data;												
					}
			);	
        }
    }
})(angular.module('lightpro'));