(function () {
    'use strict';

    angular
        .module('app')
        .controller('Transfer.TransferController', Controller);

    function Controller($mdDialog, TransactionService, UserService, FlashService) {
        var vm = this;

        vm.showPrompt = function(ev) {
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.prompt()
              .title('Are you sure to transfer your points?')
              .textContent('To : ' + vm.pubKey + ' Value : ' + vm.sendVal)
              .placeholder('Enter your Password for transaction')
              .targetEvent(ev)
              .ok('TRANSFER')
              .cancel('CANCEL');

            $mdDialog.show(confirm).then(function(result) {
              if(result != undefined){

                  var req = {
                     "fromAddress" : UserService.user.pubKey,
                     "toAddress": vm.pubKey,
                     "password" : result,
                     "value" : vm.sendVal
                  }

                  TransactionService.send(req)
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