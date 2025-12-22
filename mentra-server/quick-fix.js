const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://mentraadmin:KtShYdPtzwyNFkO9@cluster0.crlsfbw.mongodb.net/mentra_db';

async function fixSurveyFlag() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    const usersCollection = db.collection('mentra_users');

    // Update only users who have profileCompleted: true to set needsSurvey: false
    // This ensures existing users who completed survey don't see it again
    // But new users will still see the survey modal
    const result = await usersCollection.updateMany(
      { profileCompleted: true },
      { $set: { needsSurvey: false } }
    );

    console.log(`✅ Updated ${result.modifiedCount} users who completed their profile`);
    console.log('New users will still see the survey modal on first login');

    await mongoose.connection.close();
    console.log('👋 Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fixSurveyFlag();
