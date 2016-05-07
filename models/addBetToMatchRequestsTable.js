/* jshint multistr: true */
"use strict";

var pg = require('pg');
var dbKey = require('../env.js');
var conString = dbKey();

pg.connect(conString, function(err, client, done) {
  if(err) {
    return console.error('error fetching client from pool', err);
  }
  //creating Users table
  client.query("ALTER TABLE MatchRequests ADD COLUMN bet INTEGER;", function(err, result) {
    done();
    if(err) {
      return console.error('error running query', err);
    }
    console.log("done adding bet to MatchRequests Table");
  });
});

