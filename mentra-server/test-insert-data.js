const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// User Schema
const mentraUserSchema = new mongoose.Schema({
  firebaseUID: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  avatar: { type: String, default: '' },
  loginMethod: { type: String, enum: ['email', 'google'], default: 'email' },
  isEmailVerified: { type: Boolean, default: false },
  lastLogin: { type: Date, default: Date.now },
  needsSurvey: { type: Boolean, default: true },
  profileCompleted: { type: Boolean, default: false },
  profile: {
    age: { type: Number },
    gender: { type: String },
    mentalHealthGoals: [{ type: String }],
    currentMentalState: { type: String },
    stressLevel: { type: Number },
    anxietyLevel: { type: Number },
    sleepQuality: { type: String },
    exerciseFrequency: { type: String },
    supportSystem: { type: String },
    interests: [{ type: String }],
    triggers: [{ type: String }],
    copingMechanisms: [{ type: String }],
    preferredActivities: [{ type: String }],
  },
  accountStatus: { type: String, enum: ['active', 'suspended', 'deleted'], default: 'active' },
  privacySettings: {
    shareProgress: { type: Boolean, default: false },
    shareStories: { type: Boolean, default: false },
    matchWithOthers: { type: Boolean, default: false },
  },
}, {
  timestamps: true,
  collection: 'mentra_users',
});

const MentraUser = mongoose.model('MentraUser', mentraUserSchema);

// Mood Entry Schema
const moodEntrySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'MentraUser', required: true },
  mood: { type: String, required: true, enum: ['very-sad', 'sad', 'neutral', 'happy', 'very-happy'] },
  energy: { type: Number, required: true, min: 1, max: 5 },
  stress: { type: Number, required: true, min: 1, max: 5 },
  notes: { type: String, maxlength: 500, trim: true },
  date: { type: Date, default: Date.now },
}, { timestamps: true });

const MoodEntry = mongoose.model('MoodEntry', moodEntrySchema);

// Journal Entry Schema
const journalEntrySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'MentraUser', required: true },
  title: { type: String, required: true, trim: true, maxlength: 100 },
  content: { type: String, required: true, trim: true, maxlength: 5000 },
  mood: { type: String, enum: ['very-sad', 'sad', 'neutral', 'happy', 'very-happy'] },
  tags: [{ type: String, trim: true, maxlength: 30 }],
  isPrivate: { type: Boolean, default: true },
}, { timestamps: true });

const JournalEntry = mongoose.model('JournalEntry', journalEntrySchema);

