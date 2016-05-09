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
  client.query(`
    ALTER TABLE Matches ALTER COLUMN user_last_game_id TYPE BIGINT;
    ALTER TABLE Matches ALTER COLUMN opponent_last_game_id TYPE BIGINT;
    ALTER TABLE Matches ALTER COLUMN user_id TYPE BIGINT;
    `, function(err, result) {
    done();
    if(err) {
      return console.error('error running query', err);
    }
    console.log("done altering datatypes to bigint");
  });
});

