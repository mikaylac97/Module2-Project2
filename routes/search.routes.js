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
        $or:[ 
            {tags: searchQuery},
            {title: searchQuery},
            {content: searchQuery},
            {location: searchQuery}
        ]
    })
    .populate('author')
    .then((postSearchResult) => {
        console.log(`post search result: ${postSearchResult}`)
        User.find({
            $or: [
                {username: searchQuery},
                {firstName: searchQuery},
                {lastName: searchQuery}
            ]
        })
        .then((userSearchResult) => {
            console.log(`user search result: ${userSearchResult}`)
            Collection.find({
                $or: [
                    {title: searchQuery},
                    {description: searchQuery},
                ]
            })
            .then((collectionSearchResult) => {
                console.log(`collection search result: ${collectionSearchResult}`)
                res.render('posts/search', { searchResult: postSearchResult, userSearchResult: userSearchResult, collection: collectionSearchResult });
            })
        })
    })
    .catch((err) => {
        console.log(`Error searching for a post: ${err}`)
    });
})

module.exports = router;