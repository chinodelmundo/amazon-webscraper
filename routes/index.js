var express = require('express');
var router = express.Router();
var request = require('request');
var cheerio = require('cheerio');

router.get('/', function(req, res, next) {
  	res.render('index');
});

router.post('/', function(req, res, next) {

	var options = {
	  url: req.body.url,
	  timeout: 10*1000
	}

	res.setTimeout(10000, function(){
    	res.render('index', { message: 'Timeout Error. Kindly try again.'});
  	});

	request(options, function(error, response, body){
    	if(!error){
    		var $ = cheerio.load(body);

		  	var count = 0, products = [], results;

		  	$('#mainResults').filter(function(){
		    	var data = $(this);
		    	count = data.find('.s-result-item').length;
		    	console.log(data);

		    	if(count > 0){
		    		console.log("count > 0");
			      	for(var i = 0; i < count; i++){
		        		$('#result_' + i).filter(function(){
		        			var data = $(this);
		        			name = data.find('.s-access-detail-page').first().find('h2').first().text();
		        			price = data.find('.sx-price-whole').first().text();
		        			link = data.find('.s-access-detail-page').first().attr('href')

		        			var product = {
		        				name: name,
		        				price: price,
		        				link: link
		        			};

		        			products.push(product);
		        		});
		        	}
		      	}

		    	results = {
			  		count: count,
			  		products: products
			  	};

				res.render('index', { results: results});
		  	});
    	}else{
  			res.render('index', { message: 'Error: ' + error });
    	}
  	});
});

module.exports = router;
