var collections = ['users',
  'bikes',
  'stations',
  'slots',
  'sessions'
];

var db = require("mongojs").connect('mongodb://localhost:27017/kiwi', collections);

var Promise = require('./promise');
var _ = require('underscore');

//the MongoDB connection
var connectionPromise;

exports.collections = collections;

exports.findOne = function(collection) {
  var args = _.tail(arguments, 1) || [];
  return query(collection, 'findOne', args);
};

exports.find = function(collection) {
  var args = _.tail(arguments, 1) || [];
  return query(collection, 'find', args);
};

exports.remove = function(collection) {
  var args = _.tail(arguments, 1) || [];
  return query(collection, 'remove', args);
};

exports.insert = function(collection) {
  var args = _.tail(arguments, 1) || [];
  return query(collection, 'insert', args);
};

function query(colName, method, args) {
  var collection = db[colName];
  var promise = Promise.withCallback();
  args = args || [];
  args.push(promise.cb);

  collection[method].apply(collection, args);

  return promise;
};