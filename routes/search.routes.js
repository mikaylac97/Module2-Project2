const express = require('express');
const router = express.Router();
const Post = require('../models/Post.model');
const Collection = require('../models/Collections.model');
const User = require('../models/User.model');
const { route } = require('./post.routes');

// //GET home page
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
//const searchQuery = req.query.search.split(" ");
const searchQuery = req.query.search;
//const searchQuery = search.map(searchQuery => searchQuery.toLowerCase());
//console.log("this is the search query", searchQuery);
//let data = [];

    console.log("This is  a new searchQuery", searchQuery);
    Post.find({ 
                $or:[ 
                    {tags: searchQuery},
                    {title: searchQuery},
                    {content: searchQuery},
                    {location: searchQuery}
                ]
    })
    .populate('author')
    .then(postsFromDB => {
       // data.push({postsFromDB});
        //console.log(response);
        User.find({ 
                $or:[ 
                    {username: searchQuery},
                    {firstname: searchQuery},
                    {lastname: searchQuery}
                ]
            })
            .then(userFromDB => {
                //data.push({userFromDB});
            // console.log("This is in the user find", response);
                Collection.find({ 
                    $or:[ 
                        {title: searchQuery},
                        {description: searchQuery}
                    ]
                })
                .populate('author')
                .then(collectionFromDB => {
                   // data.push( {collectionFromDB} );
                    //console.log("This is in the collection find", {data: postsFromDB, userFromDB, collectionFromDB});
                    console.log("this is the final data",{postSearch: postsFromDB, userSearch: userFromDB, collectionSearch: collectionFromDB})
                    res.render('posts/search', {postSearch: postsFromDB, userSearch: userFromDB, collectionSearch: collectionFromDB});
                }).catch(err =>{console.log(`Error finding Collections: ${err}`)})
            }).catch(err =>{console.log(`Error finding Users: ${err}`)})
        }).catch(err =>{console.log(`Error finding posts: ${err}`)})
    



})

module.exports = router;