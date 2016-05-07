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

    client.query("SELECT username, email, password FROM Users WHERE email='"+email+"'", function(err, result) {
      // handle an error from the query
      if(handleError(err)) return;
      done();
      res.writeHead(200, {'content-type': 'text/plain'});
      res.end('The result is: ' + result.rows[0].username + ":" + result.rows[0].email);
    });
  });
});



module.exports = router;
