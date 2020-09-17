module.exports = (req, res, next) => {
    // res.locals.user = req.session ? req.session.loggedInUser : null;
    res.locals.currentUser = req.session.loggedInUser;
    next();
  };
  