var mongo = require('mongoskin');
var db = mongo.db('localhost:27017/'+process.env.npm_package_config_DBname+'?auto_reconnect', {safe: true});

exports.insert = function(doc,callback) {
	db.collection('docs',doc,callback);
};
