"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _bcrypt = _interopRequireDefault(require("bcrypt"));

var userSchema = new _mongoose.default.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

var User = _mongoose.default.model('User', userSchema);
/**
 * Creates user.
 */


User.createUser = function (user) {
  _bcrypt.default.genSalt(10, function (err, salt) {
    _bcrypt.default.hash(user.password, salt, function (err, hash) {
      if (err) throw err;
      user.password = hash;
      return user.save();
    });
  });
};

var _default = User;
exports.default = _default;