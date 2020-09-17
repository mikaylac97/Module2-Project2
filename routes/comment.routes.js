const express = require('express');
const router = express.Router();

const Post = require('../models/Post.model');
const Comment = require('../models/Comment.model');

//post route to save a comment in the DB on a post
router.post('/posts/:postId/comment', (req, res, next) => {
  const { postId } = req.params;
  const { content } = req.body;

  //find the specific post
  Post.findById(postId)
    .then(postFromDB => {
      //Create the new comment
      Comment.create({ content, author: req.session.loggedInUser._id })
        .then(newCommentFromDB => {
          //push the comment ID to the array of comments that belons to the post
          postFromDB.comments.push(newCommentFromDB._id);
          //
          postFromDB.numOfComments ++;
          //save the post with the comments to the DB
          postFromDB
            .save()
            .then(updatedPost => res.redirect(`/posts/${updatedPost._id}`))
            .catch(err => console.log(`Err while creating a comment on a post: ${err}`));
        })
        .catch(`Err while creating a comment on a post: ${err}`)
    })
    .catch(err => console.log(`Err while getting a single post when creating a comment: ${err}`));
});

module.exports = router ;