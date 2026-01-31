const mongoose = require('mongoose');
const { db1 } = require('../framing/storage');

const depositSchema = new mongoose.Schema(
    {
        tokenAddress: {
            type: String,
            required: true,
        },
        tokenSymbol: {
            type: String,
            required: true,
        },
        depositeAmount: {
            type: String,
            required: true,
        },
        amountInWei: {
            type: String,
            required: true,
        },
        transaction: {
            type: Object,
            required: true,
        }
    },
    {
        timestamps: true,
    }
);
const deposit = db1.model('deposit', depositSchema);
module.exports = deposit;
