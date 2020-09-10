const { Router } = require('express');
const router = new Router();
const mongoose = require('mongoose');
const Collection = require('../models/Collections.model');
const fileUploader = require('../configs/cloudinary.configs');
const User = require('../models/User.model');
const { post } = require('./post.routes');
const Post = require('../models/Post.model');


//get route to go to specific collections page
router.get('/collection/:collectionId', (req, res, next) => {
    Collection.findById(req.params.collectionId)
    .populate('posts')
    .then(collectionFromDb => {  
        //console.log('This is the collection from Db', collectionFromDb);
        res.render('collection/specific.collection.hbs', collectionFromDb);
    })
    .catch(err=> {
        console.log(`Error finding collection in database${err}`)
    })
})

//post route to delete post from collection

router.post('/delete-from-collection/:postId/:collectionId', (req, res, next) => {
    //console.log('this is the post id', req.params.postId)
    //console.log('this is the collection id', req.params.collectionId)
    Collection.findByIdAndUpdate(req.params.collectionId)
    .then(collectionFromDb => {
        //console.log('this is the collection from db', collectionFromDb.posts)
        collectionFromDb.posts.forEach((element, index) =>{
            //console.log('this is the element',element)
            //console.log('this is the postId', req.params.postId)
            if(element == req.params.postId) {
                collectionFromDb.posts.splice(index,1)
                //console.log('in the for each splice---------------------------')
            }
        })
        collectionFromDb
        .save()
        .then(updatedCollection => {
            console.log('this is the updated collection', updatedCollection)
        res.redirect(`/collection/${req.params.collectionId}`)})
        .catch(err =>{`Error deleting post from collection`})

        
    })
    .catch(err => {console.log(`Error finding collection from database${err}`)});
})


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
    //const postId = req.params.postId;
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
    console.log('this is the post id', req.params.postId)
    console.log('this is the collection id', req.body.collections)
    Collection.findByIdAndUpdate(req.body.collections,{$push: {posts: req.params.postId}}, {new: true})
    .then(collectionUpdate => {
        console.log('this is the new collection' ,collectionUpdate);
        res.redirect(`/collection/${req.body.collections}`)
    })
    .catch(err => {`Error while adding post to collection: ${err}`})
})



//post route to delete collections
router.post('/delete-collection/:collectionId', (req, res, next) => {
    console.log(req.params.collectionId)
    Collection.findByIdAndDelete(req.params.collectionId)
    .then(deletedCollection => {
        console.log('this is the deleted collection', deletedCollection)
        res.redirect('/collections');
    })
    .catch(err=> {`Error deleting collection: ${err}`})
})



module.exports = router;