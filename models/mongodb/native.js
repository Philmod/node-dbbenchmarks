var mongo = require('mongodb')
  , Db = mongo.Db;

var server = new mongo.Server(process.env.npm_package_config_mongodb_host, parseInt(process.env.npm_package_config_mongodb_port), {auto_reconnect: true})
  , db = new Db(process.env.npm_package_config_DBname+'_native', server, {safe: true});

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