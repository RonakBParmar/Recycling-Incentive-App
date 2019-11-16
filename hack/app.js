const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const app = express();
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('db/users.db',
  function(err) {
    if (!err) {
      db.run(`
      CREATE TABLE IF NOT EXISTS usr (
        id INTEGER PRIMARY KEY ,
        name TEXT,
        email TEXT,
        pass TEXT,
        loc TEXT,
        bgm REAL,
        rbm REAL,
        bgy Real,
        rby Real,
        points INTEGER
      )`);
      console.log('opened users.db');
    }
  }
);

const PORT = process.env.PORT || 8000;
app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/routes'));

require('./config/passport')(passport);

app.use(expressLayouts);
app.set('view engine', 'ejs');

app.use(
  session({
    secret: 'bacon',
    resave: true,
    saveUninitialized: true
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

app.listen(PORT, () => console.log(`Listening on port ${PORT}!`));
