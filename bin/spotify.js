const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const User = require("../models/User");
const SpotifyWebApi = require('spotify-web-api-node');
const Artist = require("../models/Artist")

mongoose
  .connect("mongodb://localhost/ironhack-zone", {useNewUrlParser: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

 ///Remember to insert your credentials here
const spotifyApi = new SpotifyWebApi({
    clientId: "0dc82ce71cc44e398918b885902b4226",
    clientSecret: "905fa4fee88f4e03aa2a837cb1c6f08b"
});

// Retrieve an access token
spotifyApi.clientCredentialsGrant()
    .then(data => {
        spotifyApi.setAccessToken(data.body.access_token);
        console.log(data)
        console.log("logé")
        
    })
    .catch(error => {
        console.log('Something went wrong when retrieving an access token', error);
    });

spotifyApi.getArtist('5c6063bf60cfc173e06b6429')
.then(data => {
    console.log(data)
})
.catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
});

//   //On créé la fonction qui ajoute à un artiste les nouvelles data et retournant une promesse 
function updateArtist(id) {
    return new Promise(function (resolve, reject) {
            Artist.findOne({
                    spotifyAccountId: id
                })
                .then((artist) => {
                    //console.log(artist)
                    spotifyApi.getArtist(id) //on chope les données de l'artiste
                        .catch(err => {
                            console.log("test")
                            return next(err); //Si erreur => on arrêt tout et on veut afficher l'erreur
                        })
                        .then(data => {
                                console.log("test2")
                                artist.datas.push({
                                    spotifyFlws: data.body.followers.total,
                                    spotifyPopularityScore: data.body.popularity
                                })
                                artist.save()
                            }


                        )
                });
        })
    }


Artist.find().then(function (artists) {
    artists.forEach(function (artist) {
        updateArtist(artist.spotifyAccountId);
    })})
