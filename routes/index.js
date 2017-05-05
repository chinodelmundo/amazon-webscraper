var express = require('express');
var router = express.Router();
var Xray = require('x-ray');
var xray = Xray();

router.get('/', function(req, res, next) {
  	res.render('index');
});

router.post('/', function(req, res, next) {
	xray(req.body.url, '#mainResults', {
  		products: xray('.s-result-item', [{
  			name: xray('.s-access-detail-page h2'),
  			price: {
  					currency: xray('.sx-price-currency'),
  					whole: xray('.sx-price-whole'),
  					decimal: xray('.sx-price-fractional')
  				},
        rating: xray('.a-icon-star .a-icon-alt'),
  			link: xray('.s-access-detail-page@href')
  		}])
	})(function(err, obj) {
		res.render('index', { products: obj.products});
	});
});

router.get('/reviews', function(req, res, next) {
    res.redirect('/');
});

router.post('/reviews', function(req, res, next) {

  var product = {
    name: req.body.name,
    price: req.body.price,
    rating: req.body.rating
  };

  xray(req.body.url, '#reviewsMedley', {
    reviews: xray('.review', [{
      author: xray('.author'),
      text: xray('.a-expander-partial-collapse-content')
    }])
  })(function(err, obj) {
    res.render('reviews', {product: product, reviews: obj.reviews});
  });
});

module.exports = router;
