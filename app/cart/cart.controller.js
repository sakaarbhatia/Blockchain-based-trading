(function () {
    'use strict';

    angular
        .module('app')
        .controller('Cart.CartController', Controller);

    function Controller(ProductService) {
        var vm = this;

       console.log(ProductService.addedToCart)
    }

})();