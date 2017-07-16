(function () {
    'use strict';

    angular
        .module('app')
        .controller('Products.ProductsController', Controller);

    function Controller(ProductService,$scope) {
        var vm = this;

        vm.products = ProductService.productList;

        $scope.$on('productList', function (event, args) {
            vm.products = args.products;
        });



    }

})();