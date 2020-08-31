const { Router } = require('express');
const router = new Router();
const bcryptjs = require('bcryptjs');
const mongoose = require('mongoose');
const saltRounds = 10;
const User = require('../models/User.model');
const routeGuard = require('../configs/route-guard.config');
const fileUploader = require('../configs/cloudinary.configs');

//.get route to get the account details edit page
router.get('/account', (req, res, next) => {

    res.render('account/account.hbs')
})

//.post route to edit the account details page
router.post('/account-edit', fileUploader.single('image'), (req, res, next) => {
    const {firstname, lastname, username, email, password } = req.body;

    if(!username || !email || !password || !firstname || !lastname) {
        res.render('/account', {
            errorMessage: 'All fields are mandatory. Please provide your username, email and password.'
        });
        return;
    }

 
    bcryptjs
        .genSalt(saltRounds)
        .then(salt => bcryptjs.hash(password, salt))
        .then(hashedPassword => {
            const editedUser = {
              username,
                email,
                passwordHash : hashedPassword,
                firstname,
                lastname
            }

            if (req.file) {
        editedUser.profilePhotoUrl = req.file.path;
            }

            return User.findByIdAndUpdate(req.session.loggedInUser._id, editedUser);
        })
        .then(userFromDB => {
            console.log(`Edited user  is: ${userFromDB}`);
            res.redirect('/login');
        })
        .catch(error => {
            if( error instanceof mongoose.Error.ValidationError) {
                res.status(500).render('account/account', { errorMessage: error.message });
            } else if(error.code === 11000) {
                res.status(500).render('account/account', {
                    errorMessage: 'Username and email need to be unique. Either username or email is already used.'
                });
            } else{
                next(error);
            }
        });
});




module.exports = router;