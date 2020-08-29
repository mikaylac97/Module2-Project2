const express = require('express');
const router = express.Router();


// GET user profile

router.get('/user-profile', (req, res, next) => res.render('profile'));

module.exports = router;