async function insertFakeData() {
  try {
    console.log('\n🧪 Starting fake data insertion...\n');

    // Clear existing test users
    console.log('🗑️  Clearing existing test users...');
    await MentraUser.deleteMany({ firebaseUID: { $regex: /^test-uid-/ } });
    
    // Fake Users
    const fakeUsers = [
      {
        firebaseUID: 'test-uid-001',
        name: 'John Doe',
        email: 'john.doe@test.com',
        avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=6366f1&color=fff&size=200',
        loginMethod: 'email',
        isEmailVerified: true,
        needsSurvey: false,
        profileCompleted: true,
        profile: {
          age: 25,
          gender: 'male',
          currentMentalState: 'good',
          stressLevel: 6,
          anxietyLevel: 5,
          sleepQuality: 'fair',
          exerciseFrequency: 'weekly',
          supportSystem: 'moderate',
          mentalHealthGoals: ['Reduce anxiety', 'Better sleep', 'Stress management'],
          interests: ['Reading', 'Music', 'Sports'],
          triggers: ['Work stress', 'Academic pressure'],
          copingMechanisms: ['Exercise', 'Deep breathing', 'Meditation'],
          preferredActivities: ['Guided meditation', 'Mood tracking', 'Journaling prompts'],
        },
        accountStatus: 'active',
        privacySettings: { shareProgress: true, shareStories: false, matchWithOthers: true },
      },
      {
        firebaseUID: 'test-uid-002',
        name: 'Jane Smith',
        email: 'jane.smith@test.com',
        avatar: 'https://ui-avatars.com/api/?name=Jane+Smith&background=10b981&color=fff&size=200',
        loginMethod: 'google',
        isEmailVerified: true,
        needsSurvey: false,
        profileCompleted: true,
        profile: {
          age: 28,
          gender: 'female',
          currentMentalState: 'excellent',
          stressLevel: 3,
          anxietyLevel: 2,
          sleepQuality: 'good',
          exerciseFrequency: 'daily',
          supportSystem: 'strong',
          mentalHealthGoals: ['Build confidence', 'Improve relationships', 'Increase mindfulness'],
          interests: ['Art & Creativity', 'Nature & Outdoors', 'Meditation'],
          triggers: ['Social situations', 'Change/uncertainty'],
          copingMechanisms: ['Talking to friends', 'Journaling', 'Time in nature'],
          preferredActivities: ['Breathing exercises', 'Mindfulness exercises', 'Sleep stories'],
        },
        accountStatus: 'active',
        privacySettings: { shareProgress: true, shareStories: true, matchWithOthers: true },
      },
      {
        firebaseUID: 'test-uid-003',
        name: 'Test User (Needs Survey)',
        email: 'test.user@test.com',
        avatar: 'https://ui-avatars.com/api/?name=Test+User&background=f59e0b&color=fff&size=200',
        loginMethod: 'email',
        isEmailVerified: false,
        needsSurvey: true,
        profileCompleted: false,
        profile: {},
        accountStatus: 'active',
        privacySettings: { shareProgress: false, shareStories: false, matchWithOthers: false },
      },
    ];

    console.log('👥 Inserting fake users...');
    const insertedUsers = await MentraUser.insertMany(fakeUsers);
    console.log(`✅ Inserted ${insertedUsers.length} users`);

    // Fake Mood Entries for first user
    console.log('\n😊 Creating mood entries...');
    const fakeMoodEntries = [];
    const moods = ['very-sad', 'sad', 'neutral', 'happy', 'very-happy'];
    
    for (let i = 0; i < 15; i++) {
      fakeMoodEntries.push({
        userId: insertedUsers[0]._id,
        mood: moods[Math.floor(Math.random() * moods.length)],
        energy: Math.floor(Math.random() * 5) + 1,
        stress: Math.floor(Math.random() * 5) + 1,
        notes: `Test mood entry ${i + 1} - Feeling ${moods[Math.floor(Math.random() * moods.length)]}`,
        date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      });
    }

    const insertedMoodEntries = await MoodEntry.insertMany(fakeMoodEntries);
    console.log(`✅ Inserted ${insertedMoodEntries.length} mood entries`);

    // Fake Journal Entries
    console.log('\n📔 Creating journal entries...');
    const fakeJournalEntries = [
      {
        userId: insertedUsers[0]._id,
        title: 'My First Journal Entry',
        content: 'Today was a good day. I practiced meditation for 20 minutes in the morning and felt more calm throughout the day. Work was less stressful than usual.',
        mood: 'happy',
        tags: ['meditation', 'calm', 'progress', 'work'],
        isPrivate: true,
      },
      {
        userId: insertedUsers[0]._id,
        title: 'Feeling Stressed',
        content: 'Work has been overwhelming lately. Multiple deadlines approaching and I feel like I am drowning. Need to find better coping mechanisms and maybe talk to someone.',
        mood: 'sad',
        tags: ['work', 'stress', 'overwhelmed', 'deadlines'],
        isPrivate: true,
      },
      {
        userId: insertedUsers[0]._id,
        title: 'Grateful Today',
        content: 'Took some time to reflect on what I am grateful for. My supportive family, good health, and the opportunity to work on myself. Feeling blessed.',
        mood: 'very-happy',
        tags: ['gratitude', 'reflection', 'family', 'blessed'],
        isPrivate: false,
      },
      {
        userId: insertedUsers[1]._id,
        title: 'Morning Routine Success',
        content: 'Finally established a consistent morning routine! Wake up at 6 AM, meditate, exercise, and have a healthy breakfast. Feeling energized!',
        mood: 'very-happy',
        tags: ['routine', 'morning', 'exercise', 'success'],
        isPrivate: false,
      },
    ];

    const insertedJournalEntries = await JournalEntry.insertMany(fakeJournalEntries);
    console.log(`✅ Inserted ${insertedJournalEntries.length} journal entries`);

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('🎉 FAKE DATA INSERTION COMPLETE!');
    console.log('='.repeat(50));
    console.log(`👥 Users: ${insertedUsers.length}`);
    console.log(`😊 Mood Entries: ${insertedMoodEntries.length}`);
    console.log(`📔 Journal Entries: ${insertedJournalEntries.length}`);
    console.log('='.repeat(50));
    console.log('\n📊 Database: mentra_db');
    console.log('📦 Collection: mentra_users\n');

    // Display users
    console.log('Created Users:');
    insertedUsers.forEach((user, index) => {
      console.log(`  ${index + 1}. ${user.name} (${user.email})`);
      console.log(`     - Firebase UID: ${user.firebaseUID}`);
      console.log(`     - Survey Complete: ${user.profileCompleted ? '✅' : '❌'}`);
      console.log(`     - Login Method: ${user.loginMethod}`);
    });

    console.log('\n✅ You can now view this data in your application!');
    console.log('\n💡 To verify in MongoDB:');
    console.log('   mongosh mentra_db --eval "db.mentra_users.find().pretty()"\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error inserting fake data:', error);
    process.exit(1);
  }
}

// Run the insertion
insertFakeData();
