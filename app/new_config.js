var mongoose = require('mongoose');

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



var UserSchema = mongoose.Schema({
  username: String,
  password: String
});



var User = mongoose.model('User', UserSchema);






// var link = new Link({
//   url: 'http://www.google.com',
//   base_url: 'www.google.com',
//   code: 'urlcreated',
//   title: 'Google',
//   visits: 1
// });


// link.save(function (err) {
//   if (err) {
//     console.log(err);
//   }
//   console.log('new LINK created');
//   console.log(link.code);

// });

// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function (callback) {
//   console.log("CONNECTION ESTABLISHED");
// });
