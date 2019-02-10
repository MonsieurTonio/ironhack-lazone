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

  User.findById(req.user._id) // ---> On n'utilise pas le User.findById car il est déjà dans le req.user grâce au ensureLogin
    .catch(err => next(err))
    .then((user) => {

      // Ici rajouter les artistes déjà saved dans ma database

      let dbartists = req.user.artistsFollowed

      if (req.query.artist) {
        spotifyApi.searchArtists(req.query.artist)
          .catch(err => {
            return next(err); //Si erreur => on arrête tout et on veut afficher l'erreur
          })
          .then((data) => {
            res.render('dashboard', {
              user: user,
              artistsfound: data.body.artists.items,
              queryname: req.query.artist,
              myartists: mdbartists
            });
          })
          ;
      } else {
        res.render('dashboard', {
          user: user,
          myartists: dbartists
        });
      }
    })
  ;
})


router.post('/', (req, res, next) => {

  Artist.findOne({
      spotifyAccountId: req.body.artistid
    })
    .then((artist) => {
      if (!artist) {
        spotifyApi.getArtist(req.body.artistid) //on chope les données de l'artiste
          .catch(err => {
            return next(err); //Si erreur => on arrêt tout et on veut afficher l'erreur
          })
          .then(artist => { 
              spotifyApi.getArtistTopTracks(req.body.artistid, 'FR') //on chope les top tracks
            .then(toptracks => {
              console.log(toptracks);
              console.log(artist);
              var newArtist = new Artist({
                artistName: artist.body.name,
                spotifyAccountId: artist.body.id,
                genre: artist.body.genres,
                album: artist.body.albums,
                image: artist.body.images[0].url,
                toptracks:[toptracks.body.tracks[0].name,toptracks.body.tracks[1].name,toptracks.body.tracks[2].name],
                datas: [{
                  spotifyFlws: artist.body.followers.total,
                  spotifyPopularityScore: artist.body.popularity
                }]
              })

              newArtist.save(function (err) {
                if (err) {
                  return next(err);
                } else {
                  console.log('Save artist successfully!');
                }
              })

              User.findById(req.user._id, function (err, user){
                if (err) return next (err);
                user.artistsFollowed.push(newArtist._id)
                console.log("Artist saved artist followed")
                user.save();
              })

              res.render('dashboard') //on envoie le dashboard pour répondre à la requête
            })
          }

        )


      } else {
        res.render('dashboard', {
          message: 'You are already following this artist'
        })

      }
    })

})


module.exports = router;
