const { Router } = require('express');
const router = new Router();
const mongoose = require('mongoose');
const User = require('../models/User.model');
const Post = require('../models/Post.model');

router.get('/all-posts', (req, res, next) => {
    Post.find()
      .populate('author')
      .then(postsFromDB => {
          const data = {
                newData: []
          };
        postsFromDB.forEach(post => {
            post.isPostLiked = req.session.loggedInUser.likes.includes(post._id.toString()) ? true : false;
            data.newData.push(post);
        })

        console.log(data);
        res.render('all-posts', { posts: postsFromDB.reverse() });
      })
      .catch(err => console.log(`Err while getting all the posts: ${err}`));
  });

// router.post('/like/:postToLikeId', (req, res, next) => {
//     User.findById(req.session.loggedInUser._id)
//     .then(currentUser => {
//         // currentUser.likes.includes(req.params.postToLikeId)
//         //     ? currentUser.likes.pull(req.params.postToLikeId) req.params.postToLikeId.numOfLikes ++
//         //     : currentUser.likes.push(req.params.postToLikeId)
//         if(currentUser.likes.includes(req.params.postToLikeId)){
//             currentUser.likes.pull(req.params.postToLikeId) 
//             Post.findById(req.params.postToLikeId)
//             .then(postFromDb =>{
//                 postFromDb.numOfLikes ++;
//                 console.log("this is the num of likes before increment for this post", postFromDb.numOfLikes)
//                 currentUser.save()
//                 .then(updatedCurrentUser => {
//                     req.session.loggedInUser = updatedCurrentUser;
//                     res.redirect('back')
//                 }).catch(err =>{`Error adding post to current user likes${err}`})
//             }).catch(err=>{console.log(`Error incrementing the numOflikes array: ${err}`)})
//         } else{
//             currentUser.likes.push(req.params.postToLikeId)
//             Post.findById(req.params.postToLikeId)
//             .then(postFromDb =>{
//                     postFromDb.numOfLikes --;
//                     console.log("this is the num of likes before decrement for this post", postFromDb.numOfLikes)
//                     currentUser.save()
//                     .then(updatedCurrentUser => {
//                         req.session.loggedInUser = updatedCurrentUser;
//                         res.redirect('back')
//                     }).catch(err =>{`Error adding post to current user likes${err}`})
//             }).catch(err=>{console.log(`Error decrementing the numOflikes array: ${err}`)})
//         }
//         // currentUser.save()
//         // .then(updatedCurrentUser => {
//         //     req.session.loggedInUser = updatedCurrentUser;
//         //     res.redirect('back')
//         // }).catch(err =>{`Error adding post to current user likes${err}`})
//     }).catch(err =>{`Error finding logged in User${err}`})
// })


router.post('/like/:postToLikeId', (req, res, next) => {
    User.findById(req.session.loggedInUser._id)
    .then(currentUser => {
        if(currentUser.likes.includes(req.params.postToLikeId)){
            currentUser.likes.pull(req.params.postToLikeId) 
                currentUser.save()
                .then(updatedCurrentUser => {
                    req.session.loggedInUser = updatedCurrentUser;
                    Post.findById(req.params.postToLikeId)
                        .then(postFromDb =>{
                            postFromDb.numOfLikes --;
                            //console.log("this is the num of likes before decrement for this post", postFromDb.numOfLikes)
                            postFromDb.save()
                            .then(updatedPost => {
                                res.redirect('back')
                            }).catch(err => console.log(`Error updating num of likes array ${err}`))
                            
                    }).catch(err =>{`Error adding post to current user likes${err}`})
                }).catch(err =>{`Error adding post to current user likes${err}`})
        } else{
            currentUser.likes.push(req.params.postToLikeId)
                    currentUser.save()
                    .then(updatedCurrentUser => {
                        req.session.loggedInUser = updatedCurrentUser;
                        Post.findById(req.params.postToLikeId)
                        .then(postFromDb =>{
                            postFromDb.numOfLikes ++;
                            //console.log("this is the num of likes before decrement for this post", postFromDb.numOfLikes)
                            postFromDb.save()
                            .then(updatedPost => {
                                res.redirect('back')
                            }).catch(err => console.log(`Error updating num of likes array ${err}`))
                            
                    }).catch(err =>{`Error adding post to current user likes${err}`})
                    }).catch(err =>{`Error adding post to current user likes${err}`})
        }
    }).catch(err =>{`Error finding logged in User${err}`})
})


module.exports = router;