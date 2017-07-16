(function () {
    'use strict';

    angular
        .module('app')
        .controller('Home.HomeController', Controller);

    function Controller(UserService, ProductService, TransactionService, $rootScope, FlashService) {
        var vm = this;

        vm.user = null;

        initController();

        function initController() {
            // get current user
            UserService.GetCurrent().then(function (user) {
                vm.user = user;
                TransactionService.balance(user.pubKey)
                .then(function(bal){
                    vm.user.balance = bal;
                    UserService.user = vm.user;
                }).catch(function(err){
                    FlashService.Error("Error in fetching balance")
                })
            });

            ProductService.GetAll().then(function (products) {
                ProductService.productList = products;
                $rootScope.$broadcast('productList', { products: products });
            });


        }


    }

})();