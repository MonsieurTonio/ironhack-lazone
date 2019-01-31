const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");


router.get('/', (req, res, next) => {
  User.findById(req.user._id, (err, user) => {

  res.render('dashboard');
});


module.exports = router;