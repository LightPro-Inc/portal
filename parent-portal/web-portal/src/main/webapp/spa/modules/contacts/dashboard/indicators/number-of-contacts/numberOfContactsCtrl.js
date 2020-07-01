(function(app){
    'use strict';

    app.directive('numberOfContactsAdminIndicator', numberOfContactsAdminIndicator);

    numberOfContactsAdminIndicator.$inject = ['$uibModal', 'apiService', '$q', 'notificationService']; 
    function numberOfContactsAdminIndicator($uibModal, apiService, $q, notificationService) {
        return {
            restrict: 'EA',
            templateUrl: "modules/contacts/dashboard/indicators/number-of-contacts/numberOfContactsView.html",
            link: function (scope, element, attrs) {
            	
        	    function init() {
        	    	var config = {
        					params : {
        			                page: 1,
        			                pageSize: 5,
        			                filter: ''
        			            }	
        				};
        	    	
        	    	scope.loadingData = true;
        			apiService.get('/web/api/contact/search', config, 
        					function(result){					
        						scope.loadingData = false;
        			            scope.totalCount = result.data.totalCount;
        					});
        	    }
        	    
        	    init();
            }
        };
    }

})(angular.module('common.core'));