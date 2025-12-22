// Mentra Server - MongoDB Connection Test

const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

// Test MongoDB connection
async function testMongoConnection() {
    const uri = process.env.MONGODB_URI;
    console.log('🔍 Testing MongoDB connection...');
    console.log('📍 Connection URI:', uri.replace(/:[^:@]+@/, ':****@')); // Hide password
    
    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });

    try {
        // Connect the client to the server
        console.log('⏳ Connecting to MongoDB...');
        await client.connect();
        
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("✅ Pinged your deployment. You successfully connected to MongoDB!");
        
        // Test database operations
        const db = client.db(process.env.DB_NAME || 'mentra-db');
        const collections = await db.listCollections().toArray();
        console.log(`📊 Available collections: ${collections.length}`);
        
        // Test creating a test document
        const testCollection = db.collection('test');
        const testDoc = { message: 'Hello from Mentra Server!', timestamp: new Date() };
        const result = await testCollection.insertOne(testDoc);
        console.log(`📝 Test document inserted with ID: ${result.insertedId}`);
        
        // Clean up test document
        await testCollection.deleteOne({ _id: result.insertedId });
        console.log('🧹 Test document cleaned up');
        
    } catch (error) {
        console.error('❌ MongoDB connection failed:');
        console.error('Error:', error.message);
        
        if (error.message.includes('bad auth')) {
            console.log('\n💡 Authentication failed. Please check:');
            console.log('   1. Username and password are correct');
            console.log('   2. Database user has proper permissions');
            console.log('   3. IP address is whitelisted in MongoDB Atlas');
            console.log('   4. Network access is configured properly');
        }
        
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
        console.log('🔌 MongoDB connection closed');
    }
}

// Run the test
testMongoConnection().catch(console.dir);