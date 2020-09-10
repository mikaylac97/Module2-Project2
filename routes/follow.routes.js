const { Router } = require('express');
const router = new Router();
const mongoose = require('mongoose');
const User = require('../models/User.model');


//get route to show all the users on the site
router.get('/user-list', (req, res, next) => {
    User.find()
    .then(usersFromDb =>{
        console.log('The users from the database are: ', usersFromDb)
        res.render('user-lists.hbs', {users:usersFromDb});
    })
    .catch(err =>{console.log(`Error finding users from database${err}`)})
})


//post route to add to following
router.post('/follow/:personToFollowId', (req, res, next) => {
    //find logged in user and add person to the following array
    console.log('the user to follows id is', req.params.personToFollowId)
    //find the current user and push the person to follow ID into the following schema array
    User.findByIdAndUpdate(req.session.loggedInUser._id, {$push: {following: req.params.personToFollowId}}, {new: true})
    .then(userFromDb => {
            //find the person that was just followed and push current user into followers schema array
            User.findByIdAndUpdate(req.params.personToFollowId, {$push: {followers: req.session.loggedInUser._id}}, {new: true})
            .then(otherUserFromDb => {
                res.redirect('/user-list');
            })
            .catch(err =>{console.log(`Error adding current user to followers array:${err}`)})

        
    })
    .catch(err=>{console.log(`Error adding user to the following array: ${err}`)})

})



//post route to delete from following
router.post('/un-follow/:personToUnFollowId', (req, res, next) => {
    //find logged in user and remove person from the following array
    User.findByIdAndUpdate(req.session.loggedInUser._id, {$pull: {following: req.params.personToUnFollowId}}, {new: true})
    .then(userFromDb => {
        //find the unfollowed user and remove current user from their followers array
        User.findByIdAndUpdate(req.session.loggedInUser._id, {$pull: {following: req.params.personToUnFollowId}}, {new: true})
        .then(otherUserFromDb => {
            res.redirect('/user-list');
        })
        .catch(err => {console.log(`Error removing current user from the followers array: ${err}`)})
    })
    .catch(err => {console.log(`Error removing user from the following array: ${err}`)})

})











module.exports = router;