const { Router } = require('express');
const router = new Router();
const mongoose = require('mongoose');
const User = require('../models/User.model');



//get route to show all the users on the site
router.get('/user-list', (req, res, next) => {
    User.find()
    .then(usersFromDb =>{
        //console.log('The users from the database are: ', usersFromDb)
        const data = {
             newData: []
        };
            usersFromDb.forEach(user => {
                console.log({currentUser: req.session.loggedInUser.following, user: user._id})
                    //console.log(user.isFollowing =  req.session.loggedInUser.following.includes(user._id.toString()));
                user.isFollowing =  req.session.loggedInUser.following.includes(user._id.toString()) ? true : false;
                    //console.log(user.isFollowing)
                    //let newDataEntry = user;
                    //newDataEntry.isFollowing = req.session.loggedInUser.following.includes(user._id.toString());
            // console.log({user});
            data.newData.push(user);
             })

            // usersFromDb.forEach(user => {
            //     let isFollowing =  req.session.loggedInUser.following.includes(user._id.toString());
            //     usersFromDb.push({user, isFollowing})

            // })
       // console.log('this is the new datat', usersFromDb)
       // console.log({data: data.newData});
             console.log(data)
        res.render('user-lists.hbs', data);
    })
    .catch(err =>{console.log(`Error finding users from database${err}`)})
})


// //post route to add to following
// router.post('/follow/:personToFollowId', (req, res, next) => {
//     //find logged in user and add person to the following array
//     console.log({theIdToFollow: req.params.personToFollowId})
//     //find the current user and push the person to follow ID into the following schema array
//     User.findByIdAndUpdate(req.session.loggedInUser._id, {$push: {following: req.params.personToFollowId}}, {new: true})
//     .then(userFromDb => {
//             //find the person that was just followed and push current user into followers schema array
//             User.findByIdAndUpdate(req.params.personToFollowId, {$push: {followers: req.session.loggedInUser._id}}, {new: true})
//             .then(otherUserFromDb => {
//                 //isFollowing = true;
//                 res.redirect(`/user-list`);
//             })
//             .catch(err =>{console.log(`Error adding current user to followers array:${err}`)})

        
//     })
//     .catch(err=>{console.log(`Error adding user to the following array: ${err}`)})

// })



// //post route to delete from following
// router.post('/un-follow/:personToUnFollowId', (req, res, next) => {
//     console.log({theUnfollowId: req.params.personToUnFollowId});
//     //find logged in user and remove person from the following array
//     User.findByIdAndUpdate(req.session.loggedInUser._id, {$pull: {following: req.params.personToUnFollowId}}, {new: true})
//     .then(userFromDb => {
//         //find the unfollowed user and remove current user from their followers array
//         User.findByIdAndUpdate(req.params.personToUnFollowId, {$pull: {followers: req.session.loggedInUser._id}}, {new: true})
//         .then(otherUserFromDb => {
//             res.redirect('/user-list');
//         })
//         .catch(err => {console.log(`Error removing current user from the followers array: ${err}`)})
//     })
//     .catch(err => {console.log(`Error removing user from the following array: ${err}`)})

// })


//This block of code below replaces both follow and unfollow routes. If I have to refactor, will implement

router.post('/follow/:personToFollowsId', (req, res, next) => {
    User.findById(req.params.personToFollowsId)
    .then(userToFollow => {
      userToFollow.followers.includes(req.session.loggedInUser._id)
          ? userToFollow.followers.pull(req.session.loggedInUser._id)
          : userToFollow.followers.push(req.session.loggedInUser._id);
      userToFollow.save()
      .then(updatedUserToFollow => {
          //console.log({updatedUserToFollow});
        User.findById(req.session.loggedInUser._id)
            .then((currentUser) => {
                currentUser.following.includes(req.params.personToFollowsId)
                    ? currentUser.following.pull(req.params.personToFollowsId)
                    : currentUser.following.push(req.params.personToFollowsId);
                //this sets logged in user to current user to update the information in the session
                req.session.loggedInUser = currentUser;
                currentUser
                    .save()
                    .then((updatedCurrentUser) => {
                        //console.log({ updatedCurrentUser });
                        res.redirect("back");
                    }).catch((err) => next(err));
            }).catch((err) => next(err));
      }).catch(err => next(err));
    }).catch(err => next(err));
  })






module.exports = router;