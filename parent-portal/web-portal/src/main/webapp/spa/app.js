if (!String.format) {
  String.format = function(format) {
    var args = Array.prototype.slice.call(arguments, 1);
    return format.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number] 
        : match
      ;
    });
  };
}

(function(){
	'use strict';
	
	angular.module('lightpro',['common.core', 'common.ui'])
		   .config(config)
		   .run(run);
	
	config.$inject = ['$stateProvider', '$urlRouterProvider', '$httpProvider', '$provide', 'localStorageServiceProvider'];
	function config($stateProvider, $urlRouterProvider, $httpProvider, $provide, localStorageServiceProvider){

		localStorageServiceProvider.setPrefix("lightpro");
		
		$provide.decorator('$uibModal', function ($delegate) {
            var open = $delegate.open;

            $delegate.open = function (options) { // avoid closing by backdrop click
                options = angular.extend(options || {}, {
                    backdrop: 'static',
                    keyboard: false
                });

                return open(options);
            };
            return $delegate;
        });
		
		 $urlRouterProvider.otherwise('/login');
		
		 $stateProvider
         .state('login', {
             url:'/login',
             templateUrl: 'main/login/loginView.html',
             controller: 'loginCtrl as vm'                
         })
         .state('main', {
                abstract: true,
                url:'/main',
                views: {
                    '' : {
                        templateUrl: 'main/mainView.html',
                        controller: 'mainCtrl as vm'
                    },                    
                    'toolbar@main' : {
                        templateUrl: 'main/top-bar/topBarView.html',
                        controller: 'topBarCtrl as vm'
                    }
                }            
            })
            .state('main.dashboard', {
                url:'/dashboard',
                templateUrl: 'main/home/homeView.html',
                controller: 'homeCtrl as vm',
                requireAuthenticated: true
            })
            .state('main.about', {
                url:'/about',
                templateUrl: 'main/about/aboutView.html',
                controller: 'aboutCtrl as vm',
                requireAuthenticated: true
            })
            .state('main.settings', {
                abstract: true,
                url:'/settings',
                views: {
                    '' : {
                        templateUrl: 'modules/admin/settings/settingsView.html',      
                        controller: 'settingsCtrl as vm'                  
                    },                    
                    'sideBarSetting@main.settings' : {
                        templateUrl: 'modules/admin/settings/side-bar/sideBarView.html',
                        controller: 'settingsSideBarCtrl as vm'
                    }
                }            
            })
            .state('main.settings.enterprise', {
                url:'/enterprise',
                templateUrl: 'modules/admin/settings/enterprise/enterpriseView.html',
                controller: 'enterpriseCtrl as vm',
                requireAuthenticated: true
            })
            .state('main.settings.module', {
                url:'/module',
                templateUrl: 'modules/admin/settings/module/moduleView.html',
                controller: 'moduleCtrl as vm',
                requireAuthenticated: true
            })
            .state('main.settings.sequence', {
                url:'/sequence',
                templateUrl: 'modules/admin/settings/sequence/sequenceView.html',
                controller: 'sequenceCtrl as vm',
                requireAuthenticated: true
            })
            .state('main.settings.mesure-unit', {
	            url: '/mesure-unit',
	            templateUrl: 'modules/admin/settings/mesure-unit/mesureUnitView.html',
	            controller: 'mesureUnitCtrl as vm',
	            requireAuthenticated: true
	        })
	        .state('main.settings.tax', {
	            url: '/tax',
	            templateUrl: 'modules/admin/settings/tax/taxView.html',
	            controller: 'taxCtrl as vm',
	            requireAuthenticated: true
	        })
            .state('main.hotel', {
                abstract: true,
                url:'/hotel',
                views: {
                    '' : {
                        templateUrl: 'modules/hotel/hotelView.html',      
                        controller: 'hotelCtrl as vm'                  
                    },                    
                    'sideBarHotel@main.hotel' : {
                        templateUrl: 'modules/hotel/side-bar/sideBarView.html',
                        controller: 'hotelSideBarCtrl as vm'
                    }
                }            
            })
            .state('main.hotel.dashboard', {
	            url: '/dashboard',
	            templateUrl: 'modules/hotel/dashboard/dashboardView.html',
	            controller: 'hotelDashboardCtrl as vm',
	            requireAuthenticated: true
	        })
            .state('main.hotel.planning', {
                url:'/planning',
                params:{
                	startDate: null
                },
                templateUrl: 'modules/hotel/reception/planning/planningView.html',
                controller: 'planningCtrl as vm',
                requireAuthenticated: true
            })
            .state('main.hotel.day-occupation', {
                url:'/day-occupation',
                templateUrl: 'modules/hotel/reception/day-occupation/dayOccupationView.html',
                controller: 'dayOccupationCtrl as vm',
                requireAuthenticated: true
            })
            .state('main.hotel.booking', {
	            url: '/booking/{bookingId}',
	            templateUrl: 'modules/hotel/reception/planning/editBookView.html',
	            controller: 'editBookCtrl as vm',
	            requireAuthenticated: true
	        })
	        .state('main.hotel.booking-history', {
	            url: '/booking-history',
	            templateUrl: 'modules/hotel/reception/booking-history/bookingHistoryView.html',
	            controller: 'bookingHistoryCtrl as vm',
	            requireAuthenticated: true
	        })
	        .state('main.hotel.cardex', {
	            url: '/cardex',
	            templateUrl: 'modules/hotel/reception/cardex/cardexView.html',
	            controller: 'cardexCtrl as vm',
	            requireAuthenticated: true
	        })
	        .state('main.hotel.cardex-guest', {
	            url: '/cardex-guest/{guestId}',
	            templateUrl: 'modules/hotel/reception/cardex/guestCardexView.html',
	            controller: 'guestCardexCtrl as vm',
	            requireAuthenticated: true
	        })
	        .state('main.hotel.nettoyage', {
	            url: '/nettoyage',
	            templateUrl: 'modules/hotel/gouvernance/nettoyage/nettoyageView.html',
	            controller: 'nettoyageCtrl as vm',
	            requireAuthenticated: true
	        })	 
	        .state('main.hotel.maid', {
	            url: '/maid',
	            templateUrl: 'modules/hotel/gouvernance/maid/maidView.html',
	            controller: 'maidCtrl as vm',
	            requireAuthenticated: true
	        })	
	        .state('main.hotel.roomcategory', {
                url:'/roomcategory',
                templateUrl: 'modules/hotel/settings/roomCategory/roomCategoryView.html',
                controller: 'roomCategoryCtrl as vm',
                requireAuthenticated: true
            })
            .state('main.hotel.room', {
                url:'/room/{categoryId}',
                templateUrl: 'modules/hotel/settings/room/roomView.html',
                controller: 'roomCtrl as vm',
                requireAuthenticated: true
            })
            .state('main.hotel.room-status', {
                url:'/room-status',
                templateUrl: 'modules/hotel/gouvernance/room-status/roomStatusView.html',
                controller: 'roomStatusCtrl as vm',
                requireAuthenticated: true
            })
            .state('main.stocks', {
                abstract: true,
                url:'/stocks',
                views: {
                    '' : {
                        templateUrl: 'modules/stocks/stocksView.html',      
                        controller: 'stocksCtrl as vm'                  
                    },                    
                    'sideBarStocks@main.stocks' : {
                        templateUrl: 'modules/stocks/side-bar/sideBarView.html',
                        controller: 'stocksSideBarCtrl as vm'
                    }
                }            
            })
            .state('main.stocks.dashboard', {
	            url: '/dashboard',
	            templateUrl: 'modules/stocks/dashboard/dashboardView.html',
	            controller: 'stocksDashboardCtrl as vm',
	            requireAuthenticated: true
	        })	        
	        .state('main.stocks.article-family', {
	            url: '/article-family/{categoryId}',
	            templateUrl: 'modules/stocks/settings/article-family/articleFamilyView.html',
	            controller: 'articleFamilyCtrl as vm',
	            requireAuthenticated: true
	        })
	        .state('main.stocks.article-category', {
	            url: '/article-category',	            
	            templateUrl: 'modules/stocks/settings/article-category/articleCategoryView.html',
	            controller: 'articleCategoryCtrl as vm',
	            requireAuthenticated: true
	        })
	        .state('main.stocks.article', {
	            url: '/article/{familyId}',
	            templateUrl: 'modules/stocks/settings/article/articleView.html',
	            controller: 'articleCtrl as vm',
	            requireAuthenticated: true
	        })
	        .state('main.stocks.warehouse', {
	            url: '/warehouse',
	            templateUrl: 'modules/stocks/settings/warehouse/warehouseView.html',
	            controller: 'warehouseCtrl as vm',
	            requireAuthenticated: true
	        })
	        .state('main.stocks.warehouse-location', {
	            url: '/location/{warehouseId}',
	            templateUrl: 'modules/stocks/settings/warehouse/locationView.html',
	            controller: 'locationCtrl as vm',
	            requireAuthenticated: true
	        })
	        .state('main.stocks.warehouse-operation-type', {
	            url: '/operation-type/{warehouseId}',
	            templateUrl: 'modules/stocks/settings/operation-type/operationTypeView.html',
	            controller: 'operationTypeCtrl as vm',
	            requireAuthenticated: true
	        })
	        .state('main.stocks.article-planning', {
	            url: '/article-planning/{articleId}',
	            templateUrl: 'modules/stocks/settings/article/articlePlanningView.html',
	            controller: 'articlePlanningCtrl as vm',
	            requireAuthenticated: true
	        })
	        .state('main.stocks.unfinished-operation', {
	            url: '/unfinished-operation/{operationTypeId}',
	            templateUrl: 'modules/stocks/settings/operation/unfinishedOperationView.html',
	            controller: 'unfinishedOperationCtrl as vm',
	            requireAuthenticated: true
	        })
	        .state('main.stocks.edit-operation', {
	            url: '/edit-operation/{operationTypeId}/{operationId}',
	            templateUrl: 'modules/stocks/settings/operation/editOperationView.html',
	            controller: 'editOperationCtrl as vm',
	            requireAuthenticated: true
	        })
	        .state('main.stocks.stock-movement', {
	            url: '/stock-movement',
	            templateUrl: 'modules/stocks/settings/stock-movement/stockMovementView.html',
	            controller: 'stockMovementCtrl as vm',
	            requireAuthenticated: true
	        })
	        .state('main.sales', {
                abstract: true,
                url:'/sales',
                views: {
                    '' : {
                        templateUrl: 'modules/sales/salesView.html',      
                        controller: 'salesCtrl as vm'                  
                    },                    
                    'sideBarSales@main.sales' : {
                        templateUrl: 'modules/sales/side-bar/sideBarView.html',
                        controller: 'salesSideBarCtrl as vm'
                    }
                }            
            })
            .state('main.sales.dashboard', {
	            url: '/dashboard',
	            templateUrl: 'modules/sales/dashboard/dashboardView.html',
	            controller: 'salesDashboardCtrl as vm',
	            requireAuthenticated: true
	        })
	        .state('main.sales.product', {
	            url: '/product',
	            templateUrl: 'modules/sales/settings/product/productView.html',
	            controller: 'productCtrl as vm',
	            requireAuthenticated: true
	        })
	        .state('main.sales.product-tax', {
	            url: '/product-tax/{productId}',
	            templateUrl: 'modules/sales/settings/product/productTaxView.html',
	            controller: 'productTaxCtrl as vm',
	            requireAuthenticated: true
	        })
	        .state('main.sales.product-pricing', {
	            url: '/product-pricing/{productId}',
	            templateUrl: 'modules/sales/settings/product/productPricingView.html',
	            controller: 'productPricingCtrl as vm',
	            requireAuthenticated: true
	        })
	        .state('main.sales.quotation', {
	            url: '/quotation',
	            templateUrl: 'modules/sales/features/quotation/quotationView.html',
	            controller: 'quotationCtrl as vm',
	            requireAuthenticated: true
	        })
	         .state('main.sales.edit-quotation', {
	            url: '/edit-quotation/{quotationId}',
	            templateUrl: 'modules/sales/features/quotation/editQuotationView.html',
	            controller: 'editQuotationCtrl as vm',
	            requireAuthenticated: true
	        })
	        .state('main.sales.purchase-order', {
	            url: '/purchase-order',
	            templateUrl: 'modules/sales/features/purchase-order/purchaseOrderView.html',
	            controller: 'purchaseOrderCtrl as vm',
	            requireAuthenticated: true
	        })
	        .state('main.sales.edit-purchase-order', {
	            url: '/edit-purchase-order/{quotationId}',
	            templateUrl: 'modules/sales/features/purchase-order/editPurchaseOrderView.html',
	            controller: 'editPurchaseOrderCtrl as vm',
	            requireAuthenticated: true
	        })
	        .state('main.sales.invoice', {
	            url: '/invoice/{purchaseOrderId}',
	            templateUrl: 'modules/sales/features/invoice/invoiceView.html',
	            controller: 'invoiceCtrl as vm',
	            requireAuthenticated: true
	        })
	        .state('main.sales.edit-invoice', {
	            url: '/edit-invoice/{invoiceId}',
	            templateUrl: 'modules/sales/features/invoice/editInvoiceView.html',
	            controller: 'editInvoiceCtrl as vm',
	            requireAuthenticated: true
	        })
	        .state('main.sales.payment', {
	            url: '/payment/{invoiceId}',
	            templateUrl: 'modules/sales/features/payment/paymentView.html',
	            controller: 'paymentCtrl as vm',
	            requireAuthenticated: true
	        })
	        .state('main.sales.customer', {
	            url: '/customer',
	            templateUrl: 'modules/sales/features/customer/customerView.html',
	            controller: 'customerCtrl as vm',
	            requireAuthenticated: true
	        })
	        .state('main.pdv', {
                abstract: true,
                url:'/pdv',
                views: {
                    '' : {
                        templateUrl: 'modules/pdv/pdvView.html',      
                        controller: 'pdvCtrl as vm'                  
                    },                    
                    'sideBarPdv@main.pdv' : {
                        templateUrl: 'modules/pdv/side-bar/sideBarView.html',
                        controller: 'pdvSideBarCtrl as vm'
                    }
                }            
            })
            .state('main.pdv.dashboard', {
	            url: '/dashboard',
	            templateUrl: 'modules/pdv/dashboard/dashboardView.html',
	            controller: 'pdvDashboardCtrl as vm',
	            requireAuthenticated: true
	        });
	}
	
	run.$inject = ['$rootScope', '$state', 'membershipService', 'localStorageService', '$base64'];
	function run($rootScope, $state, membershipService, localStorageService, $base64){		
		
		var repositoryData = localStorageService.get('repository');		
		$rootScope.repository = repositoryData ? JSON.parse($base64.decode(repositoryData)) : {};
        if ($rootScope.repository.loggedUser) {            
            membershipService.initializeAfterLogin($rootScope.repository);
        }
        
        var stateChangeStartEvent = $rootScope.$on('$stateChangeStart', function (evt, toState, toParams, fromState, fromParams) {
            
            if (toState.requireAuthenticated == true && !membershipService.isUserLoggedIn()) {                                
                $state.go('login');
                evt.preventDefault();
                return;
            }
            
            if (membershipService.isUserLoggedIn() && toState.name == 'login') {
                $state.go('main.dashboard');
                evt.preventDefault();
                return;
            }           
        });
        
        $rootScope.$on('$destroy', function ()
        {
            stateChangeStartEvent();
        });
	}
})();