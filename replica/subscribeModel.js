
const mongoose = require('mongoose');
const { db1 } = require('../framing/storage');

const subscribeSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
        }
    },
    {
        timestamps: true,
    }
);
const subscribe = db1.model('subscribe', subscribeSchema);
module.exports = subscribe;