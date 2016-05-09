// Main dependencies
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// Routes
var routes = require('./routes/index');
var users = require('./routes/users');
var matches = require('./routes/matches');
// Express Instance
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));

app.use('/', routes);
app.use('/', users);
app.use('/', matches);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


///////////////////////////////////////
//setting up period database checking//
///////////////////////////////////////
//providing database dependencies
var http = require('http');
var pg = require('pg');
var dbKey = require('./env.js');
var request = require('request');
var conString = dbKey();
var API_KEY = '';
if (process.env.NODE_ENV != 'production') {
  var env = require('./env.js');
  API_KEY = process.env.LOL_API_KEY;
} 
//for Debugging only
var counter = 0;

//Updating MatchRequest Table
setInterval(function() {
  counter ++;
  //Expire Match Requests past 15minutes
  pg.connect(conString, function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    
    // (1) cancel matches that originated fom match_requests that has expired
    // (2) refund mlg_points to user from expired match_requests
    // (3) expire match_request older than 15 minutes
    client.query(
      `UPDATE Matches
      SET status = 0, update_time = CURRENT_TIMESTAMP
      WHERE create_time < CURRENT_TIMESTAMP - (15 * INTERVAL '1 MINUTE')
      AND status = 1;

      UPDATE Users
      SET mlg_points = mlg_points + COALESCE((SELECT SUM(matchrequests.bet)
      FROM matchrequests
      WHERE matchrequests.create_time < CURRENT_TIMESTAMP - (15 * INTERVAL '1 MINUTE')
      AND matchrequests.status IN (1,2)
      AND users.id = matchrequests.user_id),0);`,
    function(err, result) {
      done();
      if(err) {
        return console.error('error running query', err);
      }
      client.query(
      `UPDATE matchrequests
      SET status = -1, update_time = CURRENT_TIMESTAMP
      WHERE create_time < CURRENT_TIMESTAMP - (15 * INTERVAL '1 MINUTE')
      AND status IN (1,2);`, 
      function(err, result) {
        done();
        if(err) {
          return console.error('error running query', err);
        }       
        console.log("Expired Match Requests Older Than 15 Minutes" + counter);
      });    
    });
  });
}, 60000); // every 60 seconds

