const express        = require('express');
const expressLayouts = require('express-ejs-layouts');
const morgan         = require('morgan');
const mongoose       = require('mongoose');
const { port, db, secret }   = require('./config/env');
const bodyParser     = require('body-parser');
const routes         = require('./config/routes');
const methodOverride = require('method-override');
const User           = require('./models/user');
const session        = require('express-session');
const flash          = require('express-flash');
const app            = express();

mongoose.Promise = require('bluebird');
mongoose.connect(db);
app.use(morgan('dev'));
app.set('view engine', 'ejs');
app.set('views', `${__dirname}/views`);

app.use(express.static(`${__dirname}/public`));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride(function (req) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    const method = req.body._method;
    delete req.body._method;
    return method;
  }
}));
app.use(expressLayouts);

app.use(session({
  secret: secret,
  resave: false,
  saveUninitialized: false
}));

app.use(flash());

app.use((req, res, next) => {
  console.log(req.session.userId);
  if (!req.session.userId) return next();

  User
    .findById(req.session.userId)
    .exec()
    .then((user) => {
      if(!user) {
        return req.session.regenerate(() => {
          req.flash('danger', 'You must be logged in.');
          res.redirect('/');
        });
      }

      // Re-assign the session id for good measure
      req.session.userId = user._id;

      res.locals.user = user;
      res.locals.isLoggedIn = true;

      next();
    });
});
app.use(routes);

app.listen(port, () => console.log(`Express up and running on port: ${port}`));
