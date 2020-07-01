(function(app){
	'use strict';
	
	app.directive('journalComptaIndicator', journalComptaIndicator);

	journalComptaIndicator.$inject = ['$uibModal', 'apiService', '$q', 'notificationService', '$state']; 
    function journalComptaIndicator($uibModal, apiService, $q, notificationService, $state) {
        return {
            restrict: 'EA',
            templateUrl: "modules/compta/dashboard/indicators/journal/journalView.html",
            link: function (scope, element, attrs) {

        		scope.newPiece = newPiece;
        		
        		function newPiece(journal){
        			$state.go('main.compta.edit-piece', {journalId: journal.id}, {location:false});
        		}
        		        		
        		function search(page){        			            
        			scope.loadingData = true;
        			apiService.get('/web/api/compta/journal/dashboard', {}, 
        					function(result){					
        						scope.loadingData = false;        			           
        						scope.items = result.data;
        					});
        		}
        	    
        	    function init() {
        	    	search();
        	    }
        	    
        	    init();
            }
        };
    }

})(angular.module('lightpro'));