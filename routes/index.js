

/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', {  });
};


var phantom = require('../libs/phantom-scrapper');
var jsdom = require("jsdom").jsdom;

exports.editor = function(req, res){

	req.assert('url', 'Invalid url')
	  	.notEmpty().isUrl();

	var errors = req.validationErrors();

	if(errors){
		return res.send('error!');
	}

	phantom.scrape(req.body.url, function(html){
		res.send(html);
	});
	

	console.log(errors, req.body.url);	
  	
};