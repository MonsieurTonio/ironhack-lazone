const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const ensureLogin = require("connect-ensure-login");
const SpotifyWebApi = require('spotify-web-api-node');

// Remember to insert your credentials here
const spotifyApi = new SpotifyWebApi({
  clientId : process.env.spotifyClientId,
  clientSecret : process.env.spotifyClientSecret
 });
 
 // Retrieve an access token
 spotifyApi.clientCredentialsGrant()
   .then( data => {
     spotifyApi.setAccessToken(data.body['access_token']);
   })
   .catch(error => {
     console.log('Something went wrong when retrieving an access token', error);
   })

router.get('/', ensureLogin.ensureLoggedIn(), (req, res, next) => {
  console.log('hey')
  User.findById(req.user._id, (err, user) => {
    if (err) return next(err);

    res.render('dashboard', { user: user });
  })
});

router.post('/', (req, res, next) => {
  console.log(req.body.artist)
  spotifyApi.searchArtists(req.body.artist,{ limit: 5})
  .then(data => {
            res.render('dashboard',{artists:data.body.artists.items});
            console.log(data);
        })
        .catch(err => {
          console.log("error");
        })
    })


module.exports = router;