//Updating MatchRequest Table
setInterval(function() {
  // (1) updating for ending matches
  // (2) updating for non-ended Matches
  function updateMatchDB(match,client,done,userNewLastGameId,opponentNewLastGameId,userGamesPlayed,opponentGamesPlayed){
    client.query(
      "UPDATE Matches \
      SET user_total_games_played = (user_total_games_played + " + userGamesPlayed +"), \
      user_last_game_id = " + userNewLastGameId + ", \
      opponent_total_games_played = (opponent_total_games_played + " + opponentGamesPlayed + "), \
      opponent_last_game_id = " + opponentNewLastGameId + ", \
      status = 3, \
      update_time = CURRENT_TIMESTAMP \
      WHERE end_time <= CURRENT_TIMESTAMP \
      AND status = 2 \
      AND id = " + match.id + "; \
      \
      UPDATE Matches \
      SET user_total_games_played = (user_total_games_played + " + userGamesPlayed +"), \
      user_last_game_id = " + userNewLastGameId + ", \
      opponent_total_games_played = (opponent_total_games_played + " + opponentGamesPlayed + "), \
      opponent_last_game_id = " + opponentNewLastGameId + ", \
      update_time = CURRENT_TIMESTAMP \
      WHERE end_time > CURRENT_TIMESTAMP \
      AND status = 2 \
      AND id = " + match.id + ";"
      ,function(err, result) {
      done();
      if(err) {
        return console.error('error running query', err);
      }
      //do stuff here
      console.log("DONE GAMES ENDED FOR MATCH: #" + match.id);
    });
  }

  //API call for 10 recent opponent games
  function getOppData(match,client,done,userNewLastGameId,userOldGameReached,userGamesPlayed){
    var match = match;
    var path = 'https://na.api.pvp.net/api/lol/na/v1.3/game/by-summoner/' + match.opponent_summoner_id + '/recent?api_key=' + API_KEY;
    request.get(path, function(err, response) {
      if (!err) {
        var oppJson = JSON.parse(response.body);
        var opponentGamesPlayed = 0;
        var opponentOldGameReached = false;
        var opponentNewLastGameId = 0;
        for (var oppKey in oppJson){
          if (!oppJson.hasOwnProperty(oppKey)) continue;
          var oppGame = oppJson[oppKey];
          for(var oppAttr in oppGame){
            if(!oppGame.hasOwnProperty(oppAttr)) continue;
            //set new value for last_game_played
            if (opponentNewLastGameId === 0) {
              opponentNewLastGameId = oppGame[0].gameId;
            }
            //set opponentOldGameReached to true if gameId is the same as the last_game_played
            if(oppGame[oppAttr].gameId === match.opponent_last_game_id){
              opponentOldGameReached = true;
            } 
            //update game count if game isnt old and champion is the same
            else if(oppGame[oppAttr].championId === match.champion_id){
              opponentGamesPlayed ++;
            }
          }   
        }

        updateMatchDB(match,client,done,userNewLastGameId,opponentNewLastGameId,userGamesPlayed,opponentGamesPlayed);
      } else {
        console.error(err);
      }
    });
  }

  //API call for 10 recent user games
  function getUserData(match,client,done){
    var match = match;
    var path = 'https://na.api.pvp.net/api/lol/na/v1.3/game/by-summoner/' + match.user_summoner_id + '/recent?api_key=' + API_KEY;
    request.get(path, function(err, response) {
      if (!err) {
        var userJson = JSON.parse(response.body);
        var userGamesPlayed = 0;
        var userOldGameReached = false;
        var userNewLastGameId = 0;
        for (var userKey in userJson){
          if (!userJson.hasOwnProperty(userKey)) continue;
          var userGame = userJson[userKey];
          for(var userAttr in userGame){
            if(!userGame.hasOwnProperty(userAttr)) continue;

            //set new value for last_game_played
            if (userNewLastGameId === 0) {
              userNewLastGameId = userGame[0].gameId;
            }
            //set userOldGameReached to true if gameId is the same as the last_game_played
            if(userGame[userAttr].gameId === match.user_last_game_id){
              userOldGameReached = true;
            } 
            //update game count if game isnt old and champion is the same
            else if(userGame[userAttr].championId === match.champion_id){
              userGamesPlayed ++;
            }
          }   
        }

        getOppData(match,client,done,userNewLastGameId,userOldGameReached,userGamesPlayed);
      } else {
        console.error(err);
      }
    });
  }

  //Return Games that are within the 3 hours interval
  pg.connect(conString, function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    client.query(
      `SELECT m.id, m.user_id user_id, u1.summoner_id user_summoner_id, r.user_id as opponent_id, u2.summoner_id as opponent_summoner_id, r.champion_id, user_last_game_id, opponent_last_game_id, (m.end_time - CURRENT_TIMESTAMP) time_left
      FROM matches m
      JOIN matchrequests r ON m.id = r.match_id
      JOIN users u1 ON m.user_id = u1.id
      JOIN users u2 ON r.user_id = u2.id
      Where m.status = 2
      AND m.user_id != r.user_id
      AND m.update_time <= CURRENT_TIMESTAMP - (180 * INTERVAL '1 MINUTE');`,
    function(err, result) {
      done();
      if(err) {
        return console.error('error running query', err);
      }
      //got results form select, calling API for data to use for update
      for (var key in result.rows){
        if (!result.rows.hasOwnProperty(key)) continue;
        var match = result.rows[key];
        // Recent 10 matches data
        getUserData(match,client,done);
      }   
    });
  });
}, 60000); // every 60 seconds


