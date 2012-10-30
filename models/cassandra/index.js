var cassandra = require('cassandra-client')
	, async = require('async');

var System 	= cassandra.System
	, sys 		= new System(process.env.npm_package_config_cassandra_host + ':' + process.env.npm_package_config_cassandra_port);

var cassandraConnection = null; // GLOBAL VARIABLE with the cassandra connection

///// CF Definitions /////
var CfDefs = [ 
	{keyspace: process.env.npm_package_config_DBname, name: 'docs', column_type: 'Standard', comparator_type: 'UTF8Type', default_validation_class: 'UTF8Type', key_validation_class: 'UTF8Type'}
];
//////////////////////////

var ksDef_original = {
	name 								: process.env.npm_package_config_DBname,
	strategy_class			: process.env.npm_package_config_cassandra_keyspace_strategy_class,
	strategy_options 		: {'datacenter1': '1'},
	replication_factor	: process.env.npm_package_config_cassandra_keyspace_replication_factor,
	cf_defs							: [],
	durable_writes			: process.env.npm_package_config_cassandra_keyspace_durable_writes,
}

async.series([

	///// Check if the Keyspace exists, otherwise create it /////
	function(callback) {
		sys.describeKeyspace(process.env.npm_package_config_DBname, function(err, ksDef) {
		  if (err) { // the keyspace does not exist.
		    console.log('Create the non-existing keyspace : ' + process.env.npm_package_config_DBname);
		    // CF definitions
		    for (var i=0; i<CfDefs.length; i++) { 
		    	ksDef_original.cf_defs.push(new cassandra.CfDef(CfDefs[i])); 
		    }
		    var ksDef = new cassandra.KsDef(ksDef_original); // Create ksDef object
		    sys.addKeyspace(ksDef, function(err) {
				  if (err) callback('ERROR creating the keyspace : ' + err, null);
				  else callback(null, 'Keyspace was successfully created');
				});
		  } else { // the keyspace already exists
		    callback(null, 'Keyspace already exists');
		  }
		});
	},
	/////////////////////////////////////////////////////////////

	///// Create the connection /////
	function(callback) {
		var Connection = require('cassandra-client').Connection;
		cassandraConnection = new Connection({
			host 				: process.env.npm_package_config_cassandra_host, 
			port 				: process.env.npm_package_config_cassandra_port,
			keyspace 		: process.env.npm_package_config_DBname,
			user 				: process.env.npm_package_config_cassandra_user,
			pass 				: process.env.npm_package_config_cassandra_password,
			use_bigints : false
		});
		cassandraConnection.connect(function(err) {
			if (err) callback(err,null);
			else {
				callback(null,'Cassandra connected');
			}
		});
		cassandraConnection.on('log', function(level, message, obj) {	
			var s = message.search('is closed'); // 'is closed' in message if need to reconnect
			if (s!=-1) {
				console.log('Cassandra connection lost, trying to reconnect...');
				cassandraConnection.connect(function(err) {
					if (err) console.log('ERROR (cassandraConnection) : ' + err);
					else console.log('Cassandra connected');
				});
			}
		});
	},
	/////////////////////////////////

	],
	function(err,results){
		if (err) console.log('ERROR : ' + err);
		else { 
			console.log('RESULTS : ' + results); 
			console.log('%o',results);
			exports.cassandraConnection = cassandraConnection;
		}
	}
);

