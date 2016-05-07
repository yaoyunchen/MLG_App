var express = require('express');
var request = require('request');
var router = express.Router();

//providing database data
var http = require('http');
var pg = require('pg');
var dbKey = require('../env.js');
var conString = dbKey();


router.get('/db/search/users/:username', function(req, res) {
  var username = req.params.username;
  var query = "SELECT username, email, password FROM Users WHERE username='" + username + "'";
  
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

    client.query("SELECT id, username, email, password FROM Users WHERE email='"+email+"' AND password='"+password+"'", function(err, result) {
      // handle an error from the query
      if(handleError(err)) return;
      done();
      res.json(result);
    });
  });
});

router.post('/db/post/match_request/:username/:champion/:bet/:betType/:matchType', function(req, res) {
  var username = req.params.username;
  var champion = req.params.champion;
  var bet = req.params.bet;
  var betType = req.params.betType;
  var matchType = req.params.matchType;
  pg.connect(conString, function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    //creating Users table
    client.query("INSERT INTO MatchRequests (user_id, champion_id, match_type, status, bet, bettype) \
    VALUES ('"+ username + "'," + champion + "," + matchType + ",0," + bet + "," + betType + ");", function(err, result) {
      done();
      if(err) {
        return console.error('error running query', err);
      }
      console.log("done updating Users Table");
    });
  });
})


module.exports = router;
