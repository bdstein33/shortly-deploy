var db = require('../config');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');
var mongoose = require('mongoose');

var UserSchema = mongoose.Schema({
  username: {type: String, unique: true },
  password: String
});

UserSchema.pre('save', function(next) {
  var cipher = Promise.promisify(bcrypt.hash);

  cipher(this.password, null, null).bind(this)
    .then(function(hash) {
      this.password = hash;
      console.log("Then in the promise: "+this.password);
      next();
    });
});

UserSchema.methods.comparePassword = function(attemptedPassword, callback) {
  bcrypt.compare(attemptedPassword, this.password, function(err, isMatch) {
    callback(isMatch);
  });
};

User = mongoose.model('User', UserSchema);

module.exports = User;
