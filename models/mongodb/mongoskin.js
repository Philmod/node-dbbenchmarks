var mongo = require('mongoskin');

var db_skin = mongo.db(process.env.npm_package_config_mongodb_host+':'+process.env.npm_package_config_mongodb_port+'/'+process.env.npm_package_config_DBname+'_mongoskin'+'?auto_reconnect', {safe: true});

exports.insert = function(doc,callback) {
	db_skin.collection('docs').insert(doc,callback);
};
