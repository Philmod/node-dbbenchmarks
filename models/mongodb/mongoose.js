var mongoose = require('mongoose')
	, db = mongoose.createConnection(process.env.npm_package_config_mongodb_host, process.env.npm_package_config_DBname); // 192.168.107.125

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('mongoose connected');
});

var docSchema = mongoose.Schema({ 
		name: String
	, description: String
	, date: Date
	, num: Number
	, content: String
	, tags: [String]
});
exports.Doc = db.model('Doc', docSchema);
