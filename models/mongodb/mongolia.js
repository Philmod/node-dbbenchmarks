var Db = require('mongodb/lib/mongodb/db').Db,
    Server = require('mongodb/lib/mongodb/connection').Server,
    db = new Db('blog', new Server('localhost', 27017, {auto_reconnect: true, native_parser: true}));

db.open(function () {
  var User = require('./user.js')(db);

  User.mongo('findOne', {name: 'foo'}, console.log);
  User.mongo({method: 'insert', hooks: false}, {name: 'foo'}, console.log);

  User.findOne({name: 'foo'}, console.log);
  User.insert({name: 'foo'}); // fire and forget
});

