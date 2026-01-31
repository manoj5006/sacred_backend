const { db1 } = require('../framing/storage');
const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema(
  {
   tokenName: {
    type: String,
    default: '',
   },
   tokenSymbol: {
    type: String,
    default: '',
   },
   tokenAddress: {
    type: String,
    default: '',
   },
   tokenDecimals: {
    type: Number,
    default: 18,
   },
   tokenUsdtLastPrice: {
    type: Number,
    default: 0,
   },
   tokenBnbLastPrice: {
    type: Number,
    default: 0,
   },
   createdAt: {
    type: Date,
    default: Date.now,
   },
   updatedAt: {
    type: Date,
    default: Date.now,
   },
  },
);  

const Token = db1.model('Token', tokenSchema);
module.exports = Token;
