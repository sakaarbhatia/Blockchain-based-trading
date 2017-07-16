var config = require('config.json');
var express = require('express');
var router = express.Router();
var productService = require('services/products.service');

// routes
router.post('/add', addProduct);
router.get('/all', getAllProducts);
router.get('/:_id', getProductsById);
router.put('/:_id', updateProduct);
router.delete('/:_id', deleteProduct);

module.exports = router;

function addProduct(req, res) {

    if(!req.body.payAddress || !req.body.title || !req.body.price){
        res.status(400).send("parameters missing")
    }
    productService.create(req.body)
        .then(function() {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAllProducts(req, res) {
    productService.getAll()
        .then(function (p) {
            if (p) {
                res.send(p);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getProductsById(req, res) {
    productService.getById(req.params._id)
        .then(function (p) {
            if (p) {
                res.send(p);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function updateProduct(req, res) {
    var productId = req.params._id;

    productService.update(productId, req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function deleteProduct(req, res) {
    var productId = req.params._id;
    
    productService.delete(productId)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}