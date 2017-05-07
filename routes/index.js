var express = require('express');
var router = express.Router();
var Xray = require('x-ray');
var xray = Xray();

var getReviews = function(url){
  return new Promise(function(resolve, reject) {
    xray(url,{
      reviews: xray('#cm_cr-review_list .review', [{
        author: '.author',
        text: '.review-text',
        rating: '.a-icon-star .a-icon-alt',
        date: '.review-date'
      }])
    })(function(err, obj) {
      if(err){
        reject(err);
      }else{
        resolve(obj.reviews);
      }
    });
  });
};

var getReviewsPromises = function(link, start, end){
  var reviewsPromises = [];
  for(var i = start; i <= end; i++){
    reviewsPromises.push(getReviews(link.replace('cm_cr_dp_d_show_all_btm', 'cm_cr_arp_d_paging_btm_' + i) + '&pageNumber=' + i));
  }

  return reviewsPromises;
};

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
    if(err) console.log(err);
    res.render('index', {products: obj.products});
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

  var pages = {
    start: req.body.start,
    end: req.body.end
  };

  xray(req.body.url, '#reviews-medley-footer a@href')(function(err, link) {
    link = link.replace('recent', 'helpful');

    var reviewsPromises = getReviewsPromises(link, pages.start, pages.end);

    Promise.all(reviewsPromises)
      .then(function(results) {
        var reviews = [];
        for(var i = 0; i < results.length; i++){
          reviews = reviews.concat(results[i]);
        }

        var obj = {
          product: product,
          link: link,
          reviews: reviews,
          pages: pages
        };

        res.render('reviews', {obj: obj});
      })
      .catch(function(err){
        res.render('reviews', {message: err});
      });
  });
});

router.get('/reviews/more', function(req, res, next) {
    res.redirect('/');
});

router.post('/reviews/more', function(req, res, next) {

  var product = {
    name: req.body.name,
    price: req.body.price,
    rating: req.body.rating
  };

  var pages = {
    start: req.body.start,
    end: req.body.end
  };

  var link = req.body.url;
  var reviewsPromises = getReviewsPromises(link, pages.start, pages.end);

  Promise.all(reviewsPromises)
    .then(function(results) {
      var reviews = [];
      for(var i = 0; i < results.length; i++){
        reviews = reviews.concat(results[i]);
      }

      var obj = {
        product: product,
        link: link,
        reviews: reviews,
        pages: pages
      };

      res.render('reviews', {obj: obj});
    })
    .catch(function(err){
      res.render('reviews', {message: err});
    });
});

module.exports = router;
