var phantom = require('phantom');

function scrape(url, func){

	phantom.create(function(ph){

		return ph.createPage(function(page){
			return page.open(url, function(status){
				//page.injectJs('http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js', function() {
				//page.injectJs('http://localhost:3000/js/app.js', function() {
					return page.evaluate((function(){
						
						var scripts = document.getElementsByTagName('script'),
							links   = document.getElementsByTagName('link'),
							images	= document.getElementsByTagName('img');

						for(i in scripts){						
							if((script = scripts[i]) && script.src){
								if(script.getAttribute('src') != script.src){
									script.setAttribute('src', script.src);
								}
							}								
						}

						for(i in links){
							if((link = links[i]) && link.href ){
								if(link.getAttribute('href') != link.href){
									link.setAttribute('href', link.href);
								}
							}
						}


						for(i in images){
							if((image = images[i]) && image.src){
								if(image.getAttribute('src') != image.src){
									image.setAttribute('src', image.src);
								}
							}								
						}

						return document.getElementsByTagName('html')[0].outerHTML;				

					}), function(result){
						ph.exit(); (func)(result); 
					});
				//});					
			});
		});
	});
}


exports.scrape = scrape;