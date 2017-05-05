var express = require('express');
var router = express.Router();
var Xray = require('x-ray');
var xray = Xray();

router.get('/', function(req, res, next) {
  	res.render('index');
});

router.post('/', function(req, res, next) {
	process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; //erase me

	xray(req.body.url, '#mainResults', {
  		products: xray('.s-result-item', [{
  			name: xray('.s-access-detail-page h2'),
  			price: xray('.sx-price-whole'),
  			link: xray('.s-access-detail-page@href')
  		}])
	})(function(err, obj) {
		res.render('index', { products: obj.products});
	});
});

module.exports = router;
