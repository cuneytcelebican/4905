"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _express = _interopRequireDefault(require("express"));

var _user = _interopRequireDefault(require("../models/user"));

var _passport = _interopRequireDefault(require("passport"));

var router = _express.default.Router();
/**
 * GET login page
 */


router.get('/login', function (req, res, next) {
  console.log("email:" + req.body.email);
  res.render('login', {
    title: 'Login',
    landingPage: true
  });
});
/**
 * Handles login request to the application.
 */

router.post('/login', function (req, res, next) {
  _passport.default.authenticate('local', {
    successRedirect: '/repos',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});
/* GET register page. */

router.get('/register', function (req, res, next) {
  res.render('register', {
    title: 'Register'
  });
});
/**
 * Handles post request for /users/register page.
 * Creates a user if the user entered all information
 * correctly.
 */

router.post('/register', validateRegistration, /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(req, res, next) {
    var newUser;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            newUser = new _user.default({
              email: req.body.email,
              password: req.body.password
            });
            _context.next = 4;
            return _user.default.createUser(newUser);

          case 4:
            res.redirect('/users/login');
            _context.next = 11;
            break;

          case 7:
            _context.prev = 7;
            _context.t0 = _context["catch"](0);
            console.log("/users/register failed, error: ".concat(_context.t0));
            next(_context.t0);

          case 11:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 7]]);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}());
router.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/users/login');
});
/**
 * Validates user inputs and checks if the email address
 * already registered to the system.
 * @param {*} req request
 * @param {*} res response
 * @param {*} next next
 */

function validateRegistration(_x4, _x5, _x6) {
  return _validateRegistration.apply(this, arguments);
}

function _validateRegistration() {
  _validateRegistration = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2(req, res, next) {
    var errors, user;
    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            req.checkBody('email', 'Full name is required').notEmpty();
            req.checkBody('password', 'Password is required').notEmpty();
            req.checkBody('passwordValidation', 'Confirm password is requierd').notEmpty();
            req.checkBody('password', 'Password and confirm password fields must match').equals(req.body.passwordValidation);
            errors = req.validationErrors();
            _context2.next = 7;
            return _user.default.find({
              email: req.body.email
            });

          case 7:
            user = _context2.sent;

            if (user.length) {
              errors = Object.keys(errors).length ? Object.assign({}, errors, {
                duplicateEmail: {
                  msg: 'This email address is already registered'
                }
              }) : [{
                msg: 'This email address is already registered'
              }];
            }

            ;

            if (errors) {
              req.flash('error_msg', errors);
              res.redirect('/users/register');
            } else {
              next();
            }

          case 11:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _validateRegistration.apply(this, arguments);
}

var _default = router;
exports.default = _default;