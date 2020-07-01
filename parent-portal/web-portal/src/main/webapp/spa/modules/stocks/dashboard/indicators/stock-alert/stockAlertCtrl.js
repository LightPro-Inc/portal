(function(app){
    'use strict';

    app.directive('stockAlertStocksIndicator', stockAlertStocksIndicator);

    stockAlertStocksIndicator.$inject = ['$uibModal', 'apiService', '$q', 'notificationService']; 
    function stockAlertStocksIndicator($uibModal, apiService, $q, notificationService) {
        return {
            restrict: 'EA',
            templateUrl: "modules/stocks/dashboard/indicators/stock-alert/stockAlertView.html",
            link: function (scope, element, attrs) {

            	scope.getStockColor = getStockColor;
        		scope.warehouseChanged = warehouseChanged;
        		
        		function warehouseChanged(warehouseId){
        			apiService.get(String.format('/web/api/warehouse/{0}/stock', warehouseId), {}, 
        					function(response){						
        						scope.stocks = response.data;
        					}
        			);
        		}
        		
        		function getStockColor(stockLocation) {
        	        switch (stockLocation.alertId) {
        	            case 3:
        	                return 'red'; // minimum atteint
        	            case 2:
        	                return 'orangered'; // sécurité atteint
        	            case 1:
        	                return 'greenyellow'; // maximum atteint
        	            default:
        	                return 'green'; // aucune alerte
        	        }
        	    }
        		
        		apiService.get(String.format('/web/api/warehouse'), {}, 
    					function(response){
    						scope.warehouses = response.data;	
    						
    						if(scope.warehouses.length > 0)
    						{
    							scope.warehouseId = scope.warehouses[0].id;
    							warehouseChanged(scope.warehouseId);
    						}
    					}
    			);	
            }
        };
    }

})(angular.module('common.core'));