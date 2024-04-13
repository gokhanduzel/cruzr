const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
  carListingId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'CarListing'
  },
  offererUserId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  receiverUserId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  offerAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const Offer = mongoose.model('Offer', offerSchema);

module.exports = Offer;
