var config = require('config.json');
var express = require('express');
var router = express.Router();
var transactionService = require('services/transactions.service');

// routes
router.post('/send', send);
router.post('/genesis', genesis);
router.post('/test', test);
router.post('/buy', buy);
router.get('/balance', balance);

module.exports = router;

function send(req, res) {

	var from = req.body.fromAddress;
	var to = req.body.toAddress;
	var password = req.body.password;
	var value = req.body.value;

	if(!from || !to || !value || !password){
		res.status(400).send("Incorrect parameters");
	}

    transactionService.sendToken(from,to,password,value)
        .then(function(result) {
            res.send(result);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}


function buy(req, res) {

    var from = req.body.fromAddress;
    var to = req.body.toAddress;
    var password = req.body.password;
    var value = req.body.value;
    var productId = req.body.productId;

    if(!from || !to || !value || !password || !productId ){
        res.status(400).send("Incorrect parameters");
    }

    transactionService.buy(from, to, password, value,productId)
        .then(function(result) {
            res.send(result);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function genesis(req, res) {

	var address = req.body.address
	var list = req.body.genesisAddresses
	var password = req.body.password;

	if(!list || !password){
		 res.status(400).send("Incorrect Parameter");
	}
    transactionService.addGenesisAddress(address,list, password)
        .then(function(result) {
            res.send(result);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function test(req, res) {
    transactionService.test(req.body.address)
        .then(function(result) {
            res.send(result);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function balance(req, res) {

	var address = req.query.address
	if(!address){
		res.status(400).send("Incorrect PArameter");
	}
    transactionService.getTokenBalanceByPubKey(address)
        .then(function(result) {
            res.send(result);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

