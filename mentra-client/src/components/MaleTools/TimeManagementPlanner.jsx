import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { showSuccessToast, showErrorToast } from '../../utils/toast';
import { FaClock, FaTrash } from 'react-icons/fa';

const TimeManagementPlanner = () => {
  const { currentUser } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: '',
    priority: 'medium',
    estimatedTime: '',
    category: 'work',
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchTasks = async () => {
    try {
      const token = await currentUser.getIdToken();
      const response = await fetch('http://localhost:5000/api/tools/time-management', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      if (!response.ok) {
        console.error('Failed to fetch tasks:', response.status);
        return;
      }
      
      const data = await response.json();
      setTasks(data || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      showErrorToast('Failed to load tasks');
    }
  };

  const handleAddTask = async () => {
    if (!newTask.title.trim()) {
      showErrorToast('Please enter a task title');
      return;
    }

    if (!newTask.estimatedTime) {
      showErrorToast('Please enter estimated time');
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
          toolType: 'time-management',
          data: {
            ...newTask,
            status: 'pending',
            completedAt: null,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Save task failed:', response.status, errorData);
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }
      
      await response.json();
      showSuccessToast('Task added successfully');
      fetchTasks();
      setNewTask({ title: '', priority: 'medium', estimatedTime: '', category: 'work' });
    } catch (error) {
      console.error('Error saving task:', error);
      showErrorToast(error.message || 'Failed to save task');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleComplete = async (taskId, currentStatus) => {
    try {
      const token = await currentUser.getIdToken();
      const task = tasks.find(t => t._id === taskId);
      const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
      
      const response = await fetch(`http://localhost:5000/api/tools/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          data: {
            ...task.data,
            status: newStatus,
            completedAt: newStatus === 'completed' ? new Date() : null,
          },
        }),
      });

      if (!response.ok) throw new Error('Failed to update task');
      
      showSuccessToast('Task updated');
      fetchTasks();
    } catch (error) {
      showErrorToast('Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const token = await currentUser.getIdToken();
      const response = await fetch(`http://localhost:5000/api/tools/${taskId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to delete task');
      
      showSuccessToast('Task deleted');
      fetchTasks();
    } catch (error) {
      showErrorToast('Failed to delete task');
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const totalTimeEstimate = tasks
    .filter(t => t.data.status === 'pending')
    .reduce((sum, t) => sum + (parseInt(t.data.estimatedTime) || 0), 0);

  return (
    <div className="space-y-6">
      {/* Add New Task */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-4">Add New Task</h4>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Task Description
            </label>
            <input
              type="text"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              placeholder="e.g., Prepare presentation for meeting"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                value={newTask.priority}
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time (minutes)
              </label>
              <input
                type="number"
                value={newTask.estimatedTime}
                onChange={(e) => setNewTask({ ...newTask, estimatedTime: e.target.value })}
                placeholder="30"
                min="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={newTask.category}
                onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="work">Work</option>
                <option value="personal">Personal</option>
                <option value="health">Health</option>
                <option value="social">Social</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleAddTask}
            disabled={isLoading}
            className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Adding...' : 'Add Task'}
          </button>
        </div>
      </div>

      {/* Time Summary */}
      {tasks.length > 0 && (
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FaClock className="text-blue-600" />
              <span className="font-medium text-gray-900">Total Pending Time:</span>
            </div>
            <span className="text-2xl font-bold text-blue-600">
              {Math.floor(totalTimeEstimate / 60)}h {totalTimeEstimate % 60}m
            </span>
          </div>
        </div>
      )}

      {/* Task List */}
      {tasks.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900">Your Tasks</h4>
          
          {/* Pending Tasks */}
          <div className="space-y-3">
            {tasks.filter(t => t.data.status === 'pending').map((task) => (
              <div key={task._id} className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <input
                      type="checkbox"
                      checked={false}
                      onChange={() => handleToggleComplete(task._id, task.data.status)}
                      className="w-5 h-5 text-blue-600 rounded mt-1 focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-900">{task.data.title}</h5>
                      <div className="flex items-center space-x-3 mt-2 text-sm text-gray-600">
                        <span className={`px-2 py-1 rounded border ${getPriorityColor(task.data.priority)}`}>
                          {task.data.priority}
                        </span>
                        <span className="flex items-center space-x-1">
                          <FaClock className="text-gray-400" />
                          <span>{task.data.estimatedTime} min</span>
                        </span>
                        <span className="px-2 py-1 bg-gray-100 rounded text-gray-700">
                          {task.data.category}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteTask(task._id)}
                    className="text-red-600 hover:text-red-700 p-2"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Completed Tasks */}
          {tasks.filter(t => t.data.status === 'completed').length > 0 && (
            <div className="space-y-3">
              <h5 className="font-medium text-gray-600 text-sm">Completed Tasks</h5>
              {tasks.filter(t => t.data.status === 'completed').map((task) => (
                <div key={task._id} className="bg-gray-50 p-4 rounded-lg border border-gray-200 opacity-60">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <input
                        type="checkbox"
                        checked={true}
                        onChange={() => handleToggleComplete(task._id, task.data.status)}
                        className="w-5 h-5 text-blue-600 rounded mt-1"
                      />
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-600 line-through">{task.data.title}</h5>
                        <div className="flex items-center space-x-3 mt-2 text-sm text-gray-500">
                          <span>{task.data.estimatedTime} min</span>
                          <span>{task.data.category}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteTask(task._id)}
                      className="text-red-600 hover:text-red-700 p-2"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tasks.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>No tasks yet. Add your first task above!</p>
        </div>
      )}
    </div>
  );
};

export default TimeManagementPlanner;
