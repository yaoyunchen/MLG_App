var express = require('express');
var request = require('request');

var app = require('../app.js');
if (process.env.NODE_ENV != 'production') {
  var env = require('../env.js');
} 
const API_KEY = process.env.LOL_API_KEY;

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});



// DATABASE ROUTES



// LEAGUE API ROUTES
const REGIONS = {
  'br' : 'BR1',
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

  for (key in REGIONS) {
    if (REGIONS.hasOwnProperty(region) === true) {
      platformID = REGIONS.key;
      break;
    }
  }

  return platformID;
};

// Summoner information.
router.get('/search/:region/:summonerName', function(req, res) {
  var path = 'https://' + req.params.region + ".api.pvp.net/api/lol/" + req.params.region + "/v1.4/summoner/by-name/" + req.params.summonerName + "?api_key" = API_KEY;

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

  request.get(path, function(err, res) {
    if (!err) {
      res.json(JSON.parse(response.body));
    } else {
      console.error(err);
    }
  });
});


// Champion mastery by player id and champion id.
router.get('/search/:region/:summonerID/champmasteries/:championID', function(req, res) {

  var PLATFORM_ID = getPlatformID(req.params.region)

  var path = 'https://' + req.params.region + '.api.pvp.net/championmastery/location/' + PLATFORM_ID + '/player/' + req.params.summonerID + '/champion/' + req.params.championID + '?api_key=' + API_KEY;

  request.get(path, function(err, res) {
    if (!err) {
      res.json(JSON.parse(response.body));
    } else {
      console.error(err);
    }
  });
});

// All champion mastery entries.
router.get('/search/:region/:summonerID/champmasteries/', function(req, res) {

  var PLATFORM_ID = getPlatformID(req.params.region)

  var path = 'https://' + req.params.region + '.api.pvp.net/championmastery/location/' + PLATFORM_ID + '/player/' + req.params.summonerID + '/champions?api_key=' + API_KEY;

  request.get(path, function(err, res) {
    if (!err) {
      res.json(JSON.parse(response.body));
    } else {
      console.error(err);
    }
  });
});

// Player's total champion mastery score.
router.get('/search/:region/:summonerID/champmasteries/score', function(req, res) {

  var PLATFORM_ID = getPlatformID(req.params.region)

  var path = 'https://' + req.params.region + '.api.pvp.net/championmastery/location/' + PLATFORM_ID + '/player/' + req.params.summonerID + '/score?api_key=' + API_KEY;

  request.get(path, function(err, res) {
    if (!err) {
      res.json(JSON.parse(response.body));
    } else {
      console.error(err);
    }
  });
});

// Specified number of top champion mastery entries by number of champion points.
router.get('/search/:region/:summonerID/champmasteries/topchampions/:count', function(req, res) {

  var PLATFORM_ID = getPlatformID(req.params.region)

  var path = 'https://' + req.params.region + '.api.pvp.net/championmastery/location/' + PLATFORM_ID + '/player/' + req.params.summonerID + '/topchampions?count=' req.params.count + '&api_key=' + API_KEY;

  request.get(path, function(err, res) {
    if (!err) {
      res.json(JSON.parse(response.body));
    } else {
      console.error(err);
    }
  });
});


module.exports = router;
