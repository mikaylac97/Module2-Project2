const { Router } = require('express');
const router = new Router();
const mongoose = require('mongoose');
const Collection = require('../models/Collections.model');


//get route to retrieve the collections page
router.get('/collections', (req, res, next) =>{

    res.render('collection/collection.hbs');
})


//post route to create a collection
router.post('/collections', (req, res, next) => {

    
})










module.exports = router;