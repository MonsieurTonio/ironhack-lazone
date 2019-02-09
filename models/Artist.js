const mongoose = require('mongoose');
const Schema   = mongoose.Schema;


// DATAS MODEL

const dataSchema = new Schema ({
  date: Date,
  spotifyFlws: Number,
  deezerFlws: Number,
  facebookFans: Number,
  youtubeFlws: Number,
  spotifyPopularityScore: Number,
  deezerPopularityScore: Number,
},{
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Datas = mongoose.model('Datas', dataSchema);
module.exports = Datas;


// ARTIST MODEL

const artistSchema = new Schema ({
  artistName: String,
  spotifyAccountId: String,
  genre: String,
  album: [String],
  image: String,
  datas: [dataSchema]

}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Artist = mongoose.model('Artist', artistSchema);
module.exports = Artist;


