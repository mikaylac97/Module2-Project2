const express = require('express');
const router = express.Router();
const Post = require('../models/Post.model');
const Collection = require('../models/Collections.model');
const User = require('../models/User.model');

//GET home page
router.post('/search', (req,res, next) => {
    const { searchQuery } = req.body;
    console.log(searchQuery)
    Post.find({ 
        tags: searchQuery
    })
    .then((postSearchResult) => {
        console.log(`post search result: ${postSearchResult}`)
        res.render('posts/search', postSearchResult);
    })
    .catch((err) => {
        console.log(`Error searching for a post: ${err}`)
    });
})

module.exports = router;