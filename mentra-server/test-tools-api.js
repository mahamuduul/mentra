// Quick test script to verify tools API
const mongoose = require('mongoose');
require('dotenv').config();

async function testToolsAPI() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Import model
    const ToolData = require('./models/ToolData');

    // Test: Create a sample tool entry
    const testTool = new ToolData({
      userId: 'test-user-123',
      toolType: 'goal-breakdown',
      data: {
        title: 'Test Goal',
        tasks: [
          { title: 'Task 1', status: 'pending' },
          { title: 'Task 2', status: 'pending' }
        ],
        dueDate: new Date()
      }
    });

    await testTool.save();
    console.log('✅ Test tool created:', testTool._id);

    // Test: Retrieve the tool
    const retrieved = await ToolData.findById(testTool._id);
    console.log('✅ Tool retrieved:', {
      id: retrieved._id,
      userId: retrieved.userId,
      toolType: retrieved.toolType,
      dataKeys: Object.keys(retrieved.data)
    });

    // Test: Query by user and type
    const userTools = await ToolData.find({ 
      userId: 'test-user-123',
      toolType: 'goal-breakdown'
    });
    console.log('✅ Found', userTools.length, 'tools for test user');

    // Cleanup
    await ToolData.deleteOne({ _id: testTool._id });
    console.log('✅ Test data cleaned up');

    console.log('\n🎉 All tests passed! Tools API is working correctly.\n');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error);
    process.exit(1);
  }
}

testToolsAPI();
