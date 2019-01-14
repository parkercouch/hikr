module.exports = function isLoggedIn(req, res, next) {
  if (req.user) {
    next();
  } else {
    req.flash('error', 'Please login!');
    res.redirect('/auth/login');
  }
};
