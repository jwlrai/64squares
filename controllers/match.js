var express = require('express');
var router = express.Router();

// initilizing match rooms in socket io and db
router.post('/create', function(req, res, next) {
  res.render('index', { title: 'this is indeffx' });
});

module.exports = router;
