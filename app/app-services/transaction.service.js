(function () {
    'use strict';

    angular
        .module('app')
        .factory('TransactionService', Service);

    function Service($http, $q) {
        var service = {};

        service.balance = balance;
        service.send = send;
        service.buy = buy;
        
       

        return service;

        function balance(address) {
            return $http.get('/api/transaction/balance?address=' + address).then(handleSuccess, handleError);
        }

        function send(request) {
            return $http.post('/api/transaction/send', request).then(handleSuccess, handleError);
        }

        function buy(request) {
            return $http.post('/api/transaction/buy', request).then(handleSuccess, handleError);
        }
        
        // private functions

        function handleSuccess(res) {
            return res.data;
        }

        function handleError(res) {
            return $q.reject(res.data);
        }
    }

})();
