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
// providing database data
// var http = require('http');
// var pg = require('pg');
// var dbKey = require('./env.js');
// var conString = dbKey();
// //for debugging only
// var counter = 0;
// setInterval(function() {
//   //for debugging only
//   counter ++;
//   console.log('the counter is: ' + counter);

//   //code
//   var username = counter;
//   var champion = 1;
//   var bet = 1;
//   var betType = 1;
//   var matchType = 1;
//   pg.connect(conString, function(err, client, done) {
//     if(err) {
//       return console.error('error fetching client from pool', err);
//     }
//     //creating Users table
//     var query = "INSERT INTO MatchRequests (user_id, champion_id, match_type, status, bet, bettype) \
//     VALUES ('"+ username + "'," + champion + "," + matchType + ",0," + bet + "," + betType + ");";
    
//     client.query(query, function(err, result) {
//       done();
//       if(err) {
//         return console.error('error running query', err);
//       }
//       console.log("done updating Users Table x" + counter);
//     });
//   });

// }, 5000); // every 5 seconds

///////////////////////////////////////
            //END HERE//
///////////////////////////////////////


module.exports = app;

app.listen(8888, function(){
  console.log('ready on port 8888');
});


