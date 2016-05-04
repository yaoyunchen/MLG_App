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



//providing database data
var http = require('http');
var pg = require('pg');
var dbKey = require('../env.js');
var conString = dbKey();

router.get('/searchdatabase/:username/:password', function(req, res) {
  var username = req.params.username;
  var password = req.params.password;
  console.log('looking in database for: ' + username + " with " + password + " as password");
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

    client.query('SELECT * FROM Users', function(err, result) {
      // handle an error from the query
      if(handleError(err)) return;
      done();
      console.log('The result is: ' + result.rows[0].username + ":" + result.rows[0].email);
      res.writeHead(200, {'content-type': 'text/plain'});
      res.end('The result is: ' + result.rows[0].username + ":" + result.rows[0].email);
    });
  });
});

module.exports = router;
