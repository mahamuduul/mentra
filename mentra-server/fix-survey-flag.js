require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://mentraadmin:KtShYdPtzwyNFkO9@cluster0.crlsfbw.mongodb.net/mentra_db';

async function fixSurveyFlag() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    const usersCollection = db.collection('mentra_users');

    // Update all users to set needsSurvey to false
    const result = await usersCollection.updateMany(
      {},
      { $set: { needsSurvey: false, profileCompleted: true } }
    );

    console.log(`✅ Updated ${result.modifiedCount} users`);
    console.log('All users can now access protected routes without survey redirect');

    await mongoose.connection.close();
    console.log('👋 Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fixSurveyFlag();
