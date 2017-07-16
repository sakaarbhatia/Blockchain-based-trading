(function () {
    'use strict';

    angular
        .module('app', ['ui.router', 'ngMaterial', 'ngTable'])
        .config(config)
        .run(run);

    function config($stateProvider, $urlRouterProvider) {
        // default route
        $urlRouterProvider.otherwise("/dashboard");

        $stateProvider
            .state('products', {
                url: '/products',
                templateUrl: 'products/products.html',
                controller: 'Products.ProductsController',
                controllerAs: 'vm'
            })
            .state('dashboard', {
                url: '/dashboard',
                templateUrl: 'dashboard/dashboard.html',
                controller: 'Dashboard.DashboardController',
                controllerAs: 'vm'
            })
            .state('cart', {
                url: '/cart',
                templateUrl: 'cart/cart.html',
                controller: 'Cart.CartController',
                controllerAs: 'vm'
            })
            .state('transfer', {
                url: '/transfer',
                templateUrl: 'transfer/transfer.html',
                controller: 'Transfer.TransferController',
                controllerAs: 'vm'
            })
            .state('passbook', {
                url: '/passbook',
                templateUrl: 'passbook/passbook.html',
                controller: 'Passbook.PassbookController',
                controllerAs: 'vm'
            })
            .state('productDetails', {
                url: '/:id',
                templateUrl: 'product/product.html',
                controller: 'Product.ProductController',
                controllerAs: 'vm'
            });
    }

    function run($http, $rootScope, $window) {
        // add JWT token as default auth header
        $http.defaults.headers.common['Authorization'] = 'Bearer ' + $window.jwtToken;

        // update active tab on state change
       
    }

    // manually bootstrap angular after the JWT token is retrieved from the server
    $(function () {
        // get JWT token from server
        $.get('/app/token', function (token) {
            window.jwtToken = token;

            angular.bootstrap(document, ['app']);
        });
    });
})();