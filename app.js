var http = require('http'),
    path = require('path'),
    methods = require('methods'),
    express = require('express'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    cors = require('cors'),
    passport = require('passport'),
    errorhandler = require('errorhandler'),
    mongoose = require('mongoose');

// Create global app object
var app = express();

app.use(cors());

// Normal express config defaults
app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(require('method-override')());
app.use(session({ secret: 'conduit', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false  }));
app.use(errorhandler());


mongoose.connect('mongodb://localhost/conduit');
mongoose.set('debug', true);

require('./models/User');
require('./config/passport');

app.use(require('./routes'));

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/// ERROR HANDLER
app.use(function(err, req, res, next) {
  console.log(err.stack);

  res.status(err.status || 500);

  res.json({'errors': {
    message: err.message,
    error: err
  }});
});

// Start The Server
var server = app.listen( process.env.PORT || 3000, function(){
  console.log('Listening on port ' + server.address().port);
});
