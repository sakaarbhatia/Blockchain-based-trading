(function () {
    'use strict';

    angular
        .module('app')
        .controller('Product.ProductController', Controller);

    function Controller($stateParams, ProductService, $mdDialog, TransactionService, UserService, FlashService) {
        var vm = this;

        vm.addToCart = buy;

        vm.product = {};

        var productId = $stateParams.id;
        ProductService.GetById(productId)
        .then(function(product){
            vm.product = product
        })
        .catch(function(error){
            console.log(error)
        })

        function buy(){

            //TransactionService.addToCart(vm.product)
        }

        vm.showPrompt = function(ev) {
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.prompt()
              .title('Are you sure to redeem your points on the item?')
              .textContent('Item : ' + vm.product.title)
              .placeholder('Enter your Password for transaction')
              .targetEvent(ev)
              .ok('BUY')
              .cancel('CANCEL');

            $mdDialog.show(confirm).then(function(result) {
              if(result != undefined){
                  
                  var req = {
                     "fromAddress" : UserService.user.pubKey,
                     "toAddress": vm.product.pubKey,
                     "password" : result,
                     "value" : vm.product.price,
                     "productId": vm.product._id
                  }

                  TransactionService.buy(req)
                  .then(function(result){
                    FlashService.Success("Transaction Successful")
                    location.reload();
                  })
                  .catch(function(err){
                      FlashService.Error("Error in transaction")
                  })



              }
              
            }, function() {
            });
          };


        
    }

})();