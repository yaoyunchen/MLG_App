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
  client.query("INSERT INTO Users (username, email, user_icon, password, summoner_id, summoner_icon, verification, mlg_points, mlg_tier, logined_today) \
    VALUES ('zelthrox', 'kwan.andy@hotmail.com', 10, 'password', 19148112, 10, true, 1000, 1, true);", function(err, result) {
    done();
    if(err) {
      return console.error('error running query', err);
    }
    console.log("done updating Users Table");
  });
});

