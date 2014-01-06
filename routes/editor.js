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

	var inject = "<script id=purify-injection type=text/javascript src=/js/libs/jquery.js></script>" ;
	
	db.query("SELECT * FROM shares where id = ? limit 0 , 1", id,  function(err, rows) {

        if(err) return false;

        if(rows && rows[0]){

        	var query = JSON.parse(rows[0].items).join( " , ");

        	inject += "<script type=text/javascript>" +
				"$('" + query + "').css({visibility:'hidden'});" +
			"</script>" ;
	

	        phantom.scrape(rows[0].url, function(html){
	        	html = doInjection(html, inject);
				res.send(html);
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
	var inject = "<script id=purify-injection type=text/javascript src=/js/inject.js></script>" + 
				 "<link rel=stylesheet type=text/css href=/stylesheets/inject.css>";

	phantom.scrape(url, function(html){
		html = doInjection(html, inject);
		res.send(html);
	});
};


function doInjection(html, inject){
	return html.replace("</body>", "</body>" + inject);
}