/**
 * Module dependencies.
 */
var models = require('./models')
	, async = require('async');

/**
 * Options.
 */
var nb = 50000;

/**
 * Variables.
 */
var i = 0
	, doc = {}
	, paramsSelect = [];

/**
 * Benchmarks.
 */
setTimeout(function() {

	////////////////////////////////////
	async.series([ // do the benchmarks in serie
    function(callback){ // 1. MONGOOSE
      var start_time = new Date()
			  , j = 0;
			for(var i = 0; i < nb; i++)
			  (function(e){
			  	doc = new models.mongodb.mongoose.Doc(new models.doc);
					doc.save(function (err) {
					  if (err) callback(err,null);
					  else {
					  	if(++j == nb) { // if all the callbacks have been called, calculate the time spent
				        var end_time = new Date();
				        var res = '1. mongoose : ' + (nb / ((end_time.getTime() - start_time.getTime()) / 1000)) + ' qps';
				        console.log(res);
				        callback(null,res);
				      }
					  }
					});
			})(i);
    },
    function(callback){ // 2. MONGODB-NATIVE
      var start_time = new Date()
			  , j = 0;
			for(var i = 0; i < nb; i++)
			  (function(e){
			  	models.mongodb.mongodb.insert(new models.doc, function(err,res) {
					  if (err) callback(err,null);
					  else {
					  	if(++j == nb) {
				        var end_time = new Date();
				        var res = '2. mongodb-native : ' + (nb / ((end_time.getTime() - start_time.getTime()) / 1000)) + ' qps';
				        console.log(res);
				        callback(null,res);
				      }
					  }
					});
			})(i);
    },
    function(callback){ // 3. MONGOSKIN
      var start_time = new Date()
			  , j = 0;
			for(var i = 0; i < nb; i++)
			  (function(e){
			  	models.mongodb.mongoskin.insert(new models.doc, function(err,res) {
					  if (err) callback(err,null);
					  else {
					  	if(++j == nb) {
				        var end_time = new Date();
				        var res = '3. mongoskin : ' + (nb / ((end_time.getTime() - start_time.getTime()) / 1000)) + ' qps';
				        console.log(res);
				        callback(null,res);
				      }
					  }
					});
			})(i);
    },
    function(callback){ // 11. NANO
      /*var start_time = new Date()
			  , j = 0;
			for(var i = 0; i < nb; i++)
			  (function(e){
			  	models.couchdb.nano.insert(new models.doc, function(err,res) {
					  if (err) callback(err,null);
					  else {
					  	if(++j == nb) {
				        var end_time = new Date();
				        var res = '11. nano : ' + (nb / ((end_time.getTime() - start_time.getTime()) / 1000)) + ' qps';
				        console.log(res);
				        callback(null,res);
				      }
					  }
					});
			})(i);*/
			callback(null,null);
    },
    function(callback){ // 21. CASSANDRA-CLIENT : cassandra obj write, different keys
      var start_time = new Date()
			  , j = 0;
			for(var i = 0; i < nb; i++)
			  (function(e){
			  	doc = new models.doc();
					paramsSelect = ['docs','name', doc.name, 'description', doc.description, 'date', doc.date, 'num', doc.num, 'content', doc.content, 'tags', doc.tags, e];
					models.cassandra.cassandraConnection.execute('UPDATE ? SET ?=?, ?=?, ?=?, ?=?, ?=?, ?=? WHERE key=?', paramsSelect, function(err,rows) {
						if (err) callback(err,null);
					  else {
					  	if(++j == nb) {
				        var end_time = new Date();
				        var res = '23. cassandra, different keys : ' + (nb / ((end_time.getTime() - start_time.getTime()) / 1000)) + ' qps';
				        console.log(res);
				        callback(null,res);
				      }
					  }
					});
			})(i);
    },
    function(callback){ // 22. CASSANDRA-CLIENT : cassandra JSON obj write, same key, different columns
      var start_time = new Date()
			  , j = 0;
			for(var i = 0; i < nb; i++)
			  (function(e){
			  	doc = new models.doc();
					paramsSelect = ['docs',e, JSON.stringify(doc), 'sameKey'];
					models.cassandra.cassandraConnection.execute('UPDATE ? SET ?=? WHERE key=?', paramsSelect, function(err,rows) {
						if (err) callback(err,null);
					  else {
					  	if(++j == nb) {
				        var end_time = new Date();
				        var res = '22. cassandra, json, same key : ' + (nb / ((end_time.getTime() - start_time.getTime()) / 1000)) + ' qps';
				        console.log(res);
				        callback(null,res);
				      }
					  }
					});
			})(i);
    },
	],
	function(err, results){
		if (err) console.error('ERROR (async) : ' + err);
		else console.log('%o',results);
	});
	
},1000);

