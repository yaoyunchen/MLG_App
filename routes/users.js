var express = require('express');
var request = require('request');
var router = express.Router();

//providing database data
var http = require('http');
var pg = require('pg');
var dbKey = require('../env.js');
var conString = dbKey();

// Create users.
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
    var query = 'INSERT INTO USERS ' + columns + 'VALUES (' + req.params.data + ') RETURNING id, username, mlg_points;';

    client.query(query, function(err, result) {
      // handle an error from the query
      if(handleError(err)) return;
      done();
      res.json(result);
    });
  })
})

// Get user data from username.
router.get('/db/search/users/:username', function(req, res) {
  var username = req.params.username;
  var query = "SELECT id, username, email, mlg_points, summoner_id FROM Users WHERE username='" + username + "'";
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

// Get user data from email.
router.get('/db/search/users/email/:email', function(req, res) {
  var query = "SELECT username, id, email FROM Users WHERE email='" + req.params.email + "';";

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

// Get user data for login.
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

    var query = "SELECT id, username, email, password, mlg_points FROM Users WHERE email='" + email + "'"
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


// Get all active matches for users.
router.get('/db/get/match/current/:user_id', function(req, res) {
  var user_id = req.params.user_id;
  var query = `
    SELECT 
      r1.id id, u1.username username1, u2.username username2, r1.champion_key, r1.status, r1.bet, r1.bettype, (m1.create_time + (15 * INTERVAL '1 MINUTE') - CURRENT_TIMESTAMP) as time_left, m1.user_points, m1.user_total_games_played, m1.user_likes, m1.pot, m1.id match_id
    FROM MatchRequests r1 
    JOIN Users u1 ON r1.user_id = u1.id, 
    MatchRequests r2 
    JOIN Matches m1 ON r2.match_id = m1.id 
    JOIN Users u2 ON r2.user_id = u2.id 
    WHERE r1.user_id = ` + user_id + ` AND r1.match_id = m1.id AND r1.user_id != r2.user_id AND m1.status = 2 
      AND (r2.status = 2 AND r1.status = 2);`;
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

//return all active pending games for user
router.get('/db/get/match_request/active/:user_id', function(req, res) {
  var user_id = req.params.user_id;
  var query = "SELECT r1.id id, u1.username username1, u1.id user_id1, u2.username username2, u2.id user_id2, r1.champion_key, r1.status, (m1.create_time + (15 * INTERVAL '1 MINUTE') - CURRENT_TIMESTAMP) as time_left, r1.bet, r1.bettype, m1.id match_id\
    FROM MatchRequests r1 \
    JOIN Users u1 on r1.user_id = u1.id, \
    MatchRequests r2 \
    JOIN Matches m1 on r2.match_id = m1.id \
    JOIN Users u2 on r2.user_id = u2.id \
    WHERE r1.user_id = " + user_id + " AND r1.match_id = m1.id AND r1.user_id != r2.user_id AND r1.status > 0 AND  r2.status <> r1.status;";
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

// Update user's mlg points.
router.post('/db/post/user/:user_id/:mlg_points', function(req, res) {
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

    var query = `
      UPDATE Users
      SET mlg_points = ` + req.params.mlg_points + `
      WHERE id = ` + req.params.user_id + `;
      COMMIT;
    `;

    client.query(query, function(err, result) {
      // handle an error from the query
      if(handleError(err)) return;
      done();
      res.json(result);
    });
  })
})



module.exports = router;
