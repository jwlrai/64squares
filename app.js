var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var routes = require('./modules/m.routes');
var app = express();
var auth = require('./modules/m.auth');
var cors = require('cors')

app.set('views', path.join(__dirname, 'views'));// view engine setup
app.set('view engine', 'ejs');

app.use(cors({
  exposedHeaders:'x-token'
}))
app.use(logger('dev'));
app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//validate token
app.use(function (req, res, next) {
  
  let token = req.header('x-token');
  if (token === undefined) {// not login
    res.locals.user = {
      login: false,
      data: null
    }
    next();
  }
  else { // logined
    auth.getIdFromToken(token, function (err, data) {
     
      if (err) { // invlalid token
        res.status(403).json({ "message": "Invalid request", "status": false,"reqtype":"invalid" })
      } else {
        auth.verifySession(data.data, function (err, udata) {
          if (err) {
            if(err =='invalid'){
              res.json({ "message": "Invalid request", "status": false })
            }else{
              res.json({ "message": "Session Expire", "status": false,"reqtype":"expire" })
            }
            
          } else {            
            res.locals.user = {
              login: true,
              data: udata
            }
            next();
          }
        })
      }
    });
  }
  
});
// modifying routes
app.use(routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
