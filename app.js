
/**
 * Module dependencies.
 */

var express = require('express')
  , editor = require('./routes/editor')
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

var mysql = require('mysql');
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'purified'
});
connection.connect();
app.set('db', connection);


app.get('/',          editor.index);
app.get('/editor',    editor.editor);
app.get('/proxy',     editor.proxy);

app.get('/purify/:url/:query', editor.purify);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});