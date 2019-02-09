const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const ensureLogin = require("connect-ensure-login");
const SpotifyWebApi = require('spotify-web-api-node');
const document = require('../views')
const Artist = require("../models/Artist")


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
  });



router.get('/', ensureLogin.ensureLoggedIn(), (req, res, next) => {
  console.log('hey');

  // User.findById(req.user._id) ---> On n'utilise pas le User.findById car il est déjà dans le req.user grâce au ensureLogin
  //   .catch(err => next(err))
  //   .then((user) => {
  //   })
  // ;

  // Ici rajouter les artistes déjà saved dans ma database

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

      Artist.findOne({spotifyAccountId: req.body.artistid})
      .then((artist) => {
          if (!artist) {
            spotifyApi.getArtist(req.body.artistid)
              .catch(err => {
                return next(err); //Si erreur => on arrêt tout et on veut afficher l'erreur
              })
              .then((data) => {
                console.log(data.body.name);
                var newArtist = new Artist({
                  artistName: data.body.name,
                  spotifyAccountId: data.body.id,
                  genre: data.body.genres,
                  album: data.body.albums,
                  image:data.body.images[0].url,
                  datas: [
                    {
                      spotifyFlws: data.body.followers.total,
                      spotifyPopularityScore: data.body.popularity
                    }
                  ]
                })

                newArtist.save(function (err) {
                  if (err) {
                    return next(err);
                  } else {
                    console.log('Save artist successfully!');
                  }
                })
                res.render('dashboard') //on envoie le dashboard pour répondre à la requête
              })
            
            

          }
          else {
            res.render('dashboard', {message: 'You are already following this artist'})

          }
      })
    })
  

module.exports = router;