//Updating MatchRequest Table
setInterval(function() {

  //updates DB
  function updataEndedMatches(match,client,done,userJson,oppJson){
    //need to be placed into Bet Type TAble
    var winnerPayout=0;
    var loserPayout=0;
    if(match.bettype == 0){
      winnerPayout = 1.5*match.bet;
      loserPayout = 0.5*match.bet;
    } else if(match.bettype == 1){
      winnerPayout = 2*match.bet;
      loserPayout = 0*match.bet;
    }

    //checks winner
    var userMPointsGained = userJson.championPoints - match.user_points;
    var oppMPointsGained = oppJson.championPoints - match.opponent_points;
    var userPayout=0;
    var oppPayout=0;
    if(userMPointsGained >= oppMPointsGained){
      userPayout = winnerPayout;
      oppPayout = loserPayout;
    } else if(userMPointsGained < oppMPointsGained){
      userPayout = loserPayout;
      oppPayout = winnerPayout;
    }

    client.query(`
      UPDATE Matches
      SET user_points =`+userJson.championPoints+`,
          opponent_points =`+oppJson.championPoints+`,
          status = 4,
          update_time = CURRENT_TIMESTAMP
      WHERE status = 3
      AND id = `+match.id+`;

      UPDATE Users
      SET mlg_points = mlg_points +`+userPayout+`,
          update_time = CURRENT_TIMESTAMP
      WHERE id =`+match.user_id+`;

      UPDATE Users
      SET mlg_points = mlg_points +`+oppPayout+`,
          update_time = CURRENT_TIMESTAMP
      WHERE id =`+match.opponent_id+`;
      `,function(err, result) {
        done();
      if(err) {
        return console.error('error running query', err);
      }
      //do stuff here
      console.log("DONE PAYING OUT MATCH: #" + match.id);
    });
  }

  //Get Opponent Mastery Data
  function getOppChampMastery(match,client,done,userJson){
    var match = match;
    var path = 'https://na.api.pvp.net/championmastery/location/NA1/player/' + match.opponent_summoner_id + '/champion/' + match.champion_id + '?api_key=' + API_KEY;
    request.get(path, function(err, response) {
    done();
    if (!err) {
      if (response.body == ""){
        response.body = `{
          "playerId": `+match.opponent_summoner_id+`,
          "championId": `+match.champion_id+`,
          "championLevel": 0,
          "championPoints": 0,
          "lastPlayTime": 0,
          "championPointsSinceLastLevel": 0,
          "championPointsUntilNextLevel": 0,
          "chestGranted": false          
        }`;
      }
      var oppJson = JSON.parse(response.body);
      //do stuff
      updataEndedMatches(match,client,done,userJson,oppJson);

      }
    });
  }

  //Get User Mastery Data
  function getUserChampMastery(match,client,done){
    var match = match;
    var path = 'https://na.api.pvp.net/championmastery/location/NA1/player/' + match.user_summoner_id + '/champion/' + match.champion_id + '?api_key=' + API_KEY;
    request.get(path, function(err, response) {
      done();
      if (!err) {
        if (response.body == ""){
          response.body = `{
            "playerId": `+match.user_summoner_id+`,
            "championId": `+match.champion_id+`,
            "championLevel": 0,
            "championPoints": 0,
            "lastPlayTime": 0,
            "championPointsSinceLastLevel": 0,
            "championPointsUntilNextLevel": 0,
            "chestGranted": false          
          }`;
      }
      var userJson = JSON.parse(response.body);

      getOppChampMastery(match,client,done,userJson);
      } else {
        console.error(err);
      }
    });
  }

  //Payout Matches that are over
  pg.connect(conString, function(err,client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    client.query(
      `SELECT m.id, m.user_id user_id, u1.summoner_id user_summoner_id, m.user_points, r.user_id as opponent_id, u2.summoner_id as opponent_summoner_id, m.opponent_points, r.champion_id, r.bet, r.bettype
      FROM matches m
      JOIN matchrequests r ON m.id = r.match_id
      JOIN users u1 ON m.user_id = u1.id
      JOIN users u2 ON r.user_id = u2.id
      WHERE m.status = 3
      AND m.user_id != r.user_id;`,
      function(err, result) {
        done();
        if(err) {
          return console.error('error running query', err);
        }
        //got results form select, calling API for data to use for update
        for (var key in result.rows){
          if (!result.rows.hasOwnProperty(key)) continue;
          var match = result.rows[key];
          // Get Matery Points for user
          getUserChampMastery(match,client,done);
        }   
      });
    });
  }, 60000); // every 60 seconds

///////////////////////////////////////
            //END HERE//
///////////////////////////////////////


module.exports = app;

app.listen(8888, function(){
  console.log('ready on port 8888');
});


