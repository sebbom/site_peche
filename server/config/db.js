const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Use the MONGODB_URI from environment variables or default to localhost
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/site_peche';
    
    console.log(`Attempting to connect to MongoDB at: ${mongoURI}`);
    
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.error('Please make sure:');
    console.error('1. MongoDB is running');
    console.error('2. The connection URI is correct');
    console.error('3. Environment variables are properly set');
    process.exit(1);
  }
};

module.exports = connectDB;
