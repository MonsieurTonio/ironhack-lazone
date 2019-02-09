const express = require('express');
const multer  = require('multer');
const router  = express.Router();
const uploadCloud = require('../config/cloudinary.js');
const ensureLogin = require("connect-ensure-login");
const User = require('../models/User.js');

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index", {
    logged: !!req.user
  });
});




router.get('/profile', /*ensureLogin.ensureLoggedIn(),*/ (req, res, next) => {

    User.findById("5c535b61d59e8a3d7269016c",function(err,user){
      if (err) return next(err);

      console.log('user', user)

      res.render('profile', {
        user: user
      });
    })
});

router.post('/profile', ensureLogin.ensureLoggedIn(), uploadCloud.single('photo'), (req, res, next) => {
  console.log('coucou', req.file.url) 

  User.findById("5c535b61d59e8a3d7269016c",function(err,user){
    if (err) return next(err);
    user.avatarUrl = req.file.url
    user.save(function(err,user){
      if (err) return next(err);
      res.send('update ok')
    });

  });
  
});


module.exports = router;
