var mongoose = require('mongoose')
	, db = mongoose.createConnection('192.168.107.125', 'testDB');

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
