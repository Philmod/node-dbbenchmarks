var mongo = require('mongoskin');
var db = mongo.db('localhost:27017/test?auto_reconnect');

db.createCollection(...);
db.collection('user').ensureIndex([['username', 1]], true, function (err, replies) {});
db.collection('posts').hint = 'slug';
db.collection('posts').findOne({slug: 'whats-up'}, function (err, post) {
  // do something
});

db.collection('posts').find().toArray(function (err, posts) {
  // do something
});