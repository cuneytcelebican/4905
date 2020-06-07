"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _httpErrors = _interopRequireDefault(require("http-errors"));

var _express = _interopRequireDefault(require("express"));

var _path = _interopRequireDefault(require("path"));

var _cookieParser = _interopRequireDefault(require("cookie-parser"));

var _morgan = _interopRequireDefault(require("morgan"));

var _handlebars = _interopRequireDefault(require("handlebars"));

var _expressHandlebars = _interopRequireDefault(require("express-handlebars"));

var _expressValidator = _interopRequireDefault(require("express-validator"));

var _expressSession = _interopRequireDefault(require("express-session"));

var _expressFlash = _interopRequireDefault(require("express-flash"));

var _index = _interopRequireDefault(require("./routes/index"));

var _users = _interopRequireDefault(require("./routes/users"));

var _repos = _interopRequireDefault(require("./routes/repos"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _connectMongo = _interopRequireDefault(require("connect-mongo"));

var _user = _interopRequireDefault(require("./models/user"));

var _passport = _interopRequireDefault(require("passport"));

var _passportConfig = _interopRequireDefault(require("../passport-config"));

var app = (0, _express.default)();
var MongoStore = (0, _connectMongo.default)(_expressSession.default);

var _require = require('@handlebars/allow-prototype-access'),
    allowInsecurePrototypeAccess = _require.allowInsecurePrototypeAccess;

_mongoose.default.connect("mongodb://localhost:27017/mydb", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}); // view engine setup


app.set('views', _path.default.join(__dirname, 'views'));
app.engine('hbs', (0, _expressHandlebars.default)({
  extname: 'hbs',
  defaultLayout: 'layout',
  layoutsDir: __dirname + '/views/',
  handlebars: allowInsecurePrototypeAccess(_handlebars.default)
}));
app.set('view engine', 'hbs');
app.use((0, _morgan.default)('dev'));
app.use(_express.default.static(_path.default.join(__dirname, '../public')));
app.use(_express.default.json());
app.use(_express.default.urlencoded({
  extended: false
}));
app.use((0, _cookieParser.default)());
app.use((0, _expressSession.default)({
  secret: 'secret',
  saveUninitialized: false,
  resave: false,
  store: new MongoStore({
    mongooseConnection: _mongoose.default.connection
  }),
  cookie: {
    maxAge: 120 * 60 * 1000
  } // 2 hours later experies the session

}));
app.use((0, _expressFlash.default)());
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
}); // Express validator

app.use((0, _expressValidator.default)({
  errorFormatter: function errorFormatter(param, msg, value) {
    var namespace = param.split('.'),
        root = namespace.shift(),
        formParam = root;

    while (namespace.lenght) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param: formParam,
      msg: msg,
      value: value
    };
  }
}));
(0, _passportConfig.default)(_passport.default, function (email) {
  return _user.default.findOne({
    email: email
  });
}, function (id) {
  return _user.default.findOne({
    _id: id
  });
});
app.use(_passport.default.initialize());
app.use(_passport.default.session());
app.get('*', function (req, res, next) {
  res.locals.user = req.user || null;
  next();
});
app.use('/bootstrap', _express.default.static(_path.default.join(__dirname, '../node_modules/bootstrap/dist')));
app.use('/jquery', _express.default.static(_path.default.join(__dirname, '../node_modules/jquery/dist')));
app.use('/', _index.default);
app.use('/users', _users.default);
app.use('/repos', isAuthenticated, _repos.default); // catch 404 and forward to error handler

app.use(function (req, res, next) {
  next((0, _httpErrors.default)(404));
}); // error handler

app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {}; // render the error page

  res.status(err.status || 500);
  res.render('error');
});

function isAuthenticated(req, res, next) {
  if (!req.isAuthenticated()) {
    req.flash('error_msg', 'You are not logged in');
    res.redirect('/users/login');
  } else {
    return next();
  }
}

;
var _default = app;
exports.default = _default;