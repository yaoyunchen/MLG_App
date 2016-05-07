var express = require('express');
var request = require('request');

// var app = require('../app.js');

var API_KEY = '';
if (process.env.NODE_ENV != 'production') {
  var env = require('../env.js');
  API_KEY = process.env.LOL_API_KEY;
} 



var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});


// LEAGUE API ROUTES
const REGIONS = {
  'br': 'BR1',
  'eune': 'EUN1',
  'euw': 'EUW1',
  'jp': 'JP1',
  'kr': 'KR',
  'lan': 'LA1',
  'las': 'LA2',
  'na': 'NA1',
  'oce': 'OC1',
  'ru': 'RU',
  'tr': 'TR1' 
};

function getPlatformID(region) {
  var platformID = '';

  for (var key in REGIONS) {
    if (REGIONS.hasOwnProperty(region) === true) {
      platformID = REGIONS.key;
      break;
    }
  }

  return platformID;
}

// Summoner information.
router.get('/search/:region/:summonerName', function(req, res) {

  var path = 'https://' + req.params.region + '.api.pvp.net/api/lol/' + req.params.region + '/v1.4/summoner/by-name/' + req.params.summonerName + '?api_key=' + API_KEY;
  console.log(path)
  request.get(path, function(err, response) {
    if (!err) {
      res.json(JSON.parse(response.body));
    } else {
      console.error(err);
    }
  });
});

// Recent matches.
router.get('/search/:region/:summonerID/recent', function(req, res) {
  var path = 'https://' + req.params.region + '.api.pvp.net/api/lol/' + req.params.region + '/v1.3/game/by-summoner/' + req.params.summonerID + '/recent?api_key=' + API_KEY;

  request.get(path, function(err, response) {
    if (!err) {
      res.json(JSON.parse(response.body));
    } else {
      console.error(err);
    }
  });
});


// Champion mastery by player id and champion id.
router.get('/search/:region/:summonerID/champmasteries/:championID', function(req, res) {

  var PLATFORM_ID = getPlatformID(req.params.region);

  var path = 'https://' + req.params.region + '.api.pvp.net/championmastery/location/' + PLATFORM_ID + '/player/' + req.params.summonerID + '/champion/' + req.params.championID + '?api_key=' + API_KEY;

  request.get(path, function(err, response) {
    if (!err) {
      res.json(JSON.parse(response.body));
    } else {
      console.error(err);
    }
  });
});

// All champion mastery entries.
router.get('/search/:region/:summonerID/champmasteries/', function(req, res) {

  var PLATFORM_ID = getPlatformID(req.params.region);

  var path = 'https://' + req.params.region + '.api.pvp.net/championmastery/location/' + PLATFORM_ID + '/player/' + req.params.summonerID + '/champions?api_key=' + API_KEY;

  request.get(path, function(err, response) {
    if (!err) {
      res.json(JSON.parse(response.body));
    } else {
      console.error(err);
    }
  });
});

// Player's total champion mastery score.
router.get('/search/:region/:summonerID/champmasteries/score', function(req, res) {

  var PLATFORM_ID = getPlatformID(req.params.region);

  var path = 'https://' + req.params.region + '.api.pvp.net/championmastery/location/' + PLATFORM_ID + '/player/' + req.params.summonerID + '/score?api_key=' + API_KEY;

  request.get(path, function(err, response) {
    if (!err) {
      res.json(JSON.parse(response.body));
    } else {
      console.error(err);
    }
  });
});

// Specified number of top champion mastery entries by number of champion points.
router.get('/search/:region/:summonerID/champmasteries/topchampions/:count', function(req, res) {

  var PLATFORM_ID = getPlatformID(req.params.region);

  var path = 'https://' + req.params.region + '.api.pvp.net/championmastery/location/' + PLATFORM_ID + '/player/' + req.params.summonerID + '/topchampions?count=' + req.params.count + '&api_key=' + API_KEY;

  request.get(path, function(err, response) {
    if (!err) {
      res.json(JSON.parse(response.body));
    } else {
      console.error(err);
    }
  });
});

// Specified number of top champion mastery entries by number of champion points.
router.get('/search/allchampions', function(req, res) {

  var championName = getPlatformID(req.params.champion);

  var path = 'https://global.api.pvp.net/api/lol/static-data/na/v1.2/champion?champData=image&api_key=' + API_KEY;

  request.get(path, function(err, response) {
    if (!err) {
      res.json(JSON.parse(response.body));
    } else {
      console.error(err);
    }
  });
});

module.exports = router;

/* SQL QUERY LINES
=============[ CREATING NEW ROWS ]=============
// registering Users (need to provide values)
  "INSERT INTO Users (username, email, user_icon, password, summoner_id, summoner_icon, verification, mlg_points, mlg_tier, logined_today, friendlist) VALUES ();"

// creating MatchRequests (need to provide values)
  "INSERT INTO MatchRequests (user_id, match_id, champion_id, match_type, accepted) VALUES ();"
  
// creating Matches (need to provide values)
  "INSERT INTO Matches (user_id, tournament_id, user_points, user_total_games_played, user_last_game_id, opponent_points, opponent_total_games_played, opponent_last_game_id, user_likes, opponent_likes, status, pot, end_time) VALUES ();"

// creating Bets (need to provide values) 
  "INSERT INTO Bets (user_id, match_id, bet_type_id, mlgp_bet, mlgp_change, status) VALUES ();"

// creating BetTypes (need to provide values)
  "INSERT INTO Bets (type, description, payout) VALUES ();"

=============[ MATCH REQUESTS ]=============
// delete matchrequests > 15minutes (run check every minute)
  "DELETE FROM MatchRequests WHERE create_time >= current_time - (15 * interval '1 minute');"

// retrieving all matchrequests for individual user
  var user_id;
  "SELECT * FROM MatchRequests WHERE user_id=" + user_id + ";"



=============[ MATCHES ]=============
// find matches id to update every 3hours (run check every minute)
  "SELECT id FROM Matches WHERE create_time >= current_time - (181 * interval '1 minute') AND create_time <= current_time - (179 * interval '1 minute');"

// updating match every 3hours (need variables new points and game id value)
  var id, user_points, user_total_games_played, user_last_game_id, opponent_points, opponent_total_games_played, opponent_last_game_id, status, update_time;
  "UPDATE Matches \
  SET user_points=" + user_points + ", \
      user_total_games_played=" + user_total_games_played + ", \
      user_last_game_id=" +  user_last_game_id + ", \
      opponent_points=" + opponent_points + ", \
      opponent_total_games_played=" + opponent_total_games_played + ", \
      opponent_last_game_id=" + opponent_last_game_id + ", \
      status=" + status + ", \
      update_time=" + update_time + " \
  WHERE id=" + id + ";"

// retrieving all matches for individual user
  var user_id;
  "SELECT * FROM Matches \
  JOIN MatchRequest ON Matches.id = MatchRequests.match_id \
  WHERE MatchRequests.id=" + user_id + ";"


*/







