// config/db.js or utils/db.js

const mongoose = require('mongoose');
require('dotenv').config(); // Ensure environment variables are loaded

const connectDB = async () => {
  try {
    const connect = process.env.MONGO_URI;
    if (!connect) {
      throw new Error('MONGO_URI is not defined in the environment variables');
    }
    // Remove useUnifiedTopology from the options
    await mongoose.connect(connect);
    console.log('MongoDB connected');
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1); // Exit the process with failure code
  }
};

module.exports = connectDB;
