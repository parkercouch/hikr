module.exports = function isLoggedIn(req, res, next) {
  if (req.user.conversations.includes(+req.params.idx)) {
    next();
  } else {
    // req.flash('error', 'You can\'t go there!');
    res.redirect('/conversation');
  }
};
