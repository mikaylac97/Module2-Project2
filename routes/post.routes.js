const express = require('express');
const router = express.Router();
const axios = require('axios');
const fileUploader = require('../configs/cloudinary.configs');
const Post = require('../models/Post.model');
const Comment = require('../models/Comment.model');
const User = require('../models/User.model');

//Get route to render a form for users to create a new post
router.get('/post-create', (req, res) => res.render('posts/create'));

//Post route to save the new post in the Database
router.post('/post-create', fileUploader.single('image'), (req, res, next) => {
  const { title, content, tags, location } = req.body;
  const separatedTags = tags.split(' ');
  let longitude = 0;
  let latitude = 0;
  let numOfLikes = 0;

  axios
    .get(`https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=AIzaSyBewseqyTOFrXo5QzeUi1Zj9nsoEoMvHRw&callback`)
    .then(response =>{
      console.log('Response from google data results:' + response.data.results[0].geometry.location.lng);
      console.log('Response from google data results:' + response.data.results[0].geometry.location.lat);
      longitude = response.data.results[0].geometry.location.lng;
      latitude = response.data.results[0].geometry.location.lat;
      
      Post.create({
        title,
        numOfLikes,
        content,
        author: req.session.loggedInUser._id,
        tags: separatedTags,
        imageUrl: req.file.path,
        location: {
          type: 'Point',
          coordinates: [longitude, latitude]
        }
      })
      .then(postDocFromDB => {
        User.findByIdAndUpdate(req.session.loggedInUser._id, {$push: {posts: postDocFromDB._id}}, {new: true}) //{posts : [...req.user.posts, postDocFromDB._id]})
        .then(user => {
          res.redirect('/posts')
        })
      })
      .catch(err => console.log(`Error while creating a new post: ${err}`));
    })
    .catch(err =>{ `Error while requesting Geocode location from API: ${err}`});
});

//get route to display all posts
router.get('/posts', (req, res, next) => {
  Post.find()
    .populate('author')
    .then(postsFromDB => {
      //the following is added by andrew
      postsFromDB.forEach(post => {
        console.log("this is the num of likes: ", post.numOfLikes)
        post.isPostLiked = req.session.loggedInUser.likes.includes(post._id.toString()) ? true : false;
        
    })
      // this ends what was added by andrew
      res.render('posts/list', { posts: postsFromDB.reverse() });
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
      const authorized =  req.session.loggedInUser._id.toString() === foundPost.author._id.toString()
      console.log('53',req.session.loggedInUser._id, foundPost.author._id,authorized)
      res.render('posts/details', { post: foundPost, authorized, encodedPost: JSON.stringify(foundPost) })

      //the following is added by andrew to populate the collection drop down menu
//       User.findById(req.session.loggedInUser._id)
//       .populate('collections')
//       .then(collectionsFromDb => {
          //  console.log('This is the posts from DB', postsFromDb.collections);
          //  for(let i = 0; i < postsFromDb.collections.length; i++) {
          //      console.log(postsFromDb.collections[i])
          //  }
          //res.render('collection/add-to-collection.hbs', {data:postsFromDb} )
          //console.log(`The post information:${foundPost}`);
              //const authorized =  req.session.loggedInUser._id.toString() === foundPost.author._id.toString()
          //console.log('53',req.session.loggedInUser._id, foundPost.author._id,authorized)
              //console.log('this is the collectionsfromdb', collectionsFromDb.collections)
             // res.render('posts/details', { post: foundPost, authorized, collectionsFromDb })

//       }).catch(err=> {console.log(`Error finding collections from database: ${err}`);})

      //this ends the collection drop down menu edit

      // console.log(`The post information:${foundPost}`);
      // const authorized =  req.session.loggedInUser._id.toString() === foundPost.author._id.toString()
      // console.log('53',req.session.loggedInUser._id, foundPost.author._id,authorized)
      // res.render('posts/details', { post: foundPost, authorized })
// >>>>>>> master
    })
    .catch(err => console.log(`Err while getting a single post ${err}`));
});

//get route to edit any given post
router.get('/posts/edit/:postId', (req, res, next) => {
  const { postId } = req.params;

  Post.findById(postId)
    .then((postToEdit) => {
      console.log(postToEdit);
      res.render('posts/post-edit', { post: postToEdit });
    })
    .catch( err => console.log(`Error while getting the post to Edit ${err}`));
});

//post route to edit a post
router.post('/posts/edit/:postId', (req, res, next) => {
  Post.findByIdAndUpdate(req.params.postId, req.body, { new:true })
    .then((updatedPost) => {
      console.log(`Update post information: ${updatedPost}`);
      res.redirect(`/posts/${updatedPost._id}`);
    })
    .catch(err => console.log(`Error while updating the post: ${err}`));
});

//POSt route to delete the post
router.post('/posts/delete/:postId', (req, res, next) => {
  Post.findByIdAndDelete(req.params.postId)
    .then(() => {
      res.redirect('/posts')
    })
    .catch(err => console.log(`Err while deleting a post: ${err}`));
});

module.exports = router;