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
  					currency: '.sx-price-currency',
  					whole: '.sx-price-whole',
  					decimal: '.sx-price-fractional'
  				},
        rating: '.a-icon-star .a-icon-alt',
  			link: '.s-access-detail-page@href'
  		}])
	})(function(err, obj) {
    if(err){
      console.log(err);
    }else{
      res.render('index', { products: obj.products});
    }
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

  xray(req.body.url, '#reviews-medley-footer a@href')(function(err, link) {
    xray(link.replace('recent', 'helpful'),{
      link: '#cm_cr-review_list .a-declarative a@href',
      reviews: xray('#cm_cr-review_list .review', [{
        author: '.author',
        text: '.review-text',
        rating: '.a-icon-star .a-icon-alt',
        date: '.review-date'
      }])
    })(function(err, obj) {
      res.render('reviews', {product: product, results: obj});
    });
  });
});

module.exports = router;
