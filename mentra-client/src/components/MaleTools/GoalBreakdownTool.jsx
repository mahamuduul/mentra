import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { showSuccessToast, showErrorToast } from '../../utils/toast';

const GoalBreakdownTool = () => {
  const { currentUser } = useAuth();
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState({
    title: '',
    tasks: [''],
    dueDate: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchGoals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchGoals = async () => {
    try {
      const token = await currentUser.getIdToken();
      const response = await fetch('http://localhost:5000/api/tools/goal-breakdown', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      if (!response.ok) {
        console.error('Failed to fetch goals:', response.status);
        return;
      }
      
      const goals = await response.json();
      setGoals(goals || []);
    } catch (error) {
      console.error('Error fetching goals:', error);
      showErrorToast('Failed to load goals');
    }
  };

  const handleAddTask = () => {
    setNewGoal({
      ...newGoal,
      tasks: [...newGoal.tasks, ''],
    });
  };

  const handleTaskChange = (index, value) => {
    const updatedTasks = [...newGoal.tasks];
    updatedTasks[index] = value;
    setNewGoal({ ...newGoal, tasks: updatedTasks });
  };

  const handleRemoveTask = (index) => {
    const updatedTasks = newGoal.tasks.filter((_, i) => i !== index);
    setNewGoal({ ...newGoal, tasks: updatedTasks });
  };

  const handleSaveGoal = async () => {
    if (!newGoal.title.trim()) {
      showErrorToast('Please enter a goal title');
      return;
    }

    const validTasks = newGoal.tasks.filter(task => task.trim() !== '');
    if (validTasks.length === 0) {
      showErrorToast('Please add at least one task');
      return;
    }

    setIsLoading(true);
    try {
      const token = await currentUser.getIdToken();
      const response = await fetch('http://localhost:5000/api/tools', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          toolType: 'goal-breakdown',
          data: {
            title: newGoal.title,
            tasks: validTasks.map(task => ({ title: task, status: 'pending' })),
            dueDate: newGoal.dueDate,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Save goal failed:', response.status, errorData);
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }
      
      const savedGoal = await response.json();
      showSuccessToast('Goal saved successfully');
      setGoals([savedGoal, ...goals]);
      setNewGoal({ title: '', tasks: [''], dueDate: '' });
    } catch (error) {
      showErrorToast(error.message || 'Failed to save goal');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateTaskStatus = async (goalId, taskIndex, newStatus) => {
    try {
      const token = await currentUser.getIdToken();
      const response = await fetch(`http://localhost:5000/api/tools/goals/${goalId}/task/${taskIndex}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('Failed to update task');
      
      const updatedGoal = await response.json();
      setGoals(goals.map(g => g._id === goalId ? updatedGoal : g));
      showSuccessToast('Task status updated');
    } catch {
      showErrorToast('Failed to update task');
    }
  };

  const getProgressPercentage = (goal) => {
    if (!goal.data?.tasks || goal.data.tasks.length === 0) return 0;
    const completed = goal.data.tasks.filter(t => t.status === 'completed').length;
    return Math.round((completed / goal.data.tasks.length) * 100);
  };

  return (
    <div className="space-y-6">
      {/* New Goal Form */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-4">Create New Goal</h4>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Big Goal
            </label>
            <input
              type="text"
              value={newGoal.title}
              onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
              placeholder="e.g., Get promoted to senior position"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Break into Small Tasks
            </label>
            <div className="space-y-2">
              {newGoal.tasks.map((task, index) => (
                <div key={index} className="flex space-x-2">
                  <input
                    type="text"
                    value={task}
                    onChange={(e) => handleTaskChange(index, e.target.value)}
                    placeholder={`Task ${index + 1}`}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {newGoal.tasks.length > 1 && (
                    <button
                      onClick={() => handleRemoveTask(index)}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={handleAddTask}
              className="mt-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              + Add Another Task
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Due Date
            </label>
            <input
              type="date"
              value={newGoal.dueDate}
              onChange={(e) => setNewGoal({ ...newGoal, dueDate: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <button
            onClick={handleSaveGoal}
            disabled={isLoading}
            className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Saving...' : 'Save Goal'}
          </button>
        </div>
      </div>

      {/* Existing Goals */}
      {goals.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900">Your Goals</h4>
          {goals.map((goal) => (
            <div key={goal._id} className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h5 className="font-semibold text-gray-900">{goal.data.title}</h5>
                  {goal.data.dueDate && (
                    <p className="text-sm text-gray-600 mt-1">
                      Due: {new Date(goal.data.dueDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">
                    {getProgressPercentage(goal)}%
                  </div>
                  <div className="text-xs text-gray-600">Complete</div>
                </div>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getProgressPercentage(goal)}%` }}
                ></div>
              </div>

              <div className="space-y-2">
                {goal.data.tasks.map((task, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <input
                      type="checkbox"
                      checked={task.status === 'completed'}
                      onChange={(e) =>
                        handleUpdateTaskStatus(
                          goal._id,
                          index,
                          e.target.checked ? 'completed' : 'pending'
                        )
                      }
                      className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className={`flex-1 ${task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                      {task.title}
                    </span>
                    {task.status === 'completed' && (
                      <span className="text-xs text-green-600 font-medium">Completed</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GoalBreakdownTool;
