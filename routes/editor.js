var phantom = require('../libs/phantom-scrapper');
var jsdom = require("jsdom").jsdom;


exports.index = function(req, res){
  res.render('index', {  });
};

exports.editor = function(req, res){
	var url = req.query.url;
	res.render('editor', { url : url });
}

exports.share = function(req, res){
	
	var id = req.params.id;
	var app = req.app, db  = app.get('db');
	
	if(!id) return false;

	var inject = "<script id=purify-injection type=text/javascript src=http://localhost:3000/js/libs/jquery.js></script>" ;
	
	db.query("SELECT * FROM shares where id = ? limit 0 , 1", id,  function(err, rows) {

        if(err) return false;

        if(rows && rows[0]){

        	var query = JSON.parse(rows[0].items).join( " , ");

        	inject += "<script type=text/javascript>" +
				"$('" + query + "').css({visibility:'hidden'});" +
			"</script>" ;
			var url  = rows[0].url;
			var host = require('url').parse(url);
			var base = '<base href="http://' + host.host + '" >';


			require('http').get(url, function(resp){
				
				resp.on('data', function(chunk){
					res.write(
						chunk.toString()
							 .replace("<head>" ,  "<head>"  + base)
							 .replace("</body>" , "</body>" + inject) 
					);
			  	}).on('end', function(chunk){
					res.end();
		  		});

			}).on("error", function(e){
		  		console.log("Got error: " + e.message);
			});
    	}
    });
}

exports.sharePost = function(req, res){
	var url   = req.body.url , 
		items = JSON.stringify(req.body.items);
	
	var app = req.app, db  = app.get('db');

    db.query("INSERT INTO shares (url, items) VALUES (? , ?) ", [url , items] ,  function(err, info) {

        if(err) return false;
        res.send(JSON.stringify({id : info.insertId}));
       
    });
}

exports.proxy = function(req, res){

	var url    = req.query.url;
	var inject = "<script id=purify-injection type=text/javascript src='http://localhost:3000/js/inject.js'></script>" + 
				 "<link rel=stylesheet type=text/css href='http://localhost:3000/stylesheets/inject.css'>";

	var host = require('url').parse(url);
	var base = '<base href="http://' + host.host + '" >';


	require('http').get(url, function(resp){
		
		resp.on('data', function(chunk){
			res.write(
				chunk.toString()
					 .replace("<head>" ,  "<head>"  + base)
					 .replace("</body>" , "</body>" + inject) 
			);
	  	}).on('end', function(chunk){
			res.end();
  		});

	}).on("error", function(e){
  		console.log("Got error: " + e.message);
	});
	
};


function doInjection(html, inject){
	return html.replace("</body>", "</body>" + inject);
}