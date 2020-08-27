const express = require('express');
const router = express.Router();

const Post = require('../models/Post.model');
const Comment = require('../models/Comment.model');


//Get route to render a form for users to create a new post
router.get('/post-create', (req, res) => res.render('posts/create'));

//Post route to save the new post in the Database
router.post('/post-create', (req, res, next) => {
  const { title, content, tags } = req.body;

  Post.create({
    title,
    content,
    author: req.session.loggedInUser._id,
    tags
  })
  .then(postDocFromDB => {
    console.log(postDocFromDB);
    res.redirect('/posts')
  })
  .catch(err => console.log(`Error while creating a new post: ${err}`));
});

//get route to display all posts
router.get('/posts', (req, res, next) => {
  Post.find()
    .populate('author')
    .then(postsFromDB => {
      res.render('posts/list', { posts: postsFromDB });
    })
    .catch(err => console.log(`Err while getting all the posts: ${err}`));
});

//get route to show the details of a single post

router.get('/posts/:postId', (req, res, next) => {
  Post.findById(req.params.postId)
    .populate('author comments')
    .populate({
      path: 'comments',
      populate: {
        path: 'author'
      }
    })
    .then((foundPost) => {
      console.log(`The post information:${foundPost}`);
      res.render('posts/details', { post: foundPost })
    })
    .catch(err => console.log(`Err while getting a single post ${err}`));
});

module.exports = router;