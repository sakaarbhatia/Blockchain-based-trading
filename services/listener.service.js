var config = require('config.json');
var Q = require('q');
var Web3 = require('web3Connect');
var abiDecoder = require('abi-decoder');

var mongoUtil = require( 'mongoConnect' );
var db = mongoUtil.connectToMongoServer(); 

db.bind('transactions');

var service = {};

service.connectToTransactionListner = connectToTransactionListner;

module.exports = service;

var tokenContract = config.tokenAbi;
abiDecoder.addABI(tokenContract);

web3 = Web3.connectToEthereumNode();


function connectToTransactionListner(){

    
    var filter = web3.eth.filter('latest')
    filter.watch(function(error, result){
        if (!error){
            web3.eth.getBlock(result, function(err, transaction){
                var trList = transaction.transactions;
                var timeStamp = transaction.timestamp;
                for(i=0; i < trList.length;i++){
                    
                    web3.eth.getTransactionReceipt(trList[i], function(e, receipt) {
                        
                        var decodedLogs = abiDecoder.decodeLogs(receipt.logs);
                       
                        decodedLogs.forEach(function(logs){
                            if(logs != undefined){

                                if(logs.address == config.tokenAddress && logs.name == "Transfer"){
                                    var unix_timestamp = timeStamp / 1000000;
                                    var date = new Date(unix_timestamp);
                                    var convertedTimeStamp = (date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds())

                                    var transaction = {
                                        "transactionHash" :  receipt.transactionHash,
                                        "transactionDate": convertedTimeStamp,
                                        "transactionTimeStamp": timeStamp,
                                        "transactionFrom" : logs.events[0].value,
                                        "transactionTo" : logs.events[1].value,
                                        "transactionValue" : logs.events[2].value
                                    }
                            
                                    db.transactions.insert(transaction, function(err, result) {
                                        if (err) {
                                            console.log('Insert Error: %s',err.stack);
                                        }
                                        if (result) {
                                        }
                                    })
                                }    
                            }
                        })        
                    });
                }
            })  
        }
    })
}