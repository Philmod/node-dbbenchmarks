var mongo = require('mongodb'),
  Db = mongo.Db;

var server = new mongo.Server('192.168.107.125', 27017, {auto_reconnect: true});
var db = new Db('testDB', server, {safe: true});

db.open(function(err, db) {
  if (err) throw new Error(err);
  else {
  	console.log('mongodb-native connected');
  	db.collection('docs', function(err,collection) {
  		exports.insert = function(doc,callback) {
  			collection.insert(doc,callback);
  		}
  	});
  }
});