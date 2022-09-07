const localStrategy = require('passport-local')
const mongoose = require('mongoose')
const User = require('../models/User')
const bcrypt        = require('bcrypt');

module.exports = function (passport) {
  passport.use(new localStrategy( function(username, password, done)  {
    User.findOne({ username: username }, function (err, user) {
      if (err)  return done(err) 
      if (!user) return done(null, false, { message: `Username ${username} not found.` });
     
      
      bcrypt.compare(password, user.password, function(err, res)  {
        if (err) return done(err); 
        if (res === false) return done(null, false, { message: 'Invalid password.' });
        
       return done(null, user);
      });
    });
  }));
  

  passport.serializeUser( function(user, done)  {
    done(null, user.id)
  })

  passport.deserializeUser( function(id, done) {
    User.findById(id, function (err, user) {done(err, user)})
  })
}
