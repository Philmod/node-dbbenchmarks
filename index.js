/**
 * Module dependencies.
 */
var Benchmark = require('benchmark')
	, suite = new Benchmark.Suite
	, models = require('./models');

setTimeout(function() {
	suite // add tests
		.add('mongoose write', function() {
		  var doc = new models.mongodb.mongoose.Doc(new models.doc);
			doc.save(function (err) {
			  if (err) console.error('ERROR mongoose : ' + err);
			});
		})
		.add('mongodb-native write', function() {
		  models.mongodb.mongodb.insert(new models.doc, function(err,res) {
				if (err) console.error('ERROR mongo native : ' + err);
			});
		})
		// add listeners
		.on('cycle', function(event) {
		  console.log(String(event.target));
		})
		.on('complete', function() {
		  console.log('Fastest is ' + this.filter('fastest').pluck('name'));
		})
		// run async
		.run({ 'async': true });
},200);