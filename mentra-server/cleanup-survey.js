const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://mentraadmin:KtShYdPtzwyNFkO9@cluster0.crlsfbw.mongodb.net/mentra_db';

async function cleanupSurveyFlags() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    const usersCollection = db.collection('mentra_users');

    // Get all users to see their current state
    const allUsers = await usersCollection.find({}).toArray();
    console.log(`\n📊 Total users in database: ${allUsers.length}`);
    
    allUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email} - needsSurvey: ${user.needsSurvey}, profileCompleted: ${user.profileCompleted}`);
    });

    // Update only users who have profileCompleted: true to set needsSurvey: false
    const result = await usersCollection.updateMany(
      { profileCompleted: true },
      { $set: { needsSurvey: false } }
    );

    console.log(`\n✅ Updated ${result.modifiedCount} users who completed their profile`);
    console.log('✅ These users will NOT see survey modal on login');
    console.log('✅ New users will see survey modal on first registration');

    await mongoose.connection.close();
    console.log('\n👋 Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

cleanupSurveyFlags();
