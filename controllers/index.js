var express = require('express');
var router = express.Router();
var path = require('path')

router.use('/', function(req, res, next) {
  console.log('dddddddddddddddddddddddddddddddd')
  res.sendFile(path.join(__dirname, '../public/bulld', 'index.html'));
  // res.render('index', { title: 'this is indeffx' });
});

module.exports = router;
