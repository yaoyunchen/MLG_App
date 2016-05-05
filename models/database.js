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
  client.query('CREATE TABLE Users(\
    id SERIAL PRIMARY KEY,\
    username TEXT,\
    email TEXT,\
    user_icon INTEGER,\
    password TEXT,\
    summoner_id INTEGER,\
    summoner_icon INTEGER,\
    verification BOOLEAN,\
    mlg_points INTEGER,\
    mlg_tier INTEGER,\
    logined_today BOOLEAN,\
    friendlist TEXT,\
    create_time TIMESTAMP default current_timestamp,\
    update_time TIMESTAMP default current_timestamp\
    )', function(err, result) {
    done();
    if(err) {
      return console.error('error running query', err);
    }
    console.log("done creating Users Table");
    // client.end();
  });

  //creating MatchRequests table
  client.query('CREATE TABLE MatchRequests(\
    id SERIAL PRIMARY KEY,\
    user_id INTEGER,\
    match_id INTEGER,\
    champion_id INTEGER,\
    match_type TEXT,\
    status INTEGER,\
    create_time TIMESTAMP default current_timestamp,\
    update_time TIMESTAMP default current_timestamp\
    )', function(err, result) {
    done();
    if(err) {
      return console.error('error running query', err);
    }
    console.log("done creating MatchRequests table");
  });

  //creating Matches table
  client.query('CREATE TABLE Matches(\
    id SERIAL PRIMARY KEY,\
    user_id INTEGER,\
    tournament_id INTEGER,\
    user_points INTEGER,\
    user_total_games_played INTEGER,\
    user_last_game_id INTEGER,\
    opponent_points INTEGER,\
    opponent_total_games_played INTEGER,\
    opponent_last_game_id INTEGER,\
    user_likes INTEGER,\
    opponent_likes INTEGER,\
    status INTEGER,\
    pot INTEGER,\
    create_time TIMESTAMP default current_timestamp,\
    update_time TIMESTAMP default current_timestamp,\
    end_time TIMESTAMP\
    )', function(err, result) {
    done();
    if(err) {
      return console.error('error running query', err);
    }
    console.log("done creating Matches table");
  });

  //creating Tournaments table
  client.query('CREATE TABLE Tournaments(\
    id SERIAL PRIMARY KEY,\
    user_id INTEGER,\
    tournament_level INTEGER,\
    last_match_id INTEGER,\
    status INTEGER,\
    create_time TIMESTAMP default current_timestamp,\
    update_time TIMESTAMP default current_timestamp\
    )', function(err, result) {
    done();
    if(err) {
      return console.error('error running query', err);
    }
    console.log("done creating Tournaments table");
  });  

  //creating Bets table
  client.query('CREATE TABLE Bets(\
    id SERIAL PRIMARY KEY,\
    user_id INTEGER,\
    match_id INTEGER,\
    bet_type_id INTEGER,\
    mlgp_bet INTEGER,\
    mlgp_change INTEGER,\
    status INTEGER,\
    create_time TIMESTAMP default current_timestamp,\
    update_time TIMESTAMP default current_timestamp\
    )', function(err, result) {
    done();
    if(err) {
      return console.error('error running query', err);
    }
    console.log("done creating Bets table");
  }); 

  //creating BetTypes table
  client.query('CREATE TABLE BetTypes(\
    id SERIAL PRIMARY KEY,\
    type TEXT,\
    description TEXT,\
    payout INTEGER\
    )', function(err, result) {
    done();
    if(err) {
      return console.error('error running query', err);
    }
    console.log("done creating BetTypes table");
  }); 

});

