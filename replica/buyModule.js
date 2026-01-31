const mongoose = require('mongoose');
const { db1 } = require('../framing/storage');

const buySchema = new mongoose.Schema(
    {
        tokenAddress: {
            type: String,
            required: true,
        },
        referenceAddress: {
            type: String,
            required: true,
        },
        userAddress: {
            type: String,
            required: true,
        },
        tokenSymbol: {
            type: String,
            required: true,
        },
        buyAmount: {
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
const buyTransaction = db1.model('buyTransaction', buySchema);
module.exports = buyTransaction;
