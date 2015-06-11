var mongoose = require('mongoose');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');

if(process.env.NODE_ENV === 'development'){
  mongoose.connect('mongodb://localhost/test');
} else {
  //use db hosted on auzre.
  mongoose.connect('mongodb://MongoLab-s:nhdxwrdJxO5fd43YHeMu5qIxPl4Pb.nstnAkMsA7VDE-@ds036638.mongolab.com:36638/MongoLab-s');
}

var LinkSchema = mongoose.Schema({
  url: String,
  base_url: String,
  code: String,
  title: String,
  visits: {type: Number, default: 0}
});

LinkSchema.pre('save', function(next) {
  console.log("IT WORKS");
  var shasum = crypto.createHash('sha1');
  shasum.update(this.url);
  this.code = shasum.digest('hex').slice(0, 5);
  next();
});

exports.Link = mongoose.model('Link', LinkSchema);


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

exports.User = mongoose.model('User', UserSchema);



// Test Code
// var link = new exports.Link({
//   url: 'http://www.google.com',
//   base_url: 'www.google.com',
//   code: 'urlcre',
//   title: 'Google',
//   visits: 1
// });

// link.save(function (err) {
//   if (err) {
//     console.log(err);
//   }
//   console.log('new LINK created');
//   console.log(link);
// });

// var user = new exports.User({
//   username: "Freddy",
//   password: "frenchfries"
// });

// user.save(function(err) {
//  if (err) {
//     console.log(err);
//   }
//   console.log('new USER created');
//   console.log(user);
// });
