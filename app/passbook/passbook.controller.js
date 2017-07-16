(function () {
    'use strict';

    angular
        .module('app')
        .controller('Passbook.PassbookController', Controller);

    function Controller(UserService, NgTableParams) {
        
        var vm = this;

        vm.isYou = isYou;

        UserService.passbook()
        .then(function(passbook){
            vm.tableParams = new NgTableParams({}, { dataset: passbook});
        })
        .catch(function(err){
            console.log(err)
        })

        function isYou(){
            return UserService.user.pubKey;
        }
    }

})();