var nano = require('nano')('http://localhost:5984');
nano.db.create(process.env.npm_package_config_DBname); // create a new database
var db = nano.db.use(process.env.npm_package_config_DBname);

var DBname = process.env.npm_package_config_DBname;

// clean up the database we created previously
nano.db.destroy(DBname, function() {
 // create a new database
 nano.db.create(DBname, function() {
    // specify the database we are going to use
    var db = nano.use(DBname);
    // and insert a document in it
    exports.insert = function(doc,callback) {
    	db.insert({ crazy: true }, callback);
    };
 });
});