(function () {
    'use strict';

    angular
        .module('app')
        .controller('Dashboard.DashboardController', Controller);

    function Controller(UserService, ProductService, $scope) {
        var vm = this;

        vm.products = ProductService.productList;

        $scope.$on('productList', function (event, args) {
            vm.products = args.products;
        });

        $('.carousel').carousel({
            interval: 5000
        });

        $('.carousel').carousel('cycle');
        



    }

})();