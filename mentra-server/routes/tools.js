const express = require('express');
const router = express.Router();
const ToolData = require('../models/ToolData');

// Get all tool data for a user
router.get('/', async (req, res) => {
  try {
    const userId = req.user.uid;
    const tools = await ToolData.find({ userId }).sort({ createdAt: -1 });
    res.json(tools);
  } catch (error) {
    console.error('Error fetching tools:', error);
    res.status(500).json({ error: 'Failed to fetch tools' });
  }
});

// Get tool data by type
router.get('/:toolType', async (req, res) => {
  try {
    const userId = req.user.uid;
    const { toolType } = req.params;
    const tools = await ToolData.find({ userId, toolType }).sort({ createdAt: -1 });
    res.json(tools);
  } catch (error) {
    console.error('Error fetching tool data:', error);
    res.status(500).json({ error: 'Failed to fetch tool data' });
  }
});

// Create new tool entry
router.post('/', async (req, res) => {
  try {
    const userId = req.user.uid;
    const { toolType, data } = req.body;

    console.log('Creating tool entry:', { userId, toolType, dataKeys: Object.keys(data || {}) });

    if (!toolType || !data) {
      console.error('Missing required fields:', { toolType: !!toolType, data: !!data });
      return res.status(400).json({ error: 'Tool type and data are required' });
    }

    const newTool = new ToolData({
      userId,
      toolType,
      data,
    });

    await newTool.save();
    console.log('Tool entry created successfully:', newTool._id);
    res.status(201).json(newTool);
  } catch (error) {
    console.error('Error creating tool entry:', error);
    res.status(500).json({ 
      error: 'Failed to create tool entry',
      details: error.message 
    });
  }
});

// Update tool entry
router.put('/:id', async (req, res) => {
  try {
    const userId = req.user.uid;
    const { id } = req.params;
    const { data } = req.body;

    const tool = await ToolData.findOne({ _id: id, userId });
    if (!tool) {
      return res.status(404).json({ error: 'Tool entry not found' });
    }

    tool.data = data;
    tool.updatedAt = Date.now();
    await tool.save();

    res.json(tool);
  } catch (error) {
    console.error('Error updating tool entry:', error);
    res.status(500).json({ error: 'Failed to update tool entry' });
  }
});

// Delete tool entry
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.user.uid;
    const { id } = req.params;

    const tool = await ToolData.findOneAndDelete({ _id: id, userId });
    if (!tool) {
      return res.status(404).json({ error: 'Tool entry not found' });
    }

    res.json({ message: 'Tool entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting tool entry:', error);
    res.status(500).json({ error: 'Failed to delete tool entry' });
  }
});

// Goal-specific: Update task status
router.put('/goals/:id/task/:taskIndex', async (req, res) => {
  try {
    const userId = req.user.uid;
    const { id, taskIndex } = req.params;
    const { status } = req.body;

    const tool = await ToolData.findOne({ _id: id, userId, toolType: 'goal-breakdown' });
    if (!tool) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    if (!tool.data.tasks || !tool.data.tasks[taskIndex]) {
      return res.status(400).json({ error: 'Invalid task index' });
    }

    tool.data.tasks[taskIndex].status = status;
    tool.updatedAt = Date.now();
    await tool.save();

    res.json(tool);
  } catch (error) {
    console.error('Error updating task status:', error);
    res.status(500).json({ error: 'Failed to update task status' });
  }
});

module.exports = router;
