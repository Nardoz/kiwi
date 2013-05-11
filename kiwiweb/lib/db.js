var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var Promise = require('./promise');
var _ = require('underscore');

//the MongoDB connection
var connectionPromise;

exports.findOne = function(collection) {
  var args = _.tail(arguments, 1) || [];
  return query(collection, 'findOne', args);
};

exports.find = function(collection) {
  var args = _.tail(arguments, 1) || [];
  return query(collection, 'findOne', args);
};

exports.remove = function(collection) {
  var args = _.tail(arguments, 1) || [];
  return query(collection, 'remove', args);
};

exports.insert = function(collection) {
  var args = _.tail(arguments, 1) || [];
  return query(collection, 'insert', args);
};

function getConnection() {
  //if already we have a connection, don't connect to database again
  if (connectionPromise) {
    return connectionPromise;
  }

  var db = new Db('kiwi', new Server("127.0.0.1", Connection.DEFAULT_PORT, { auto_reconnect: true }));
  
  connectionPromise = Promise.asPromise(db, db.open)
    .then(function(dbConnection) {
      return dbConnection;
    })
    .fail(function(error) {
      throw new Error(error);
    });

    return connectionPromise;
};

function query(colName, method, args) {
  return getConnection()
    .then(function(client) {
      return Promise.asPromise(client, client.collection, colName);
    })
    .then(function(collection) {
      var promise = Promise.withCallback();
      args = args || [];
      args.push(promise.cb);

      collection[method].apply(collection, args);

      return promise;
    });
};