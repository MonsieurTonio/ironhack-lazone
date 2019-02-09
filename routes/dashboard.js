const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
//const ensureLogin = require("connect-ensure-login");

router.get('/'/*,ensureLogin.ensureLoggedIn()*/, (req, res, next) => {
  User.findById("5c535b61d59e8a3d7269016c",function(err,user){
  //User.findById(req.user._id, (err, user) => {
    if (err) return next(err);
    res.render('dashboard', { user: user });
  })
});

module.exports = router;
