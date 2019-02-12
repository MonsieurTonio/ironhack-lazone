

const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const User = require("../models/User");
const SpotifyWebApi = require('spotify-web-api-node');
const Artist = require("../models/Artist")

mongoose
    .connect(process.env.MONGODB_URI, {
        useNewUrlParser: true
    })
    .then(x => {
        console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
    })
    .catch(err => {
        console.error('Error connecting to mongo', err)
    });

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


//On créé la fonction qui ajoute à un artiste les nouvelles data et retournant une promesse 
function updateArtist(id) {
    return new Promise(function (resolve, reject) {
            Artist.findOne({
                    spotifyAccountId: id
                })
                .then((artist) => {
                    spotifyApi.getArtist(id) //on chope les données de l'artiste
                        .catch(err => {
                            return next(err); //Si erreur => on arrêt tout et on veut afficher l'erreur
                        })
                        .then(data => {
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

//on initialise notre tableau de promesses
let promises = [];

//on cherche tous les artistes de la base de donées. pour chaque artiste, 
//on pousse dans le tableau de promesses la promesse de notre fonction updateArtist

Artist.find().then(function (artists) {
    artists.forEach(function (artist) {
        promises.push(updateArtist(artist.spotifyAccountId));
    })

    Promise.all(promises).then(function () {
        console.log("la base a été mise à jour")
    })
})