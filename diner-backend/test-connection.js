// Quick MongoDB Connection Test
require('dotenv').config();
const mongoose = require('mongoose');

const testConnection = async () => {
  try {
    console.log('🔍 Testing MongoDB connection...');
    console.log('Connection string:', process.env.MONGODB_URI?.replace(/:[^:@]+@/, ':****@'));
    
    await mongoose.connect(process.env.MONGODB_URI || '');
    console.log('✅ MongoDB Connected Successfully!');
    
    // Test a simple operation
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📊 Collections:', collections.map(c => c.name));
    
    await mongoose.disconnect();
    console.log('✅ Connection test passed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    
    if (error.message.includes('authentication failed')) {
      console.log('\n💡 Authentication Error - Check:');
      console.log('1. Password is correct in connection string');
      console.log('2. Password is URL encoded if it has special characters');
      console.log('3. Database user exists and has correct privileges');
      console.log('4. Network access is allowed in MongoDB Atlas');
    } else if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
      console.log('\n💡 Network Error - Check:');
      console.log('1. Internet connection is working');
      console.log('2. MongoDB Atlas cluster is running');
      console.log('3. Cluster address is correct');
    }
    
    process.exit(1);
  }
};

testConnection();

