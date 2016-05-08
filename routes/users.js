var express = require('express');
var request = require('request');
var router = express.Router();

//providing database data
var http = require('http');
var pg = require('pg');
var dbKey = require('../env.js');
var conString = dbKey();

//get user data with username
router.get('/db/search/users/:username', function(req, res) {
  var username = req.params.username;
  var query = "SELECT id, username, email, password FROM Users WHERE username='" + username + "'";
  pg.connect(conString, function(err, client, done) {
    var handleError = function(err) {
      // no error occurred, continue with the request
      if(!err) return false;
      // An error occurred, remove the client from the connection pool.
      if(client){
        done(client);
      }
      res.writeHead(500, {'content-type': 'text/plain'});
      res.end('An error occurred');
      return true;
    };
    // handle an error from the connection
    if(handleError(err)) return;

    client.query(query, function(err, result) {
      // handle an error from the query
      if(handleError(err)) return;
      done();
      res.json(result);
    });
  });
})

//get user data with email and password
router.get('/db/search/users/login/:email/:password', function(req, res) {
  var email = req.params.email;
  var password = req.params.password;

  // get a pg client from the connection pool
  pg.connect(conString, function(err, client, done) {
    var handleError = function(err) {
      // no error occurred, continue with the request
      if(!err) return false;
      // An error occurred, remove the client from the connection pool.
      if(client){
        done(client);
      }
      res.writeHead(500, {'content-type': 'text/plain'});
      res.end('An error occurred');
      return true;
    };
    // handle an error from the connection
    if(handleError(err)) return;

    var query = "SELECT id, username, email, password FROM Users WHERE email='" + email + "'"
    client.query(query, function(err, result) {
      // handle an error from the query
      if(handleError(err)) return;
      done();
      res.writeHead(200, {'content-type': 'text/plain'});
      if(result.rows !== undefined){
        var results = JSON.stringify(result.rows[0]);
        res.end(results);
      } else {
        res.end('error');
      }
    });
  });
});

//create match requests
router.post('/db/post/match_request/:username/:champion_id/:champion_key/:bet/:betType/:matchType', function(req, res) {
  var username = req.params.username;
  var champion_id = req.params.champion_id;
  var champion_key = req.params.champion_key;
  var bet = req.params.bet;
  var betType = req.params.betType;
  var matchType = req.params.matchType;
  pg.connect(conString, function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    //creating Users table
    var query = "INSERT INTO MatchRequests (user_id, champion_id, champion_key, match_type, status, bet, bettype) \
    VALUES ('"+ username + "'," + champion_id + "," + champion_key + "," + matchType + ",0," + bet + "," + betType + ");";
    
    client.query(query, function(err, result) {
      done();
      if(err) {
        return console.error('error running query', err);
      }
      console.log("done updating Users Table");
    });
  });
})

//return all active pending games for user
router.get('/db/get/match_request/active/:user_id', function(req, res) {
  var user_id = req.params.user_id;
  var query = "SELECT u1.username as username1, u2.username username2, r1.champion_key, r1.status, (m1.create_time + (15 * INTERVAL '1 MINUTE') - CURRENT_TIMESTAMP) as time_left, r1.bet, r1.bettype \
    FROM MatchRequests r1 \
    JOIN Users u1 on r1.user_id = u1.id, \
    MatchRequests r2 \
    JOIN Matches m1 on r2.match_id = m1.id \
    JOIN Users u2 on r2.user_id = u2.id \
    WHERE r1.user_id = " + user_id + " AND r1.match_id = m1.id AND r1.user_id != r2.user_id AND r1.status = 1;";
  pg.connect(conString, function(err, client, done) {
    var handleError = function(err) {
      // no error occurred, continue with the request
      if(!err) return false;
      // An error occurred, remove the client from the connection pool.
      if(client){
        done(client);
      }
      res.writeHead(500, {'content-type': 'text/plain'});
      res.end('An error occurred');
      return true;
    };
    // handle an error from the connection
    if(handleError(err)) return;

    client.query(query, function(err, result) {
      // handle an error from the query
      if(handleError(err)) return;
      done();
      res.json(result);
    });
  });
})


//create/register users
router.post('/db/post/user/:data', function(req, res) {
  pg.connect(conString, function(err, client, done) {
    var handleError = function(err) {
      // no error occurred, continue with the request
      if(!err) return false;
      // An error occurred, remove the client from the connection pool.
      if(client){
        done(client);
      }
      res.writeHead(500, {'content-type': 'text/plain'});
      res.end('An error occurred');
      return true;
    };
    // handle an error from the connection
    if(handleError(err)) return;

    var columns = '(username, email, user_icon, password, summoner_id, summoner_icon, verification, mlg_points, mlg_tier, logined_today, friendlist) ';
    var query = 'INSERT INTO USERS ' + columns + 'VALUES (' + req.params.data + ') RETURNING id, username;';

    client.query(query, function(err, result) {
      // handle an error from the query
      if(handleError(err)) return;
      done();
      res.json(result);
    });
  })
})


module.exports = router;
