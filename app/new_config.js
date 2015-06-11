var mongoose = require('mongoose');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');

if(process.env.NODE_ENV === 'development'){
  mongoose.connect('mongodb://localhost/test');
} else {
  //use db hosted on auzre.
  mongoose.connect('mongodb://localhost/test');
}

var LinkSchema = mongoose.Schema({
  url: String,
  base_url: String,
  code: String,
  title: String,
  visits: Number
});

var Link = mongoose.model('Link', LinkSchema);

// LinkSchema.methods.initialize = function() {
//    var shasum = crypto.createHash('sha1');
//    shasum.update(this.url);
//    this.code = shasum.digest('hex').slice(0, 5);
// };

LinkSchema.pre('save', function(next) {
  console.log("IT WORKS");
  //console.log(this);
  var shasum = crypto.createHash('sha1');
  shasum.update(this.url);
  this.code = shasum.digest('hex').slice(0, 5);
  next();
});


var link = new Link({
  url: 'http://www.google.com',
  base_url: 'www.google.com',
  code: 'urlcreated',
  title: 'Google',
  visits: 1
});


link.save(function (err) {
  if (err) {
    console.log(err);
  }
  console.log('new LINK created');
  console.log(link);

});

LinkSchema.methods.initialize = function() {
   var shasum = crypto.createHash('sha1');
   shasum.update(this.url);
   this.code = shasum.digest('hex').slice(0, 5);
};


var UserSchema = mongoose.Schema({
  username: String,
  password: String
});

UserSchema.methods.initialize = function() {
  var cipher = Promise.promisify(bcrypt.hash);

}




var User = mongoose.model('User', UserSchema);








// link.save(function (err) {
//   if (err) {
//     console.log(err);
//   }
//   console.log('new LINK created');
//   console.log(link.code);

//

// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function (callback) {
//   console.log("CONNECTION ESTABLISHED");
// });
