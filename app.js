var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var session = require('express-session');
var flash = require('connect-flash');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');
var userSchema = require('./model/users.js');
var md5 = require('md5');

/*===================================================== */
/*                        MONGOOSE                      */
/*===================================================== */
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/weblog', {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('We connected to "weblog"database successfully !! ');
});
/*===================================================== */
/*                      END MONGOOSE                    */
/*===================================================== */
var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());//The express.json and express.urlencoded for parsing incoming data to the server.
app.use(express.urlencoded({ extended: false }));//Other packages, such as body-parser, act as middleware and perform similar task
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/scripts', express.static(path.join(__dirname, 'node_modules')));
app.use( session (
  {
    secret:'secret',
    cookie:{ maxAge : 60000 },
    resave:false,
    saveUninitialized:false
  }
) );
app.use( flash () );
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use(async function(req,res,next)
{
  let user = req.cookies.user ? req.cookies.user.split("_") : [];
  if(user.length > 1)
  {
    var id = user[0];
    var hash_md5 = user[1];
    try 
    {
      var target = await userSchema.findOne( { _id: id });
      
      if(target != null)
      {
        var hash = md5(target.email+"_"+target.password);
        delete target.password;
        req.user = target;
        //console.log("Hello " + req.user);
        if(hash_md5 == hash && req.url == "/admin/login")
        {
          res.redirect('/admin/dashboard');
        }
      }
      else if(req.url != "/admin/login"){
        res.redirect('/admin/login');
      } 
    } 
    catch (error) 
    {
      console.log(error);
      res.redirect('/home');
    }
  }
  else if(req.url != "/admin/login"){
    res.redirect('/admin/login');
  } 
  next();
})
app.use('/admin' , adminRouter);
app.set('trust proxy', 1) // trust first proxy
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
module.exports = app;
