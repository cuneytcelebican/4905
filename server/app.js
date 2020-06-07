import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import handlebars from 'handlebars';
import hbs from 'express-handlebars';
import expressValidator from 'express-validator';
import session from 'express-session';
import flash from 'express-flash';
import indexRouter from './routes/index';
import usersRouter from './routes/users';
import reposRouter from './routes/repos';
import mongoose from 'mongoose';
import mongoconnect from 'connect-mongo';
import User from './models/user';
import passport from 'passport';
import passportConfig from '../passport-config';

const app = express();
const MongoStore = mongoconnect(session);
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')

mongoose.connect("mongodb://localhost:27017/mydb", { useNewUrlParser: true, useUnifiedTopology: true });


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', hbs({extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/', handlebars: allowInsecurePrototypeAccess(handlebars)}));
app.set('view engine', 'hbs');


app.use(logger('dev'));
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
  secret            : 'secret',
  saveUninitialized : false,
  resave            : false,
  store             : new MongoStore({mongooseConnection: mongoose.connection}),
  cookie            : {maxAge: 120 * 60 * 1000} // 2 hours later experies the session
}));
app.use(flash());
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Express validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
    var namespace = param.split('.'),
    root          = namespace.shift(),
    formParam     = root;

    while(namespace.lenght) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

passportConfig(passport, email => User.findOne({ email: email }), id => User.findOne({ _id: id }));

app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req, res, next){
  res.locals.user = req.user || null;
  next();
});


app.use('/bootstrap', express.static(path.join(__dirname, '../node_modules/bootstrap/dist')));
app.use('/jquery', express.static(path.join(__dirname, '../node_modules/jquery/dist')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/repos', isAuthenticated, reposRouter);

// catch 404 and forward to error handler
app.use((req, res, next) =>
{
  next(createError(404));
});

// error handler
app.use((err, req, res, next) =>
{
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

function isAuthenticated(req, res, next){
  if(!req.isAuthenticated()){
    req.flash('error_msg', 'You are not logged in');
    res.redirect('/users/login');
  }
  else
  {
    return next();
  }
};

export default app;
