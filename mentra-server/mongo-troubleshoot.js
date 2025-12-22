// MongoDB Connection Troubleshooter
const mongoose = require('mongoose');
require('dotenv').config();

const connectionOptions = [
  // Option 1: Original Atlas URI
  "mongodb+srv://mentraadmin:7TWcOoL6vRQTAStc@cluster0.crlsfbw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
  
  // Option 2: Atlas with database specified
  "mongodb+srv://mentraadmin:7TWcOoL6vRQTAStc@cluster0.crlsfbw.mongodb.net/mentra-db?retryWrites=true&w=majority",
  
  // Option 3: Alternative format
  "mongodb+srv://mentraadmin:7TWcOoL6vRQTAStc@cluster0.crlsfbw.mongodb.net/admin?retryWrites=true&w=majority",
  
  // Option 4: Local MongoDB (if installed)
  "mongodb://localhost:27017/mentra-db"
];

async function testConnections() {
  console.log('🔍 Testing MongoDB connections...\n');
  
  for (let i = 0; i < connectionOptions.length; i++) {
    const uri = connectionOptions[i];
    const maskedUri = uri.replace(/:[^:@]+@/, ':****@');
    
    console.log(`\n📍 Testing connection ${i + 1}:`);
    console.log(`   URI: ${maskedUri}`);
    
    try {
      console.log('   ⏳ Connecting...');
      await mongoose.connect(uri);
      
      console.log('   ✅ Connection successful!');
      console.log('   📊 Database:', mongoose.connection.name);
      console.log('   🔗 Connected to:', mongoose.connection.host);
      
      // Test a simple operation
      const testCollection = mongoose.connection.db.collection('connection_test');
      await testCollection.insertOne({ test: true, timestamp: new Date() });
      await testCollection.deleteOne({ test: true });
      console.log('   ✅ Database operations working!');
      
      await mongoose.disconnect();
      console.log('   🔌 Disconnected successfully');
      
      console.log(`\n🎉 SUCCESS! Use this connection string in your .env file:`);
      console.log(`MONGODB_URI=${uri}\n`);
      
      return uri; // Return successful URI
      
    } catch (error) {
      console.log('   ❌ Connection failed:', error.message);
      
      if (error.message.includes('bad auth')) {
        console.log('   💡 Authentication issue - check username/password');
      } else if (error.message.includes('ENOTFOUND')) {
        console.log('   💡 DNS/Network issue - check internet connection');
      } else if (error.message.includes('ECONNREFUSED')) {
        console.log('   💡 Connection refused - MongoDB might not be running');
      }
      
      try {
        await mongoose.disconnect();
      } catch (e) {
        // Ignore disconnect errors
      }
    }
  }
  
  console.log('\n❌ All connection attempts failed.');
  console.log('\n🛠️  Troubleshooting steps:');
  console.log('1. Check MongoDB Atlas dashboard:');
  console.log('   - Verify user credentials');
  console.log('   - Check network access (IP whitelist)');
  console.log('   - Ensure cluster is running');
  console.log('2. Try local MongoDB installation');
  console.log('3. Check internet connection');
}

// Run the test
if (require.main === module) {
  testConnections().catch(console.error);
}

module.exports = { testConnections, connectionOptions };