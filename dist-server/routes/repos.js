"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var router = _express.default.Router();
/**
 * GET dashboard page
 */


router.get('/', function (req, res, next) {
  res.render('dashboard', {
    title: 'dashboard'
  });
});
router.get('/dashboar', function (req, res, next) {
  res.render('dashboard', {
    title: 'dashboard2'
  });
});
var _default = router;
exports.default = _default;