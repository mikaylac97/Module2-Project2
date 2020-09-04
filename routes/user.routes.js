const express = require('express');
const router = express.Router();
const User = require('../models/User.model');
const Post = require('../models/Post.model');

// GET user profile

router.get('/user-profile', (req, res, next) => {
    const authorized = true;
    res.render('profile', {authorized})
});

router.get('/user/:userId', (req, res, next) => {
    User.findById(req.params.userId)
    .populate('posts')
    .then((userFromDb) => {
        const authorized =  req.session.loggedInUser._id.toString() === userFromDb._id.toString()
        console.log(`User from db:${userFromDb}, ${authorized}`);
        res.render('profile', {user: userFromDb, authorized });
    })
    .catch(err => console.log(`Error while searching for user:${err}`));
});

module.exports = router;

//router.get('/posts', (req, res, next) => {
//     Post.find()
//     .populate('author')
//     .then(postsFromDB => {
//       res.render('posts/list', { posts: postsFromDB.reverse() });
//     })
//     .catch(err => console.log(`Err while getting all the posts: ${err}`));
// });