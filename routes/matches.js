var express = require('express');
var request = require('request');
var router = express.Router();

//providing database data
var http = require('http');
var pg = require('pg');
var dbKey = require('../env.js');
var conString = dbKey();


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

// Get match requests related to a match.
router.get('/db/matchrequests/:match_id', function(req, res) {
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
      SELECT * FROM MatchRequests WHERE match_id = ` + req.params.match_id +`
    `;
    client.query(query, function(err, result) {
      if(handleError(err)) return;
      done();
      res.json(result);
    });
  })
})

// Accept match requests.
router.post('/db/matches/accept/:match_id/:request_id/:user_id/:mlg_points', function(req, res) {
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
      BEGIN;
      UPDATE Matches
      SET user_points = 0, user_total_games_played = 0,
      opponent_points = 0, opponent_total_games_played = 0, user_likes = 0, opponent_likes = 0, status = 2, update_time = current_timestamp
      WHERE id = ` + req.params.match_id +`;
      
      UPDATE MatchRequests
      SET status = 2, update_time = current_timestamp
      WHERE id = ` + req.params.request_id + `;

      UPDATE Users
      SET mlg_points = ` + req.params.mlg_points + `
      WHERE id = ` + req.params.user_id + `;
      COMMIT;
    `;
    console.log(query)
    client.query(query, function(err, result) {
      // handle an error from the query
      if(handleError(err)) return;
      done();
      res.json(result);
    });
  })

})



// Cancel match requests.





module.exports = router;
