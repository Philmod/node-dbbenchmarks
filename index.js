/**
 * Module dependencies.
 */
var Benchmark = require('benchmark')
	, suite = new Benchmark.Suite
	, models = require('./models')
	, async = require('async');

/**
 * Options.
 */
var options = {
		'async': true
	,	'maxTime': 5 //[secs]
	, 'defer': true
};
var nb = 1000;

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
			  	models.mongodb.mongodb.insert(new models.doc, function(err,res) {
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
      var start_time = new Date()
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
			})(i);
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
	


	////////////////////////////////////

	/*var bench = new Benchmark('foo', {

	  // a flag to indicate the benchmark is deferred
	  'defer': true,

	  // benchmark test function
	  'fn': function(deferred) {
	  	doc = new models.mongodb.mongoose.Doc(new models.doc);
		  console.log('1 : start');
			doc.save(function (err) {
			  if (err) console.error('ERROR mongoose : ' + err);
			  else { console.log('1 : stop'); }
			  deferred.resolve(); // call resolve() when the deferred test is finished
			});
	  }
	})
	.on('complete', function() {
	  console.log('Result : ' + this);
	})
	.run();*/

	////////////////////////////////////

	/*suite // add tests
		.add('mongoose write', function(deferred) {
		  doc = new models.mongodb.mongoose.Doc(new models.doc);
		  console.log('1 : start');
			doc.save(function (err) {
			  if (err) console.error('ERROR mongoose : ' + err);
			  else { console.log('1 : stop'); }
			  deferred.resolve();
			});
		})
		.add('mongodb-native write', function(deferred) {
			console.log('2 : start');
		  models.mongodb.mongodb.insert(new models.doc, function(err,res) {
				if (err) console.error('ERROR mongo native : ' + err);
				else { console.log('2 : stop'); }
				deferred.resolve();
			});
		})
		.add('cassandra obj write, different keys', function() {
		  doc = new models.doc();
			paramsSelect = ['docs','name', doc.name, 'description', doc.description, 'date', doc.date, 'num', doc.num, 'content', doc.content, 'tags', doc.tags, ++i];
			models.cassandra.cassandraConnection.execute('UPDATE ? SET ?=?, ?=?, ?=?, ?=?, ?=?, ?=? WHERE key=?', paramsSelect, function(err,rows) {
				if (err) console.error('Cassandra error : ' + err);
				else return;
			});
		})
		.add('cassandra JSON obj write, same key, different columns', function() {
		  doc = new models.doc();
			paramsSelect = ['docs',++i, JSON.stringify(doc), 'sameKey'];
			models.cassandra.cassandraConnection.execute('UPDATE ? SET ?=? WHERE key=?', paramsSelect, function(err,rows) {
				if (err) console.error('Cassandra error : ' + err);
				else return;
			});
		})
		// add listeners
		.on('cycle', function(event) {
		  console.log(String(event.target));
		})
		.on('error', function(err) {
			console.error('ERROR : ' + err);
		})
		.on('complete', function() {
		  console.log('Fastest is ' + this.filter('fastest').pluck('name'));
		})
		// run async
		.run(options);*/

		////////////////////////////////////

},1000);

