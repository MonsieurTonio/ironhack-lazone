const express = require('express');
const multer  = require('multer');
const router  = express.Router();
const uploadCloud = require('../config/cloudinary.js');
const ensureLogin = require('connect-ensure-login');
const User = require('../models/User.js');
const Data = require('../models/Artist.js');

const SpotifyWebApi = require('spotify-web-api-node');

// Remember to insert your credentials here
const spotifyApi = new SpotifyWebApi({
 clientId : process.env.spotifyClientId,
 clientSecret : process.env.spotifyClientSecret
});

// Retrieve an access token
// Retrieve an access token
spotifyApi.clientCredentialsGrant()
  .then( data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
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