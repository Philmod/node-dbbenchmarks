# node-dbbenchmarks

  Benchmark of various DB and clients

## Use
Change the databases options in ```package.json```, then:

```js
npm start
```

## Results
I only did simple insert benchmark.
The two databases are on two VMmachine with 512Mb RAM, the client is on my own machine.
```
mongoose:       1518 ins/sec
mongodb-native: 2244 ins/sec
mongoskin:      1944 ins/sec
cassandra 1:    990  ins/sec (one row by document, one column for each data)
cassandra 2:    1638 ins/sec (only one big row, one document by column (JSON format))
```
I notice than the Cassandra machine reachs the CPU limit, and uses a lot of RAM (already without data, because of JAVA machine), it's why the results are bad.  I have to try to modify the config.

Mongoose uses more RAM on the client machine, but then less RAM is used on the DB machine.

## ToDo
  - CouchDB (clients: nano,cradle)
  - Other queries: select, update, ...
  - Do the tests on big machines in order to have the correct number 'ins/sec', and not be blocked with the RAM capability

## Author

Philmod &lt;philippe.modard@gmail.com&gt;