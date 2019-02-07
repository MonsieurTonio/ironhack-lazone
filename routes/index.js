  const express = require('express');
const multer  = require('multer');
const router  = express.Router();
const uploadCloud = require('../config/cloudinary.js');
const ensureLogin = require("connect-ensure-login");
const User = require('../models/User.js');
const spotifyApi = require('spotify-web-api-node');


/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});


router.get('/profile', /*ensureLogin.ensureLoggedIn(),*/ (req, res, next) => {

  console.log('coucouu')

    User.findById(req.user._id,function(err,user){
      console.log("hey");
      if (err) return next(err);

      console.log('user', user)

      res.render('profile', {
        user: user
      });
    })
});

router.post('/profile', /*ensureLogin.ensureLoggedIn(),*/ uploadCloud.single('photo'), (req, res, next) => {
  console.log('coucpu') 

  User.findById(req.user._id,function(err,user){
    if (err) return next(err);

    if (req.file) {
      user.avatarUrl = req.file.url
    }

    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.company = req.body.company;
    user.email= req.body.email;

    user.save(function(err, user){
      if (err) return next(err);

      res.send('/');
      console.log("yes");
    });


  });
  
});


module.exports = router;
