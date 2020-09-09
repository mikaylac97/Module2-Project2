const { Router } = require('express');
const router = new Router();
const mongoose = require('mongoose');
const Collection = require('../models/Collections.model');
const fileUploader = require('../configs/cloudinary.configs');
const User = require('../models/User.model');
const { post } = require('./post.routes');
const Post = require('../models/Post.model');

//get route to retrieve the collections page
router.get('/collections', (req, res, next) =>{
    User.findById(req.session.loggedInUser._id)
    .populate('collections')
    .populate({
        path: 'collections',
        populate: {
            path: 'author'
        }
    })
    .then(collectionsFromDb => {
        //console.log(collectionsFromDb.collections);
        res.render('collection/collection.hbs', {collections : collectionsFromDb.collections});
    })
    .catch(err=> {
        console.log(`Error finding specific user: ${err}`)
    })
})

//get route to go to specific collections page
router.get('/collection/:collectionId', (req, res, next) => {
    Collection.findById(req.params.collectionId)
    .then(collectionFromDb => {
        console.log('This is the collection from Db', collectionFromDb);
        res.render('collection/specific.collection.hbs');
    })
    .catch(err=> {
        console.log(`Error finding collection in database${err}`)
    })
})
    


//get route to retrieve the create-collections page
//** need to send the correct info to the hbs, and fix hbs when post route to add to collection is finished
router.get('/create-collection', (req, res, next) =>{

    res.render('collection/create-collection.hbs');
})

//post route to create a collection
router.post('/create-collection', fileUploader.single('image'), (req, res, next) => {
    const {title, description, tags} = req.body;

    const newCollection = {
        title,
        description,
        tags,
        author : req.session.loggedInUser._id

    };
    // if user uploads a photo for the collection
    if (req.file) {
        newCollection.collectionPhotoUrl = req.file.path;
        
      }

      Collection.create(newCollection)
      .then(newCollectionInDb => {
        User.findByIdAndUpdate(req.session.loggedInUser._id, {$push: {collections: newCollectionInDb._id}}, {new: true})
        .then(user => {
            //console.log(user);
            //console.log(`The new collection ${newCollectionInDb}`)
            res.redirect('/collections')
        })      
      })
      .catch(err => console.log(`Error while creating a new collection: ${err}`));

})

//get route to add posts to collections
router.get('/add-to-collection', (req, res, next) =>{
    const postId = req.params.postId;
    User.findById(req.session.loggedInUser._id)
    .populate('collections posts')
    .then(postsFromDb => {
         console.log('This is the posts from DB', postsFromDb.collections);
         for(let i = 0; i < postsFromDb.collections.length; i++) {
             console.log(postsFromDb.collections[i])
         }


        res.render('collection/add-to-collection.hbs', {data:postsFromDb} )
    })
    .catch(err=> {
        console.log(`Error finding collections from database: ${err}`);
    })



    
})

//post route to add posts to collections
router.post('/add-to-collection/:postId', (req, res, next) => {
    console.log('this is collection id', req.params.postId)
    
})


module.exports = router;