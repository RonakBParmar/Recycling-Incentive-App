const LocalStrategy = require('passport-local').Strategy;
var crypto = require('crypto');
var sqlite3 = require('sqlite3');
const bcrypt = require('bcryptjs');
var db = new sqlite3.Database('db/users.db');

module.exports = function(passport) {
  passport.use('local',
    new LocalStrategy({
      usernameField: 'email',
      passReqToCallback: true
    }, function(req, email, password, done) {
      db.get('SELECT * FROM usr WHERE email = ?', email, function(err, row) {
        if (!err) {
          if (!row) {
            return done(null, false, {
              message: 'Email doesnt exist'
            });
          }
          bcrypt.compare(password, row.pass, (err, isMatch) => {
            if (isMatch) {

              return done(null, row);
            } else {
              return done(null, false, {
                message: 'Incorrect Password'
              });
            }

          })


        };

      });
    })

  );





  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(user, done) {
    db.get('SELECT * FROM usr WHERE id = ?', user.id, function(err, row) {
      if (!row) return done(null, false);
      return done(null, row);
    });

  });

};
