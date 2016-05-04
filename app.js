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
app.use('/users', users);

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

module.exports = app;


// //providing database data
// var http = require('http');
// var pg = require('pg');
// var dbKey = require('./env.js');
// var conString = dbKey();

// var checkUsername = function(req, res) {
//   // get a pg client from the connection pool
//   pg.connect(conString, function(err, client, done) {
//     var handleError = function(err) {
//       // no error occurred, continue with the request
//       if(!err) return false;
//       // An error occurred, remove the client from the connection pool.
//       if(client){
//         done(client);
//       }
//       res.writeHead(500, {'content-type': 'text/plain'});
//       res.end('An error occurred');
//       return true;
//     };
//     // handle an error from the connection
//     if(handleError(err)) return;

//     client.query('SELECT * FROM Users', function(err, result) {
//       // handle an error from the query
//       if(handleError(err)) return;
//       done();
//       console.log('The result is: ' + result.rows[0].username + ":" + result.rows[0].email);
//       res.writeHead(200, {'content-type': 'text/plain'});
//       res.end('The result is: ' + result.rows[0].username + ":" + result.rows[0].email);
//     });
//   });
// }
// var server = http.createServer(checkUsername);
// server.listen(3001);


app.listen(8888, function(){
  console.log('ready on port 8888');
});


