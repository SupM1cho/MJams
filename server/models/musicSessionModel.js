// musicSessionModel.js

const mongoose = require('mongoose');
const { Schema } = mongoose;

const musicSessionSchema = new Schema({
  sessionName: {
    type: String,
    required: true,
  },
  tracks: [
    {
      // You can define the structure of the tracks as needed
      // For example, the track might have a title, artist, and other details
      title: {
        type: String,
        required: true,
      },
      artist: {
        type: String,
        required: true,
      },
      // Add other properties as needed
    },
  ],
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // You can add more fields as needed for your music session model
});

const MusicSession = mongoose.model('MusicSession', musicSessionSchema);

module.exports = MusicSession;
