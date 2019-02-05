const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const ensureLogin = require("connect-ensure-login");


router.get('/', ensureLogin.ensureLoggedIn(), (req, res, next) => {
  User.findById(req.user._id, (err, user) => {
    if (err) return next(err);

    res.render('dashboard', { user: user });
  })
});


module.exports = router;