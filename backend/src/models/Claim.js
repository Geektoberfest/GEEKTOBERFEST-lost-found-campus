const mongoose = require('mongoose')
const Item = require('./Item')

const claimSchema = new mongoose.Schema(
    {
        item: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Item",
            required: true
        },
        claimant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        message: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending'
        }
    },
    { timestamps: true }
)

module.exports = mongoose.model('Claim', claimSchema)
// Example (MongoDB/Mongoose)
const claimSchema = new mongoose.Schema({
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
  claimantId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  evidenceText: { type: String, required: true },
  evidenceUrl: { type: String },
  createdAt: { type: Date, default: Date.now }
});