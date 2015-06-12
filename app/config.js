var mongoose = require('mongoose');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');


if(process.env.NODE_ENV === 'development'){
  var db = mongoose.connect('mongodb://localhost/test');
} else {
  //use db hosted on auzre.
  var db = mongoose.connect('mongodb://MongoLab-s:nhdxwrdJxO5fd43YHeMu5qIxPl4Pb.nstnAkMsA7VDE-@ds036638.mongolab.com:36638/MongoLab-s');
}

module.exports = db;








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
