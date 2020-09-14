const express = require('express');
const router = express.Router();
const Post = require('../models/Post.model');
const Collection = require('../models/Collections.model');
const User = require('../models/User.model');
const { route } = require('./post.routes');

//GET home page
// router.post('/search', (req,res, next) => {
//     const { searchQuery } = req.body;
//     console.log(searchQuery)
//     Post.find({ 
//         $or:[ 
//             {tags: searchQuery},
//             {title: searchQuery},
//             {content: searchQuery},
//             {location: searchQuery}
//         ]
//     })
//     .populate('author')
//     .then((postSearchResult) => {
//         console.log(`post search result: ${postSearchResult}`)
//         User.find({
//             $or: [
//                 {username: searchQuery},
//                 {firstName: searchQuery},
//                 {lastName: searchQuery}
//             ]
//         })
//         .then((userSearchResult) => {
//             console.log(`user search result: ${userSearchResult}`)
//             Collection.find({
//                 $or: [
//                     {title: searchQuery},
//                     {description: searchQuery},
//                 ]
//             })
//             .then((collectionSearchResult) => {
//                 console.log(`collection search result: ${collectionSearchResult}`)
//                 res.render('posts/search', { searchResult: postSearchResult, userSearchResult: userSearchResult, collection: collectionSearchResult });
//             })
//         })
//     })
//     .catch((err) => {
//         console.log(`Error searching for a post: ${err}`)
//     });
// })


//get route to get the search results 
router.get('/search', (req, res, next) => {
//console.log(req.query.search)
const searchQuery = req.query.search.split(" ");
let response = [];
searchQuery.forEach(elem => {
    console.log("This is  a new elem", elem);
    Post.find({ 
                $or:[ 
                    {tags: elem},
                    {title: elem},
                    {content: elem},
                    {location: elem}
                ]
    })
    .then(postsFromDB => {
        response.push("This is in the post find", postsFromDB);
        console.log(response);
    }).catch(err =>{console.log(`Error finding posts: ${err}`)})
    User.find({ 
        $or:[ 
            {username: elem},
            {firstname: elem},
            {lastname: elem}
        ]
    })
    .then(userFromDB => {
        response.push(userFromDB);
        console.log("This is in the user find", response);
    }).catch(err =>{console.log(`Error finding Users: ${err}`)})
    Collection.find({ 
        $or:[ 
            {title: elem},
            {description: elem}
        ]
    })
    .then(collectionFromDB => {
        response.push(collectionFromDB);
        console.log("This is in the collection find", response);
    }).catch(err =>{console.log(`Error finding Collections: ${err}`)})


})


})

module.exports = router;