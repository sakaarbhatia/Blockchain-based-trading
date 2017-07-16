(function () {
    'use strict';

    angular
        .module('app')
        .factory('ProductService', Service);

    function Service($http, $q) {
        var service = {};

        service.productList = [];
        service.addedToCart = [];

        service.GetAll = GetAll;
        service.GetById = GetById;
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;

        return service;

        function GetAll() {
            return $http.get('/api/products/all').then(handleSuccess, handleError);
        }

        function GetById(_id) {
            return $http.get('/api/products/' + _id).then(handleSuccess, handleError);
        }

        function Create(product) {
            return $http.post('/api/products', product).then(handleSuccess, handleError);
        }

        function Update(product) {
            return $http.put('/api/products/' + product._id, product).then(handleSuccess, handleError);
        }

        function Delete(_id) {
            return $http.delete('/api/products/' + _id).then(handleSuccess, handleError);
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
