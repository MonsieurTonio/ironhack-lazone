const express = require('express');
const multer  = require('multer');
const router  = express.Router();
const uploadCloud = require('../config/cloudinary.js');

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/dashboard', (req, res, next) => {
  res.render('dashboard');
});

router.get('/profile', (req, res, next) => {

    res.render('profile');

});

router.post('/profile', uploadCloud.single('photo'), (req, res, next) => {
  console.log('coucpu', req.file.url)   

  res.send('okk')

  // pic.save((err) => {
  //   if (err) return next(err);

  //     res.redirect('/profile');
  // });
});


module.exports = router;
