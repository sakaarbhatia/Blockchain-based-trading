var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoConnect');
var db = mongo.getDb();
var trDb = mongo.getDb();
db.bind('users');
trDb.bind('transactions');

var Web3 = require('web3Connect');
var web3 = Web3.getWeb3();

var tranService = require('./transactions.service')

var service = {};

service.authenticate = authenticate;
service.getById = getById;
service.create = create;
service.update = update;
service.delete = _delete;
service.passbook = passbook;

module.exports = service;

function authenticate(username, password) {
    var deferred = Q.defer();

    db.users.findOne({ username: username }, function (err, user) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (user && bcrypt.compareSync(password, user.hash)) {
            // authentication successful
            deferred.resolve(jwt.sign({ sub: user._id }, config.secret));
        } else {
            // authentication failed
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function getById(_id) {
    var deferred = Q.defer();

    db.users.findById(_id, function (err, user) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (user) {
            // return user (without hashed password)
            deferred.resolve(_.omit(user, 'hash'));
        } else {
            // user not found
            deferred.resolve();
        }
    });

    return deferred.promise;
}


function passbook(_id) {
    var deferred = Q.defer();

    db.users.findById(_id, function (err, user) {
        if (err) {
            deferred.reject(err.name + ': ' + err.message);
        }else{
            if (user) { 
                trDb.transactions.find({ $or: [ { transactionFrom: user.pubKey }, { transactionTo: user.pubKey } ] }).toArray(function (err, passbook) {
                    if (err) deferred.reject(err.name + ': ' + err.message);

                    if (passbook) {
                        deferred.resolve(passbook);
                    } else {
                        // product not found
                        deferred.resolve();
                    }
                });
            } else {
                deferred.resolve();
            }
        }
    });

    return deferred.promise;
}


function create(userParam) {
    var deferred = Q.defer();

    // validation
    db.users.findOne(
        { username: userParam.username },
        function (err, user) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            if (user) {
                // username already exists
                deferred.reject('Username "' + userParam.username + '" is already taken');
            } else {
                createUser();
            }
        });

    function createUser() {
          
        //Create Quorum/Ethereum Account :: This is a workaround for demo
        var pubKey = web3.personal.newAccount(userParam.password)

        web3.eth.sendTransaction({from:web3.eth.coinbase, to:pubKey, value:20})

        // set user object to userParam without the cleartext password
        var user = _.omit(userParam, 'password');
          // add hashed password to user object
        user.hash = bcrypt.hashSync(userParam.password, 10);
        user.pubKey = pubKey;

        console.log(pubKey)
        //Send Someinitial Tokens :: workaround for demo
        tranService.sendToken("0x00ebace8aa25281d8ab4e30082759077384e264d",pubKey,"retailers",1000)
        .then(function(receipt){
            console.log(receipt)
            db.users.insert(
                user,
                function (err, doc) {
                    if (err) deferred.reject(err.name + ': ' + err.message);
                    deferred.resolve();
                });
        })
        .catch(function(error){
            deferred.reject(error)
        })

    }

    return deferred.promise;
}

function update(_id, userParam) {
    var deferred = Q.defer();

    // validation
    db.users.findById(_id, function (err, user) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (user.username !== userParam.username) {
            // username has changed so check if the new username is already taken
            db.users.findOne(
                { username: userParam.username },
                function (err, user) {
                    if (err) deferred.reject(err.name + ': ' + err.message);

                    if (user) {
                        // username already exists
                        deferred.reject('Username "' + req.body.username + '" is already taken')
                    } else {
                        updateUser();
                    }
                });
        } else {
            updateUser();
        }
    });

    function updateUser() {
        // fields to update
        var set = {
            firstName: userParam.firstName,
            lastName: userParam.lastName,
            username: userParam.username,
        };

        // update password if it was entered
        if (userParam.password) {
            set.hash = bcrypt.hashSync(userParam.password, 10);
        }

        db.users.update(
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

    db.users.remove(
        { _id: mongo.helper.toObjectID(_id) },
        function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}