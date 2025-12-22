import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaPlus, FaTrash, FaBullhorn, FaBell, FaClipboardList } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { showSuccessToast, showErrorToast } from '../../utils/toast';

const GoalBoundaryPlanner = () => {
  const { currentUser } = useAuth();
  const [planner, setPlanner] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  
  const [weeklyGoals, setWeeklyGoals] = useState([]);
  const [sayNoScripts, setSayNoScripts] = useState([]);
  const [boundaryChecklist, setBoundaryChecklist] = useState([]);
  
  const [newGoal, setNewGoal] = useState('');
  const [newScript, setNewScript] = useState({ situation: '', script: '' });
  const [newBoundary, setNewBoundary] = useState('');

  const defaultBoundaries = [
    'I can say no without feeling guilty',
    'My time and energy are valuable',
    'I don\'t have to explain every decision',
    'It\'s okay to prioritize my needs',
    'I can change my mind',
    'I deserve respect in all relationships',
  ];

  useEffect(() => {
    fetchPlanner();
  }, []);

  const fetchPlanner = async () => {
    try {      const token = await currentUser.getIdToken();      const response = await fetch('http://localhost:5000/api/tools/goal-boundary', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const plans = await response.json();
        if (plans && plans.length > 0) {
          const plan = plans[0];
          setPlanner(plan);
          setWeeklyGoals(plan.data.weeklyGoals || []);
          setSayNoScripts(plan.data.sayNoScripts || []);
          setBoundaryChecklist(plan.data.boundaryChecklist || defaultBoundaries.map((b, i) => ({ id: i, text: b, checked: false })));
        } else {
          setEditMode(true);
          setBoundaryChecklist(defaultBoundaries.map((b, i) => ({ id: Date.now() + i, text: b, checked: false })));
        }
      }
    } catch (error) {
      console.error('Error fetching planner:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const plannerData = {
        weeklyGoals,
        sayNoScripts,
        boundaryChecklist,
        lastUpdated: new Date().toISOString()
      };

      const url = planner 
        ? `http://localhost:5000/api/tools/${planner._id}`
        : 'http://localhost:5000/api/tools';
      
      const method = planner ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(
          planner 
            ? { data: plannerData }
            : { toolType: 'goal-boundary', data: plannerData }
        ),
      });

      if (response.ok) {
        showSuccessToast('Goals and boundaries saved');
        setEditMode(false);
        fetchPlanner();
      } else {
        showErrorToast('Failed to save');
      }
    } catch (error) {
      console.error('Error saving planner:', error);
      showErrorToast('Failed to save');
    }
  };

  const addGoal = () => {
    if (!newGoal.trim()) return;
    setWeeklyGoals([...weeklyGoals, { id: Date.now(), text: newGoal, completed: false }]);
    setNewGoal('');
  };

  const toggleGoal = (id) => {
    setWeeklyGoals(weeklyGoals.map(g => 
      g.id === id ? { ...g, completed: !g.completed } : g
    ));
  };

  const removeGoal = (id) => {
    setWeeklyGoals(weeklyGoals.filter(g => g.id !== id));
  };

  const addScript = () => {
    if (!newScript.situation || !newScript.script) {
      showErrorToast('Please fill in both situation and script');
      return;
    }
    setSayNoScripts([...sayNoScripts, { ...newScript, id: Date.now() }]);
    setNewScript({ situation: '', script: '' });
  };

  const removeScript = (id) => {
    setSayNoScripts(sayNoScripts.filter(s => s.id !== id));
  };

  const addBoundary = () => {
    if (!newBoundary.trim()) return;
    setBoundaryChecklist([...boundaryChecklist, { id: Date.now(), text: newBoundary, checked: false }]);
    setNewBoundary('');
  };

  const toggleBoundary = (id) => {
    setBoundaryChecklist(boundaryChecklist.map(b => 
      b.id === id ? { ...b, checked: !b.checked } : b
    ));
  };

  const removeBoundary = (id) => {
    setBoundaryChecklist(boundaryChecklist.filter(b => b.id !== id));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  const completedGoals = weeklyGoals.filter(g => g.completed).length;
  const checkedBoundaries = boundaryChecklist.filter(b => b.checked).length;

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl p-8 text-white mb-8 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <FaClipboardList className="text-4xl" />
              <h1 className="text-3xl font-bold">Goal & Boundary Planner</h1>
            </div>
            <p className="text-green-100 text-lg">
              Set weekly goals and practice healthy boundaries
            </p>
          </div>
          {!editMode && planner && (
            <button
              onClick={() => setEditMode(true)}
              className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition-all shadow-lg"
            >
              Edit Plan
            </button>
          )}
        </div>
      </div>

      {editMode ? (
        <div className="space-y-6">
          {/* Weekly Goals */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
              <FaCheckCircle className="text-green-600" />
              Weekly Goals ({weeklyGoals.length})
            </h3>
            
            <div className="bg-green-50 p-4 rounded-lg mb-4">
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Enter a goal for this week..."
                  value={newGoal}
                  onChange={(e) => setNewGoal(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addGoal()}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
                <button
                  onClick={addGoal}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all flex items-center gap-2"
                >
                  <FaPlus /> Add
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {weeklyGoals.map(goal => (
                <div key={goal.id} className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg border-2 border-green-200">
                  <input
                    type="checkbox"
                    checked={goal.completed}
                    onChange={() => toggleGoal(goal.id)}
                    className="w-5 h-5 text-green-600"
                  />
                  <p className={`flex-1 ${goal.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                    {goal.text}
                  </p>
                  <button
                    onClick={() => removeGoal(goal.id)}
                    className="text-red-500 hover:text-red-700 p-2"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Say No Scripts */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
              <FaBullhorn className="text-orange-600" />
              "Say No" Scripts ({sayNoScripts.length})
            </h3>
            
            <div className="bg-orange-50 p-4 rounded-lg mb-4">
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Situation (e.g., Asked to take on extra work)"
                  value={newScript.situation}
                  onChange={(e) => setNewScript({...newScript, situation: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
                <textarea
                  placeholder="Your &quot;No&quot; script (e.g., &quot;I appreciate you thinking of me, but I can't take this on right now.&quot;)"
                  value={newScript.script}
                  onChange={(e) => setNewScript({...newScript, script: e.target.value})}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
                <button
                  onClick={addScript}
                  className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-all flex items-center gap-2"
                >
                  <FaPlus /> Add Script
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {sayNoScripts.map(script => (
                <div key={script.id} className="bg-gray-50 p-4 rounded-lg border-2 border-orange-200">
                  <div className="flex justify-between mb-2">
                    <p className="font-semibold text-gray-800">{script.situation}</p>
                    <button
                      onClick={() => removeScript(script.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  </div>
                  <div className="bg-white p-3 rounded border-l-4 border-orange-500">
                    <p className="text-gray-700 italic">"{script.script}"</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Boundary Checklist */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
              <FaBell className="text-purple-600" />
              Boundary Reminders ({boundaryChecklist.length})
            </h3>
            
            <div className="bg-purple-50 p-4 rounded-lg mb-4">
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Add a boundary reminder..."
                  value={newBoundary}
                  onChange={(e) => setNewBoundary(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addBoundary()}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
                <button
                  onClick={addBoundary}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-all flex items-center gap-2"
                >
                  <FaPlus /> Add
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {boundaryChecklist.map(boundary => (
                <div key={boundary.id} className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg border-2 border-purple-200">
                  <input
                    type="checkbox"
                    checked={boundary.checked}
                    onChange={() => toggleBoundary(boundary.id)}
                    className="w-5 h-5 text-purple-600"
                  />
                  <p className="flex-1 text-gray-800">{boundary.text}</p>
                  <button
                    onClick={() => removeBoundary(boundary.id)}
                    className="text-red-500 hover:text-red-700 p-2"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleSave}
            className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white py-4 rounded-lg font-semibold hover:from-green-700 hover:to-teal-700 transition-all shadow-lg text-lg"
          >
            Save Goals & Boundaries
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Progress Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
              <h4 className="text-lg font-semibold mb-2">Weekly Goals Progress</h4>
              <div className="text-5xl font-bold mb-2">{completedGoals}/{weeklyGoals.length}</div>
              <div className="w-full bg-green-700 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-white h-full transition-all"
                  style={{ width: weeklyGoals.length ? `${(completedGoals/weeklyGoals.length)*100}%` : '0%' }}
                />
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
              <h4 className="text-lg font-semibold mb-2">Boundaries Practiced</h4>
              <div className="text-5xl font-bold mb-2">{checkedBoundaries}/{boundaryChecklist.length}</div>
              <div className="w-full bg-purple-700 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-white h-full transition-all"
                  style={{ width: boundaryChecklist.length ? `${(checkedBoundaries/boundaryChecklist.length)*100}%` : '0%' }}
                />
              </div>
            </div>
          </div>

          {/* View sections */}
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4 text-green-800">Weekly Goals</h3>
              <div className="space-y-2">
                {weeklyGoals.map(goal => (
                  <div key={goal.id} className="flex items-center gap-3 bg-green-50 p-4 rounded-lg">
                    <input
                      type="checkbox"
                      checked={goal.completed}
                      onChange={() => {
                        toggleGoal(goal.id);
                        handleSave();
                      }}
                      className="w-5 h-5 text-green-600"
                    />
                    <p className={`flex-1 ${goal.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                      {goal.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4 text-orange-800">Say No Scripts</h3>
              <div className="space-y-3">
                {sayNoScripts.map(script => (
                  <div key={script.id} className="bg-orange-50 p-4 rounded-lg">
                    <p className="font-semibold text-gray-800 mb-2">{script.situation}</p>
                    <div className="bg-white p-3 rounded border-l-4 border-orange-500">
                      <p className="text-gray-700 italic">"{script.script}"</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4 text-purple-800">Boundary Reminders</h3>
            <div className="grid md:grid-cols-2 gap-2">
              {boundaryChecklist.map(boundary => (
                <div key={boundary.id} className="flex items-center gap-3 bg-purple-50 p-4 rounded-lg">
                  <input
                    type="checkbox"
                    checked={boundary.checked}
                    onChange={() => {
                      toggleBoundary(boundary.id);
                      handleSave();
                    }}
                    className="w-5 h-5 text-purple-600"
                  />
                  <p className="flex-1 text-gray-800">{boundary.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalBoundaryPlanner;
