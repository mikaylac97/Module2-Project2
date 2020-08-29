const express = require('express');
const router = express.Router();


/* GET home page */
router.get('/', loggedIn, (req, res, next) => {
    
    res.render('index', { title: 'Project 2' })
    
});






// redirects user to their profile page if they are logged in
function loggedIn(req, res, next) {
    if (req.session.loggedInUser) {
        res.redirect('/profile');
    } else next();
}





module.exports = router;