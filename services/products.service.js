var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var Q = require('q');
var mongo = require('mongoConnect');


var db = mongo.getDb();
db.bind('products');

var service = {};

service.getById = getById;
service.getAll = getAll;
service.create = create;
service.update = update;
service.delete = _delete;

module.exports = service;


function getAll() {
    var deferred = Q.defer();

    db.products.find().toArray(function (err, product) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (product) {
            deferred.resolve(product);
        } else {
            // product not found
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function getById(_id) {
    var deferred = Q.defer();

    db.products.findById(_id, function (err, product) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (product) {
            deferred.resolve(product);
        } else {
            // product not found
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function create(productParam) {
    var deferred = Q.defer();

    // validation
    db.products.findOne(
        { title: productParam.title },
        function (err, product) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            if (product) {
                // product already exists
                deferred.reject('Product Title "' + productParam.title + '" is already taken');
            } else {
                createproduct();
            }
        });

    function createproduct() {
        // set user object to userParam without the cleartext password
        var product = productParam;

        db.products.insert(
            product,
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function update(_id, productParam) {
    var deferred = Q.defer();

    // validation
    db.products.findById(_id, function (err, product) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (product.title !== productParam.title) {
            // username has changed so check if the new username is already taken
            db.products.findOne(
                { title: productParam.title },
                function (err, product) {
                    if (err) deferred.reject(err.name + ': ' + err.message);

                    if (product) {
                        // username already exists
                        deferred.reject('Title "' + req.body.title + '" is already taken')
                    } else {
                        updateProduct();
                    }
                });
        } else {
            updateProduct();
        }
    });

    function updateProduct() {
        // fields to update
        var set = {
            description: productParam.firstName,
            price: productParam.price,
            quantity: productParam.quantity,
            image: productPAram.image,
            payAddress: productPAram.payAddress,
        };

        db.products.update(
            { _id: mongo.helper.toObjectID(_id) },
            { $set: set },
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function _delete(_id) {
    var deferred = Q.defer();

    db.products.remove(
        { _id: mongo.helper.toObjectID(_id) },
        function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}