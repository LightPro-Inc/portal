(function(app){
	'use strict';
	
	app.controller('enterpriseCtrl', enterpriseCtrl);
	
	enterpriseCtrl.$inject = ['apiService', 'notificationService', '$rootScope', '$timeout', '$uibModal'];
	function enterpriseCtrl(apiService, notificationService, $rootScope, $timeout, $uibModal){
		var vm = this;
		
		vm.Save = save;
		vm.searchCurrency = searchCurrency;
        
        function searchCurrency(){
			$uibModal.open({
                templateUrl: 'modules/saas/features/currency/currencySearchView.html',
                controller: 'currencySearchCtrl as vm',
                size: 'lg',
                resolve: {
                    data: { }
                }
            }).result.then(function (itemSelected) {
            	vm.company.currency = itemSelected.name;   
            	vm.company.currencyId = itemSelected.id;
            }, function () {

            }); 
		}
        
		function save(){
			apiService.put('/web/api/company', vm.company, 
					function(response){
						$rootScope.company = vm.company;
						notificationService.displaySuccess("La mise à jour a été effectuée avec succès !");
						
						apiService.get('/web/api/currency/' + $rootScope.company.currencyId, {}, 
								function(response1){
									$rootScope.companyCurrency = response1.data;																								
								}, function(error){
									
								});
					}, function(error){
						
					});
		}
		
		this.$onInit = function(){
			apiService.get('/web/api/company', null, 
					function(response){
						vm.company = response.data;
					});	
		}
	}
	
})(angular.module('lightpro'));