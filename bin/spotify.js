const path = require('path').resolve(process.cwd()+'/..', '.env');
console.log('path=', path);

require('dotenv').config({
    path: path
});

const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const User = require("../models/User");
const SpotifyWebApi = require('spotify-web-api-node');
const Artist = require("../models/Artist")

mongoose
    //.connect("mongodb://localhost/ironhack-zone", {
    .connect(process.env.MONGODB_URI, {useNewUrlParser: true})
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


// Retrieve an access token
spotifyApi.clientCredentialsGrant()
    .then(data => {
        spotifyApi.setAccessToken(data.body.access_token);
        Artist.find().then(function (artists) {
            artists.forEach(function (artist) {
            updateArtist(artist.spotifyAccountId)//.then().catch()
        })})
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
                .catch(reject)
                .then((artist) => {
                    //console.log(artist)
                    spotifyApi.getArtist(id) //on chope les données de l'artiste
                        .catch(reject)
                        .then(data => {
                                console.log("test2")
                                artist.datas.push({
                                    spotifyFlws: data.body.followers.total,
                                    spotifyPopularityScore: data.body.popularity
                                })
                                artist.save()
                                    .catch(reject)
                                    .then(resolve);
                            })
                });
        })
    }

