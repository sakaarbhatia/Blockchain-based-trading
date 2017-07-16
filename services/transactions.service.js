var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var Q = require('q');

var Web3 = require('web3Connect');
var web3 = Web3.getWeb3();

var mongo = require('mongoConnect');


var db = mongo.getDb();
db.bind('products');

var service = {};

service.sendToken = sendToken;
service.buy = buy;
service.addGenesisAddress = addGenesisAddress;
service.getTokenBalanceByPubKey = getTokenBalanceByPubKey;
service.test = test;

module.exports = service;


var tokenAbi = config.tokenAbi;
var tokenAddress = config.tokenAddress;



function buy(myPubKey, productPubKey, password, price, productId){
    var deferred = Q.defer();


    db.products.findById(productId, function (err, product) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (product.pubKey !== productPubKey || product.price !== price) {
            deferred.reject("Erroraneous transaction")
        } else {
            sendToken(myPubKey, productPubKey, password, price)
            .then(function(receipt){
                deferred.resolve(receipt);
            })
            .catch(function(err){
                deferred.reject(err);
            })
        }
    });

    return deferred.promise;

}



function sendToken(myPubKey, toAddress, password, value) {
    var deferred = Q.defer();

    try{
        var isUnlocked = web3.personal.unlockAccount(myPubKey, password);
        if(isUnlocked){

        	var contract = web3.eth.contract(tokenAbi);
        	var myContractInstance = contract.at(tokenAddress);

        	var tranHash = myContractInstance.transfer(toAddress, value, {
                from: myPubKey,
                //value: web3.toWei('0.001', 'ether'),
                to: tokenAddress,
                gas: "1000000",
                data: web3.fromDecimal(1)
            });


            var receipt = null;
            getReceipt();

            function getReceipt() {
                receipt = web3.eth.getTransactionReceipt(tranHash);
                if(receipt === null) {//we want it to match
                    setTimeout(getReceipt, 500);//wait 50 millisecnds then recheck
                    return;
                }
                if(receipt.logs.length == 0) {
                    deferred.reject("Balance not sufficient for this transaction");    
                }
                // Get the balance after casting a vote
                getTokenBalanceByPubKey(myPubKey)
                .then(function(bal) {
                    receipt.balance = bal;
                    deferred.resolve(receipt);
                })
                .catch(error => {
                    deferred.reject(error); 
                });
            }        
        }else{
        	deferred.reject("Your Password is incorrect! Try again later")
        }
    }catch(err){
        console.log(err)
       deferred.reject("Error in transaction " + err)
    }
    
    return deferred.promise;
}


function addGenesisAddress(myAddress, arrayOfAddresses, password) {
    var deferred = Q.defer();

    try{
        var contract = web3.eth.contract(tokenAbi);
        var myContractInstance = contract.at(tokenAddress);

        var isUnlocked = web3.personal.unlockAccount(myAddress, password);

        if(isUnlocked){
            var tranHash = myContractInstance.setGenesisAddressArray(arrayOfAddresses, {
                from: myAddress,
                //value: web3.toWei('0.001', 'ether'),
                to: tokenAddress,
                gas: "1000000",
                data: web3.fromDecimal(1)
            });
           
            var receipt = null;
            getReceipt();

            function getReceipt() {
                receipt = web3.eth.getTransactionReceipt(tranHash);
                if(receipt === null) {//we want it to match
                    setTimeout(getReceipt, 500);//wait 50 millisecnds then recheck
                    return;
                }
                if(receipt.logs.length == 0) {
                    deferred.reject("There was some error in transaction");    
                }
                // Get the balance after casting a vote
                deferred.resolve(tranHash);
            
            }
        }else{
            deferred.reject("Your Password is incorrect! Try again later")
        }
    }catch(err){
        deferred.reject("Error in transaction " + err)
    }
                    
    return deferred.promise;
}


function test(account) {
    var deferred = Q.defer();

   
        var contract = web3.eth.contract(tokenAbi);
        var myContractInstance = contract.at(tokenAddress);

        var val = myContractInstance.isGenesisAddress(account, {
            from: "0xed9d02e382b34818e88b88a309c7fe71e65f419d",
            to: tokenAddress,
            gas: "1000000",
            data: web3.fromDecimal(1)
        });

        deferred.resolve(val)

    
    return deferred.promise;
}



function getTokenBalanceByPubKey(account) {
    var deferred = Q.defer();

    try {

        var contract = web3.eth.contract(tokenAbi);
    	var myContractInstance = contract.at(tokenAddress);
        var num = myContractInstance.balanceOf(account);
      
        deferred.resolve(num);
    }
    catch(e) {

        deferred.reject(e.message);       
    }

    return deferred.promise;
}

