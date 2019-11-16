const express = require('express');
const passport = require('passport');
const router = express.Router();
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
let jsonParser = bodyParser.json();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('db/users.db');
const {
  ensureAuthenticated
} = require('../config/auth');

router.get('/dashboard', ensureAuthenticated, (req, res) => {
  db.get('SELECT * FROM usr WHERE email=?', [req.user.email], function(err, row) {
    if (!err) {
      points = row.points;
      rbm = parseFloat(row.rbm);
      bgm = parseFloat(row.bgm);
      rby = row.rby;
      bgy = row.bgy;

      res.render('dashboard', {

        name: req.user.name,
        datam: [row.rbm, row.bgm],
        datay: [row.rby, row.bgy],
        point: row.points

      });



    }
  });

});

router.get('/claim', ensureAuthenticated, (req, res) => res.render('claim', {
  name: req.user.name
}));
router.post('/claimp', (req, res) => {
  const {
    pp
  } = req.body
  const dp = req.user.points
  const np = dp - pp;
  if (np < 0) {
    np = 0
  }

  db.run('UPDATE usr SET points=? WHERE email=?', [np, req.user.email], function(err) {
    if (err) {
      return console.error(err.message);
    }
    console.log(`Row(s) updated: ${this.changes}`);

  });


  req.flash(
    'success_msg',
    'Points Claimed'
  );
  res.redirect('/users/dashboard')
});

router.post('/register', (req, res) => {
  const {
    name,
    email,
    password,
    address
  } = req.body;
  let errors = 0;

  if (!name || !email || !password || !address) {
    errors = errors + 1;
    req.flash(
      'error_msg',
      "Please Enter All Fields"
    );
  }

  //check pass length
  if (errors == 0 & password.length < 3) {
    errors = errors + 1;
    req.flash(
      'error_msg',
      "Password Must be more than 3 characters"
    );

  }

  if (errors > 0) {

    res.redirect('/');

  } else {
    db.get('SELECT * FROM usr WHERE email=?', [email], function(err, row) {
      if (!err) {

        if (row) {
          req.flash(
            'error_msg',
            "Email Already Exists"
          );
          res.redirect('/');
        } else {
          db.serialize(function() {
            //hash password
            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(password, salt);
            db.run('INSERT INTO usr(name,email,pass,loc,bgm,rbm,bgy,rby,points) VALUES(?,?,?,?,?,?,?,?,?)', [name, email, hash, address, 0, 0, 0, 0, 0]);
            req.flash(
              'success_msg',
              'You are now registered and can log in here'
            );
            res.redirect('/');

          });
        }
      } else {
        throw err;
      }
    });
  }
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/users/dashboard',
    failureRedirect: '/',
    badRequestMessage: 'Missing username or password.',
    failureFlash: true
  })(req, res, next)
});

router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/');
});
module.exports = router;
