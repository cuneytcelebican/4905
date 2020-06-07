"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var router = _express.default.Router();
/* GET home page. */


router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Home'
  });
});
/* GET login page. */

router.get('/about', function (req, res, next) {
  res.render('about', {
    title: 'About'
  });
});
/* GET login page. */

router.get('/how-it-works', function (req, res, next) {
  res.render('how-it-works', {
    title: 'How It Works'
  });
});
/* GET request page. */

router.get('/request', function (req, res, next) {
  res.render('request', {
    title: 'Request'
  });
});
var _default = router;
exports.default = _default;