
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');


var layouts   = require('express3-ejs-layout')
  , validator = require('express-validator');


var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  
  app.set('layout', 'layout'); // defaults to 'layout'
  app.use(layouts);
  app.use(validator);
     
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.post('/', routes.editor);


app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});



//http://robdodson.me/blog/2012/05/31/how-to-use-ejs-in-express/
//https://npmjs.org/package/express3-ejs-layout
//http://robdodson.me/blog/2012/09/03/javascript-design-patterns-factory/
//https://github.com/visionmedia/ejs#includes