const { Router } = require('express');
const router = new Router();
const bcryptjs = require('bcryptjs');
const mongoose = require('mongoose');
const saltRounds = 10;
const User = require('../models/User.model');
const routeGuard = require('../configs/route-guard.config');
const fileUploader = require('../configs/cloudinary.configs');




//get route to get the account details edit page
router.get('/account/:accountId', (req, res, next) => {
    User.findById(req.params.accountId)
    .then(user => {
        console.log("This is the user", user)
        const authorized =  req.session.loggedInUser._id.toString() === user._id.toString()
        console.log(authorized)
        res.render('account/account.hbs', {user: user, authorized})

    }).catch(err => {`Error finding user in database${err}`})

    
})

//.post route to edit the account details page
router.post('/account-edit', fileUploader.single('image'), (req, res, next) => {
    const {firstname, lastname, username, email, password } = req.body;

    if(!username || !email || !password || !firstname || !lastname) {
        const authorized = true;
        res.render('account/account', {
            errorMessage: 'All fields are mandatory. Please provide your name, username, email and password.',authorized
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
            res.redirect('/login');//need to change this to redirect to their home page or something else
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

router.post('/delete-account', (req, res, next) => {
    User.find()
    .then(usersInDb => {
        usersInDb.forEach(user => {
            let indexToDelete = user.followers.indexOf(req.session.loggedInUser._id.toString())
             console.log("index of user to delete", indexToDelete);
            // console.log("each users followers array", user.followers);
            // console.log("the session of the", indexToDelete);
            user.followers.splice(indexToDelete,1) 

            user.save()
            .then(updatedUsers => {
                // console.log('this id should not be in the followers list anymore', req.session.loggedInUser._id)
                // console.log("the updated users followers list", updatedUsers.followers)
            }).catch(err => {console.log(`Error saving the updated users${err}`)})

        })
            User.findByIdAndDelete(req.session.loggedInUser._id)
            .then(userThatWasDeleted => {
                console.log("The user that was deleted is: ", userThatWasDeleted)
                req.session.destroy();
                res.redirect('/');
            }).catch(err => {console.log(`Error deleting user: ${err}`)})

    }).catch(err => console.log(`Error deleting the user from the other users followers array: ${err}`))
   
})


module.exports = router;