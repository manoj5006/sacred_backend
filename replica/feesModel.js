const mongoose = require('mongoose');
const { db1 } = require('../framing/storage');

const feeSchema = new mongoose.Schema(
    {
        referer: {
            type: String,
            required: true,
        },
        input: {
            type: String,
            required: true,
        },
        output: {
            type: String,
            required: true,
        },
        fee: {
            type: String,
            required: true,
        },
        time: {
            type: String,
            required: true,
        },
        user: {
            type: String,
            required: true,
        }
    },
    {
        timestamps: true,
    }
);
const fee = db1.model('fee', feeSchema);
module.exports = fee;
