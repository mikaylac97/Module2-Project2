const express = require('express');
const router = express.Router();


// GET user profile

router.get('/user-profile', (req, res, next) => res.render('profile', req.session.loggedInUser));

module.exports = router;