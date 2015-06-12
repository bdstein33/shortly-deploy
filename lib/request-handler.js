var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');
var Promise = require('bluebird');

var db = require('../app/config');
var User = require('../app/models/user');
var Link = require('../app/models/link');


exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function(){
    res.redirect('/login');
  });
};

exports.fetchLinks = function(req, res) {
  Link.find(function(err, links){
    if (err) return handleError(err);
    res.send(200, links);
  });
};

exports.saveLink = function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.send(404);
  }

  Link.findOne({url: uri}, function(err, link) {
    if (err) return handleError(err);

    if (link) {
      res.send(200, link);
    } else {
      util.getUrlTitle(uri, function(err, title) {
        if (err) {
          console.log('Error reading URL heading: ', err);
          return res.send(404);
        }

        var newLink = new Link({
          url: uri,
          title: title,
          base_url: req.headers.origin
        });

        newLink.save(function(err) {
          if (err) {
            console.log(err);
          }
          res.send(200, newLink);
        });
      });
    }
  });
};

exports.navToLink = function(req, res) {

  Link.findOne({ code: req.params[0] }, function(err, link) {
    if (err) throw err;
    if (!link) {
      res.redirect('/');
    } else {

      link.update({visits: link.visits+1}, function(err) {
        if(err) console.log(err);
      });
      console.log(link.visits);
      return res.redirect(link.url);
    }

  });
};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({'username': username}, function(err, user) {
    if (err) return handleError(err);
    if(!user){
      res.redirect('/login');
    } else {
      user.comparePassword(password, function(match) {
        if (match) {
          util.createSession(req, res, user);
        } else {
          res.redirect('/login');
        }
      });
    }
  });
};

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  var getUser = function(username) {
    return new Promise(function (resolve, reject) {
      User.findOne({'username': username}, function(error, user) {
        if (error) { reject(error); }
        else {
          resolve(user);
        }
      });
    });
  };

  getUser(username)
  .then( function(user) {
    if (!user) {
      var newUser = new User({
        username: username,
        password: password
      });

      newUser.save(function(err) {
        if (err) {
          console.log(err);
        }
        util.createSession(req, res, newUser);
      });
    }
    else {
      res.redirect('/signup');
    }
  });
};


// exports.signupUser = function(req, res) {
//   var username = req.body.username;
//   var password = req.body.password;

//   User.findOne({'username': username}, function(err, user) {
//     if (err) return handleError(err);

//     if (!user) {
//       var newUser = new User({
//         username: username,
//         password: password
//       });

//       newUser.save(function(err) {
//         if (err) {
//           console.log(err);
//         }
//         util.createSession(req, res, newUser);

//       });
//     }
//     else {
//       res.redirect('/signup');
//     }
//   });
// };
