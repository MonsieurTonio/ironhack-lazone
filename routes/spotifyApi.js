const express = require('express');
const multer  = require('multer');
const router  = express.Router();
const uploadCloud = require('../config/cloudinary.js');
const ensureLogin = require('connect-ensure-login');
const User = require('../models/User.js');
const Data = require('../models/Artist.js');
const spotifyWebApi = require('spotify-web-api-node');

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

  router.get('/dashboard', function (req, res) {
    console.log(req.query)
    // spotifyApi.getArtist(req.query.artist)
    spotifyApi.getArtist("2HALYSe657tNJ1iKVXP2xA")
       .then(data => {
          res.render('dashboard',{artists:data.body.artists.items});
           console.log(data);
       })
       .catch(err => {
         console.log("error");
       })
      })

// Find artist name wer are looking for
  spotifyApi.searchArtists(/*'HERE GOES THE QUERY ARTIST'*/)
  .then(data => {

    console.log("The received data from the API: ", data.body);
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
  })
  .catch(err => {
    console.log("The error while searching artists occurred: ", err);
  })


spotifyApi.getArtist("2hazSY4Ef3aB9ATXW7F5w3")
 .then(function(data) {
   console.log(data.body.popularity);
   spotifyPopularityScore = data.body.popularity;
   console.log(spotifyPopularityScore);
   const newData = new Data({
       spotifyPopularityScore
   })

   .catch(error => {
    console.log("Something went wrong when retrieving an access token", error);
   })
  });