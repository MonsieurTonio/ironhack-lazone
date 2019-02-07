const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const ensureLogin = require("connect-ensure-login");
const SpotifyWebApi = require('spotify-web-api-node');
const document = require('../views')

// Remember to insert your credentials here
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.spotifyClientId,
  clientSecret: process.env.spotifyClientSecret
});

// Retrieve an access token
spotifyApi.clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  })



router.get('/', ensureLogin.ensureLoggedIn(), (req, res, next) => {
  console.log('hey');



  // User.findById(req.user._id) ---> On n'utilise pas le User.findById car il est déjà dans le req.user grâce au ensureLogin
  //   .catch(err => next(err))
  //   .then((user) => {

  //   })
  // ;
      

  // ICI rajouter les artistes déjà saved dans ma database

    let dbartists = req.user.artistsFollowed

    if (req.query.artist) {
      spotifyApi.searchArtists(req.query.artist)
        .catch(err => {
          return next(err); //Si erreur => on arrêt tout et on veut afficher l'erreur
        })  
        .then((data) => {
          res.render('dashboard', {
            artistsfound: data.body.artists.items,
            queryname: req.query.artist,
            myartists: dbartists
          });
        })
      ;
    } else {
      res.render('dashboard', {
        myartists: dbartists
      });
    }


  })

  // })



router.post('/', (req, res, next) => {
  res.send('post ok') // on envoie "ok" pour répondre à la requête
});


module.exports = router;
