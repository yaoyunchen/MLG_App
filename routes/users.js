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

//get user data with email and password
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

//create match requests
router.post('/db/post/match_request/:user_id/:match_id/:champion_id/:champion_key/:bet/:betType/:matchType/:status', function(req, res) {
  var user_id = req.params.user_id;
  var match_id = req.params.match_id;
  var champion_id = req.params.champion_id;
  var champion_key = req.params.champion_key;
  var bet = req.params.bet;
  var betType = req.params.betType;
  var matchType = req.params.matchType;
  var status = req.params.status;
  pg.connect(conString, function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    //creating match request
    var query = "INSERT INTO MatchRequests (user_id, match_id, champion_id, champion_key, match_type, status, bet, bettype) VALUES ('"+ user_id + "'," + match_id + "," + champion_id + ",'" + champion_key + "'," + matchType + "," + status + "," + bet + "," + betType + ");";
    
    client.query(query, function(err, result) {
      done();
      if(err) {
        return console.error('error running query', err);
      }
      console.log("done creating match request");
    });
  });
})

//create match
router.post('/db/post/match/:user_id/:tournament_id/:user_points/:user_total_games_played/:user_last_game_id/:opponent_points/:opponent_total_games_played/:opponent_last_game_id/:user_likes/:opponent_likes/:status/:pot', function(req, res) {
  var user_id = req.params.user_id;
  var tournament_id = req.params.tournament_id; 
  var user_points = req.params.user_points; 
  var user_total_games_played = req.params.user_total_games_played; 
  var user_last_game_id = req.params.user_last_game_id; 
  var opponent_points = req.params.opponent_points; 
  var opponent_total_games_played = req.params.opponent_total_games_played; 
  var opponent_last_game_id = req.params.opponent_last_game_id; 
  var user_likes = req.params.user_likes; 
  var opponent_likes = req.params.opponent_likes; 
  var status = req.params.status; 
  var pot = req.params.pot;

  pg.connect(conString, function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    //creating match
    var query = "INSERT INTO Matches (user_id, tournament_id, user_points, user_total_games_played, user_last_game_id, opponent_points, opponent_total_games_played, opponent_last_game_id, user_likes, opponent_likes, status, pot, end_time) VALUES ("+user_id+","+tournament_id+","+user_points+","+user_total_games_played+","+user_last_game_id+","+opponent_points+","+opponent_total_games_played+","+opponent_last_game_id+","+user_likes+","+opponent_likes+","+status+","+pot+",CURRENT_TIMESTAMP + (1440 * INTERVAL '1 MINUTE')) RETURNING id;";
      client.query(query, function(err, result) {
      done();
      if(err) {
        return console.error('error running query', err);
      }
      console.log("done creating match");
      res.json(result);
    });
  });
})

//return all active pending games for user
router.get('/db/get/match_request/active/:user_id', function(req, res) {
  var user_id = req.params.user_id;
  var query = "SELECT r1.id id, u1.username username1, u2.username username2, r1.champion_key, r1.status, (m1.create_time + (15 * INTERVAL '1 MINUTE') - CURRENT_TIMESTAMP) as time_left, r1.bet, r1.bettype \
    FROM MatchRequests r1 \
    JOIN Users u1 on r1.user_id = u1.id, \
    MatchRequests r2 \
    JOIN Matches m1 on r2.match_id = m1.id \
    JOIN Users u2 on r2.user_id = u2.id \
    WHERE r1.user_id = " + user_id + " AND r1.match_id = m1.id AND r1.user_id != r2.user_id AND r1.status > 0 AND  r2.status <> r1.status;;";
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

// Get all active matches for users.
router.get('/db/get/match/current/:user_id', function(req, res) {
  var user_id = req.params.user_id;
  var query = `
    SELECT 
      r1.id id, u1.username username1, u2.username username2, r1.champion_key, r1.status, r1.bet, r1.bettype, (m1.create_time + (15 * INTERVAL '1 MINUTE') - CURRENT_TIMESTAMP) as time_left, m1.user_points, m1.user_total_games_played, m1.user_likes, m1.pot
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
    var query = 'INSERT INTO USERS ' + columns + 'VALUES (' + req.params.data + ') RETURNING id, username, mlg_points;';

    client.query(query, function(err, result) {
      // handle an error from the query
      if(handleError(err)) return;
      done();
      res.json(result);
    });
  })
})


module.exports = router;
