# node-dbbenchmarks

  Benchmark of various DB and clients

## Use

```js
npm start
```

## Results
  - Async: true
```js
mongoose write x 8,885 ops/sec +-6.58% (65 runs sampled)
mongodb-native write x 2,511 ops/sec +-7.40% (64 runs sampled)
cassandra obj write, different keys x 3,993 ops/sec +-5.05% (72 runs sampled)
cassandra JSON obj write, same key, different columns x 3,382 ops/sec +-6.89% (64 runs sampled)
```
  - Async: false
```js
mongoose write x 8,516 ops/sec +-7.34% (81 runs sampled)
mongodb-native write x 3,466 ops/sec +-4.44% (81 runs sampled)
cassandra obj write, different keys x 4,180 ops/sec +-10.38% (70 runs sampled)
cassandra JSON obj write, same key, different columns x 4,645 ops/sec +-6.15% (75 runs sampled)
```

I still do not understand why mongoose is faster than mongodb-native...


## Author

Philmod &lt;philippe.modard@gmail.com&gt;