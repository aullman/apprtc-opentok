
/**
 * Module dependencies.
 */

var express = require('express')
    , fs = require('fs')
    , config = JSON.parse(fs.readFileSync('./config.json'))
    , routes = require('./routes')(config);

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);
app.get('/s/:sessionId', routes.session);
app.get('/s/:apiKey/:sessionId/:token', routes.session);

app.listen(8080, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
