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
		   .run(run)
		   .controller('appCtrl', appCtrl);
	
	appCtrl.$inject = [];
	
	function appCtrl(){
		
	}
	
	config.$inject = ['$stateProvider', '$urlRouterProvider', '$httpProvider', '$provide', 'localStorageServiceProvider', '$locationProvider'];
	function config($stateProvider, $urlRouterProvider, $httpProvider, $provide, localStorageServiceProvider, $locationProvider){

		$locationProvider.hashPrefix('');
		
        $provide.constant('rootUrl', rootUrl);
        
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
            .state('main.settings.my-account', {
                url:'/my-account',
                templateUrl: 'modules/admin/settings/my-account/myAccountView.html',
                controller: 'myAccountCtrl as vm',
                requireAuthenticated: true
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
            .state('main.settings.profile', {
                url:'/profile',
                templateUrl: 'modules/admin/settings/profile/profileView.html',
                controller: 'profileCtrl as vm',
                requireAuthenticated: true
            })
            .state('main.settings.profile-feature', {
                url:'/profile-feature',
                params: {
                    profileId: null,
                },
                templateUrl: 'modules/admin/settings/profile/editProfileFeatureView.html',
                controller: 'editProfileFeatureCtrl as vm',
                requireAuthenticated: true
            })
            .state('main.settings.user', {
                url:'/user',
                templateUrl: 'modules/admin/settings/user/userView.html',
                controller: 'userCtrl as vm',
                requireAuthenticated: true
            })
            .state('main.settings.edit-user', {
                url: '/edit-user',
                params: {
                    itemId: null,
                },
                templateUrl: 'modules/admin/settings/user/editUserView.html',
                controller: 'editUserCtrl as vm',
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
	        .state('main.settings.payment-mode', {
	            url: '/payment-mode',
	            templateUrl: 'modules/admin/settings/payment-mode/paymentModeView.html',
	            controller: 'paymentModeCtrl as vm',
	            requireAuthenticated: true
	        })
	        .state('main.settings.log', {
	            url: '/log',
	            templateUrl: 'modules/admin/settings/log/logView.html',
	            controller: 'logCtrl as vm',
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
	            url: '/article-family',
	            params :{
	            	categoryId: null
	            },
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
	            url: '/article',
	            params :{
	            	familyId: null
	            },
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
	            url: '/location',
	            params :{
	            	warehouseId: null
	            },
	            templateUrl: 'modules/stocks/settings/warehouse/locationView.html',
	            controller: 'locationCtrl as vm',
	            requireAuthenticated: true
	        })
	        .state('main.stocks.warehouse-operation-type', {
	            url: '/operation-type',
	            params :{
	            	warehouseId: null
	            },
	            templateUrl: 'modules/stocks/settings/operation-type/operationTypeView.html',
	            controller: 'operationTypeCtrl as vm',
	            requireAuthenticated: true
	        })
	        .state('main.stocks.article-planning', {
	            url: '/article-planning',
	            params :{
	            	articleId: null
	            },
	            templateUrl: 'modules/stocks/settings/article/articlePlanningView.html',
	            controller: 'articlePlanningCtrl as vm',
	            requireAuthenticated: true
	        })
	        .state('main.stocks.unfinished-operation', {
	            url: '/unfinished-operation',
	            params :{
	            	statutId: null,
	            	operationTypeId : null
	            },
	            templateUrl: 'modules/stocks/settings/operation/unfinishedOperationView.html',
	            controller: 'unfinishedOperationCtrl as vm',
	            requireAuthenticated: true
	        })
	        .state('main.stocks.edit-operation', {
	            url: '/edit-operation',
	            params :{
	            	operationTypeId: null,
	            	operationId : null
	            },
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
	        .state('main.sales.product-category', {
	            url: '/product-category',
	            templateUrl: 'modules/sales/settings/product-category/productCategoryView.html',
	            controller: 'productCategoryCtrl as vm',
	            requireAuthenticated: true
	        })
	        .state('main.sales.product', {
	            url: '/product',
	            params :{
	            	categoryId : null
	            },
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
	        .state('main.sales.purchase-order', {
	            url: '/purchase-order',
	            templateUrl: 'modules/sales/features/purchase-order/purchaseOrderView.html',
	            controller: 'purchaseOrderCtrl as vm',
	            requireAuthenticated: true
	        })
	         .state('main.sales.edit-purchase-order', {
	            url: '/edit-purchase-order',
	            params :{
	            	purchaseOrderId : null
	            },
	            templateUrl: 'modules/sales/features/purchase-order/editPurchaseOrderView.html',
	            controller: 'editPurchaseOrderCtrl as vm',
	            requireAuthenticated: true
	        })
	        .state('main.sales.invoice', {
	            url: '/invoice',
	            params :{
	            	purchaseOrderId : null
	            },
	            templateUrl: 'modules/sales/features/invoice/invoiceView.html',
	            controller: 'invoiceCtrl as vm',
	            requireAuthenticated: true
	        })
	        .state('main.sales.edit-invoice', {
	            url: '/edit-invoice',
	            params : {
	            	id: null,
	            	purchaseOrderId: null,
            		typeId: null,
            		percent: null,
            		amount: null,
            		base: null
	            },
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
	        .state('main.sales.provision', {
	            url: '/provision',
	            templateUrl: 'modules/sales/features/customer/provisionView.html',
	            controller: 'provisionCtrl as vm',
	            params: {
                    customerId: null,
                },
	            requireAuthenticated: true
	        })
	        .state('main.sales.team', {
	            url: '/team',
	            templateUrl: 'modules/sales/settings/team/teamView.html',
	            controller: 'teamCtrl as vm',
	            requireAuthenticated: true
	        })
	        .state('main.sales.team-member', {
	            url: '/team-member',
	            params: {
                    teamId: null,
                },
	            templateUrl: 'modules/sales/settings/team/teamSellerView.html',
	            controller: 'teamSellerCtrl as vm',
	            requireAuthenticated: true
	        })
	        .state('main.sales.interfacage', {
	        	url: '/interfacage',
	        	templateUrl: 'modules/sales/interfacage/interfacageView.html',
	            controller: 'salesInterfacageCtrl as vm',
	            requireAuthenticated: true
            })
            .state('main.sales.interfacage.stocks', {
	            url: '/stocks',
	            templateUrl: 'modules/sales/interfacage/stocks/stocksView.html',
	            controller: 'stocksInterfaceCtrl as vm',
	            requireAuthenticated: true
	        })
	        .state('main.sales.interfacage.compta', {
	            url: '/compta',
	            templateUrl: 'modules/sales/interfacage/compta/comptaView.html',
	            controller: 'comptaSalesInterfaceCtrl as vm',
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
	        })
	        .state('main.pdv.pdv-settings', {
	            url: '/pdv-settings',
	            templateUrl: 'modules/pdv/settings/pdv-settings/pdvSettingsView.html',
	            controller: 'pdvSettingsCtrl as vm',
	            requireAuthenticated: true
	        })
	        .state('main.pdv.pdv-product', {
	            url: '/pdv-product',
	            params : {
	            	pdvId : null
	            },
	            templateUrl: 'modules/pdv/settings/pdv-settings/pdvProductView.html',
	            controller: 'pdvProductCtrl as vm',
	            requireAuthenticated: true
	        })
	        .state('main.pdv.pdv-product-category', {
	            url: '/pdv-product-category',
	            params : {
	            	pdvId : null
	            },
	            templateUrl: 'modules/pdv/settings/pdv-settings/pdvProductCategoryView.html',
	            controller: 'pdvProductCategoryCtrl as vm',
	            requireAuthenticated: true
	        })
	        .state('main.pdv.pdv-cashier', {
	            url: '/pdv-cashier',
	            params : {
	            	pdvId : null
	            },
	            templateUrl: 'modules/pdv/settings/pdv-settings/pdvCashierView.html',
	            controller: 'pdvCashierCtrl as vm',
	            requireAuthenticated: true
	        })
	        .state('cashdesk', {
	            url: '/cashdesk/{sessionId}',
	            templateUrl: 'modules/pdv/features/cashdesk/cashdeskView.html',
	            controller: 'cashdeskCtrl as vm',
	            requireAuthenticated: true
	        })
	        .state('main.compta', {
                abstract: true,
                url:'/compta',
                views: {
                    '' : {
                        templateUrl: 'modules/compta/comptaView.html',      
                        controller: 'comptaCtrl as vm'                  
                    },                    
                    'sideBarCompta@main.compta' : {
                        templateUrl: 'modules/compta/side-bar/sideBarView.html',
                        controller: 'comptaSideBarCtrl as vm'
                    }
                }            
            })
            .state('main.compta.dashboard', {
	            url: '/dashboard',
	            templateUrl: 'modules/compta/dashboard/dashboardView.html',
	            controller: 'comptaDashboardCtrl as vm',
	            requireAuthenticated: true
	        })
	        .state('main.compta.generalities', {
	            url: '/generalities',
	            templateUrl: 'modules/compta/settings/generalities/generalitiesView.html',
	            controller: 'generalitiesCtrl as vm',
	            requireAuthenticated: true
	        })
	        .state('main.compta.chart', {
	            url: '/chart',
	            templateUrl: 'modules/compta/settings/chart/chartView.html',
	            controller: 'chartCtrl as vm',
	            requireAuthenticated: true
	        })
	        .state('main.compta.journal', {
	            url: '/journal',
	            templateUrl: 'modules/compta/settings/journal/journalView.html',
	            controller: 'journalCtrl as vm',
	            requireAuthenticated: true
	        })
	        .state('main.compta.journal-piece-type', {
	            url: '/journal-piece-type',
	            params: {
	            	journalId : null            	
	            },
	            templateUrl: 'modules/compta/settings/journal/journalPieceTypeView.html',
	            controller: 'journalPieceTypeCtrl as vm',
	            requireAuthenticated: true
	        })
	        .state('main.compta.piece-type', {
	            url: '/piece-type',
	            templateUrl: 'modules/compta/settings/piece-type/pieceTypeView.html',
	            controller: 'pieceTypeCtrl as vm',
	            requireAuthenticated: true
	        })
	        .state('main.compta.edit-piece', {
	            url: '/edit-piece',
	            params: {
	            	pieceId : null,
	            	journalId : null,
	            	typeId: null
	            },
	            templateUrl: 'modules/compta/features/piece/editPieceView.html',
	            controller: 'editPieceCtrl as vm',
	            requireAuthenticated: true
	        })
	        .state('main.compta.piece', {
	            url: '/piece',
	            params: {
	            	journalId : null,           	
	            },
	            templateUrl: 'modules/compta/features/piece/pieceView.html',
	            controller: 'pieceCtrl as vm',
	            requireAuthenticated: true
	        })
	        .state('main.compta.correspondance', {
	            url: '/correspondance',
	            params: {
	            	index : null,
	            	reconcileStatusId: null,
	            	lineStatusId: null,
	            	tiersTypeId: null
	            },
	            templateUrl: 'modules/compta/features/correspondance/correspondanceView.html',
	            controller: 'correspondanceCtrl as vm',
	            requireAuthenticated: true
	        })
	        .state('main.compta.edit-correspondance', {
	            url: '/correspondance',
	            params :{
	            	reconcileId: null
	            },
	            templateUrl: 'modules/compta/features/correspondance/editCorrespondanceView.html',
	            controller: 'editCorrespondanceCtrl as vm',
	            requireAuthenticated: true
	        })
	        .state('main.compta.exercise', {
	            url: '/exercise',
	            templateUrl: 'modules/compta/features/exercise/exerciseView.html',
	            controller: 'exerciseCtrl as vm',
	            requireAuthenticated: true
	        })
	        .state('main.compta.tiers-type', {
	            url: '/tiers-type',
	            templateUrl: 'modules/compta/settings/tiers-type/tiersTypeView.html',
	            controller: 'tiersTypeCtrl as vm',
	            requireAuthenticated: true
	        })
	        .state('main.compta.trame', {
	            url: '/{pieceTypeId}/trame',
	            templateUrl: 'modules/compta/settings/piece-type/pieceTrameView.html',
	            controller: 'pieceTrameCtrl as vm',
	            requireAuthenticated: true
	        })
	        .state('main.compta.edit-trame', {
	            url: '/edit-trame',
	            params: {
	            	pieceTypeId: null,
	            	trameId : null
	            },
	            templateUrl: 'modules/compta/settings/piece-type/editPieceTrameView.html',
	            controller: 'editPieceTrameCtrl as vm',
	            requireAuthenticated: true
	        })
	        .state('main.compta.reporting', {
	            url: '/reporting',
	            templateUrl: 'modules/compta/reporting/reportingView.html',	            
	            requireAuthenticated: true
	        })	
	        .state('main.compta.interfacage', {
                abstract: true,
                url:'/interfacage',
                views: {
                    '' : {
                        templateUrl: 'modules/compta/interfacage/interfacageView.html',      
                        controller: 'interfacageCtrl as vm'                  
                    }
                }            
            })
            .state('main.compta.interfacage.sales', {
	            url: '/sales',
	            templateUrl: 'modules/compta/interfacage/sales/salesView.html',
	            controller: 'salesInterfaceCtrl as vm',
	            requireAuthenticated: true
	        })
	        .state('main.compta.interfacage.purchases', {
	            url: '/purchases',
	            templateUrl: 'modules/compta/interfacage/purchases/purchasesView.html',
	            controller: 'purchasesInterfacageCtrl as vm',
	            requireAuthenticated: true
	        })
	        .state('main.saas', {
                abstract: true,
                url:'/saas',
                views: {
                    '' : {
                        templateUrl: 'modules/saas/saasView.html',      
                        controller: 'saasCtrl as vm'                  
                    },                    
                    'sideBarSaas@main.saas' : {
                        templateUrl: 'modules/saas/side-bar/sideBarView.html',
                        controller: 'saasSideBarCtrl as vm'
                    }
                }            
            })
            .state('main.saas.dashboard', {
	            url: '/dashboard',
	            templateUrl: 'modules/saas/dashboard/dashboardView.html',
	            controller: 'saasDashboardCtrl as vm',
	            requireAuthenticated: true
	        })
	        .state('main.saas.company', {
	            url: '/company',
	            templateUrl: 'modules/saas/features/company/companyView.html',
	            controller: 'companyCtrl as vm',
	            requireAuthenticated: true
	        })
	        .state('main.saas.currency', {
	            url: '/currency',
	            templateUrl: 'modules/saas/features/currency/currencyView.html',
	            controller: 'currencyCtrl as vm',
	            requireAuthenticated: true
	        })
	        .state('main.saas.edit-company', {
                url: '/edit-company',
                params: {
                    itemId: null,
                },
                templateUrl: 'modules/saas/features/company/editCompanyView.html',
                controller: 'editCompanyCtrl as vm',
                requireAuthenticated: true
            })
            .state('main.saas.company-module', {
                url: '/company-module',
                params: {
                    companyId: null,
                },
                templateUrl: 'modules/saas/features/company/companyModuleView.html',
                controller: 'companyModuleCtrl as vm',
                requireAuthenticated: true
            })
            .state('main.saas.company-log', {
                url: '/company-log',
                params: {
                    companyId: null,
                },
                templateUrl: 'modules/saas/features/company/logView.html',
                controller: 'logSaasCtrl as vm',
                requireAuthenticated: true
            })
            .state('main.contacts', {
                abstract: true,
                url:'/contacts',
                views: {
                    '' : {
                        templateUrl: 'modules/contacts/contactsView.html',      
                        controller: 'contactsCtrl as vm'                  
                    },                    
                    'sideBarContacts@main.contacts' : {
                        templateUrl: 'modules/contacts/side-bar/sideBarView.html',
                        controller: 'contactsSideBarCtrl as vm'
                    }
                }            
            })
            .state('main.contacts.dashboard', {
	            url: '/dashboard',
	            templateUrl: 'modules/contacts/dashboard/dashboardView.html',
	            controller: 'contactsDashboardCtrl as vm',
	            requireAuthenticated: true
	        })
	        .state('main.contacts.contact', {
	            url: '/contact',
	            templateUrl: 'modules/contacts/features/contact/contactView.html',
	            controller: 'contactCtrl as vm',
	            requireAuthenticated: true
	        })
	        .state('main.purchases', {
                abstract: true,
                url:'/purchases',
                views: {
                    '' : {
                        templateUrl: 'modules/purchases/purchasesView.html',      
                        controller: 'purchasesCtrl as vm'                  
                    },                    
                    'sideBarPurchases@main.purchases' : {
                        templateUrl: 'modules/purchases/side-bar/sideBarView.html',
                        controller: 'purchasesSideBarCtrl as vm'
                    }
                }            
            })
            .state('main.purchases.dashboard', {
	            url: '/dashboard',
	            templateUrl: 'modules/purchases/dashboard/dashboardView.html',
	            controller: 'purchasesDashboardCtrl as vm',
	            requireAuthenticated: true
	        });
	}
	
	run.$inject = ['$rootScope', '$state', 'membershipService', 'localStorageService', '$base64'];
	function run($rootScope, $state, membershipService, localStorageService, $base64){		
		
		$rootScope.modeText = modeText;
		$rootScope.appVersion = appVersion;
		$rootScope.simpleLogout = membershipService.simpleLogout;
		
		membershipService.setAuthenticationIfAlreadyLogged();
        
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
        
        $rootScope.isGranted = function(access) {
            return membershipService.isGranted(access);
        }
        
        $rootScope.$on('$destroy', function ()
        {
            stateChangeStartEvent();
        });
        
        $(document).ready(function() {
	    	  $('[data-toggle=offcanvas]').click(function() {
	    	    $('.row-offcanvas').toggleClass('active');
	    	  });
	    	});
	}
})();