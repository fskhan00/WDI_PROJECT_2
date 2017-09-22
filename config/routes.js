const router        = require('express').Router();

// Require controllers
const statics       = require('../controllers/statics');
const sessions      = require('../controllers/sessions');
const registrations = require('../controllers/registrations');
const films         = require('../controllers/films');

function secureRoute(req, res, next) {
  if (!req.session.userId) {
    return req.session.regenerate(() => {
      req.flash('danger', 'You must be logged in.');
      res.redirect('/login');
    });
  }

  return next();
}

router.route('/')
  .get(statics.index);

router.route('/films')
  .get(films.index)
  .post(secureRoute, films.create);

router.route('/films/new')
  .get(secureRoute, films.new);

router.route('/films/:id')
  .get(films.show)
  .put(secureRoute, films.update)
  .delete(secureRoute, films.delete);

router.route('/films/:id/edit')
  .get(secureRoute, films.edit);

router.route('/register')
  .get(registrations.new)
  .post(registrations.create);

router.route('/login')
  .get(sessions.new)
  .post(sessions.create);

router.route('/logout')
  .get(sessions.delete);

module.exports = router;
