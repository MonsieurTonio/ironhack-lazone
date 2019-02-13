const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const ensureLogin = require("connect-ensure-login");
const SpotifyWebApi = require('spotify-web-api-node');
const document = require('../views')
const Artist = require("../models/Artist")
const hbs     = require('hbs');




router.get('/:artistId', ensureLogin.ensureLoggedIn(), (req, res, next) => {
  Artist.findById(req.params.artistId, (err, artist) => {
    if (artist) {
      res.render('artist-details', {artist: artist});
    }

    else {
      res.end("Bad Request");
    }
  })
});




module.exports = router;