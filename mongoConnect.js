var config = require('config.json');
var mongo = require('mongoskin');
var _db;

module.exports = {

  connectToMongoServer: function() {
	var db = mongo.db(config.connectionString, { native_parser: true });
	_db = db;
    return _db;
  },

  getDb: function() {
    return _db;
  }
};