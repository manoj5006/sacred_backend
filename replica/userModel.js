const mongoose = require('mongoose');
const { db1 } = require('../framing/storage');

const userSchema = new mongoose.Schema({
    walletAddress: { type: String, required: true },
    shortAddress: { type: String, required: true },
    walletType: { type: String, required: true },
    referralCode: { type: String},
    referedBy: { type: String ,require:true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

const User = db1.model('User', userSchema);

module.exports = User;

