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
//providing database data
var http = require('http');
var pg = require('pg');
var dbKey = require('./env.js');
var conString = dbKey();
//for debugging only
var counter = 0;
setInterval(function() {
  //for debugging only
  counter ++;
  console.log('the counter is: ' + counter);

  //code
  var username = counter;
  var champion = 1;
  var bet = 1;
  var betType = 1;
  var matchType = 1;
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

}, 600000); // every 5 seconds

///////////////////////////////////////
            //END HERE//
///////////////////////////////////////


module.exports = app;

app.listen(8888, function(){
  console.log('ready on port 8888');
});


