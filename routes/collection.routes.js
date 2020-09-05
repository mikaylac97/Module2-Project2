const { Router } = require('express');
const router = new Router();
const mongoose = require('mongoose');
const Collection = require('../models/Collections.model');


//get route to retrieve the collections page
router.get('/collections', (req, res, next) =>{
  res.render('collection/collection.hbs');
})

//GET route to retrieve create a collection page

router.get('/collection-create', (req, res, next) =>{
    res.render('collection/create-collection.hbs');
  })

//post route to create a collection
router.post('/collections', (req, res, next) => {
    
})


module.exports = router;