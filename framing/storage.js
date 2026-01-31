const mongoose = require('mongoose');
require('dotenv').config();

const db1 = mongoose.createConnection(process.env.DB_URI, {
  serverSelectionTimeoutMS: 50000,
});

db1.on('connected', () => {
  console.log('Connected to DB');
});


module.exports = { db1 };
