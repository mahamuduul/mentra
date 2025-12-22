import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { showSuccessToast, showErrorToast } from '../../utils/toast';
import { FaLightbulb, FaCheckCircle } from 'react-icons/fa';

const ProblemSolvingWorksheet = () => {
  const { currentUser } = useAuth();
  const [worksheet, setWorksheet] = useState({
    problem: '',
    goalOutcome: '',
    brainstormSolutions: ['', '', ''],
    evaluatedSolutions: [],
    chosenSolution: '',
    actionSteps: [''],
    potentialObstacles: '',
    supportNeeded: '',
  });
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchHistory = async () => {
    try {
      const token = await currentUser.getIdToken();
      const response = await fetch('http://localhost:5000/api/tools/problem-solving', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      if (!response.ok) {
        console.error('Failed to fetch history:', response.status);
        return;
      }
      
      const data = await response.json();
      setHistory(data || []);
    } catch (error) {
      console.error('Error:', error);
      showErrorToast('Failed to load history');
    }
  };

  const handleAddSolution = () => {
    setWorksheet({
      ...worksheet,
      brainstormSolutions: [...worksheet.brainstormSolutions, '']
    });
  };

  const handleSolutionChange = (index, value) => {
    const updated = [...worksheet.brainstormSolutions];
    updated[index] = value;
    setWorksheet({ ...worksheet, brainstormSolutions: updated });
  };

  const handleAddActionStep = () => {
    setWorksheet({
      ...worksheet,
      actionSteps: [...worksheet.actionSteps, '']
    });
  };

  const handleActionStepChange = (index, value) => {
    const updated = [...worksheet.actionSteps];
    updated[index] = value;
    setWorksheet({ ...worksheet, actionSteps: updated });
  };

  const handleSave = async () => {
    if (!worksheet.problem.trim()) {
      showErrorToast('Please define the problem');
      return;
    }

    if (!worksheet.chosenSolution.trim()) {
      showErrorToast('Please choose a solution');
      return;
    }

    setIsLoading(true);
    try {
      const token = await currentUser.getIdToken();
      
      // Filter out empty solutions and action steps
      const cleanedWorksheet = {
        ...worksheet,
        brainstormSolutions: worksheet.brainstormSolutions.filter(s => s.trim()),
        actionSteps: worksheet.actionSteps.filter(s => s.trim())
      };

      const response = await fetch('http://localhost:5000/api/tools', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          toolType: 'problem-solving',
          data: cleanedWorksheet,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Save worksheet failed:', response.status, errorData);
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }
      
      await response.json();
      showSuccessToast('Worksheet saved successfully');
      fetchHistory();
      setWorksheet({
        problem: '',
        goalOutcome: '',
        brainstormSolutions: ['', '', ''],
        evaluatedSolutions: [],
        chosenSolution: '',
        actionSteps: [''],
        potentialObstacles: '',
        supportNeeded: '',
      });
    } catch (error) {
      console.error('Error saving worksheet:', error);
      showErrorToast(error.message || 'Failed to save worksheet');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Guide */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <div className="flex items-start space-x-3">
          <FaLightbulb className="text-blue-600 text-xl mt-1" />
          <div>
            <h5 className="font-semibold text-gray-900 mb-2">Structured Problem-Solving</h5>
            <p className="text-sm text-gray-700">
              Break down complex problems into manageable steps. This evidence-based approach helps reduce
              overwhelm and creates actionable solutions.
            </p>
          </div>
        </div>
      </div>

      {/* Worksheet Form */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-4">Problem-Solving Worksheet</h4>
        
        <div className="space-y-6">
          {/* Step 1: Define Problem */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Step 1: Define the Problem
            </label>
            <textarea
              value={worksheet.problem}
              onChange={(e) => setWorksheet({ ...worksheet, problem: e.target.value })}
              rows="3"
              placeholder="What exactly is the problem? Be specific and objective."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Step 2: Goal */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Step 2: What's Your Ideal Outcome?
            </label>
            <textarea
              value={worksheet.goalOutcome}
              onChange={(e) => setWorksheet({ ...worksheet, goalOutcome: e.target.value })}
              rows="2"
              placeholder="What would success look like?"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Step 3: Brainstorm Solutions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Step 3: Brainstorm Possible Solutions
            </label>
            <div className="space-y-2">
              {worksheet.brainstormSolutions.map((solution, index) => (
                <input
                  key={index}
                  type="text"
                  value={solution}
                  onChange={(e) => handleSolutionChange(index, e.target.value)}
                  placeholder={`Solution ${index + 1}`}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ))}
            </div>
            <button
              onClick={handleAddSolution}
              className="mt-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              + Add Another Solution
            </button>
          </div>

          {/* Step 4: Choose Solution */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Step 4: Choose Your Best Solution
            </label>
            <textarea
              value={worksheet.chosenSolution}
              onChange={(e) => setWorksheet({ ...worksheet, chosenSolution: e.target.value })}
              rows="2"
              placeholder="Which solution will you implement? Why?"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Step 5: Action Steps */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Step 5: Break It Into Action Steps
            </label>
            <div className="space-y-2">
              {worksheet.actionSteps.map((step, index) => (
                <input
                  key={index}
                  type="text"
                  value={step}
                  onChange={(e) => handleActionStepChange(index, e.target.value)}
                  placeholder={`Action step ${index + 1}`}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ))}
            </div>
            <button
              onClick={handleAddActionStep}
              className="mt-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              + Add Another Step
            </button>
          </div>

          {/* Step 6: Obstacles */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Step 6: What Obstacles Might You Face?
            </label>
            <textarea
              value={worksheet.potentialObstacles}
              onChange={(e) => setWorksheet({ ...worksheet, potentialObstacles: e.target.value })}
              rows="2"
              placeholder="What could get in the way? How will you handle it?"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Step 7: Support */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Step 7: What Support Do You Need?
            </label>
            <textarea
              value={worksheet.supportNeeded}
              onChange={(e) => setWorksheet({ ...worksheet, supportNeeded: e.target.value })}
              rows="2"
              placeholder="Who or what could help you succeed?"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <button
            onClick={handleSave}
            disabled={isLoading}
            className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Saving...' : 'Save Worksheet'}
          </button>
        </div>
      </div>

      {/* History */}
      {history.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900">Problem-Solving History</h4>
          {history.slice(0, 5).map((entry, index) => (
            <div key={index} className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex justify-between items-start mb-4">
                <span className="text-sm font-medium text-gray-600">
                  {new Date(entry.createdAt).toLocaleDateString()}
                </span>
                <FaCheckCircle className="text-green-600" />
              </div>
              
              <div className="space-y-3">
                <div>
                  <span className="text-xs font-medium text-gray-500 uppercase">Problem</span>
                  <p className="text-sm text-gray-900 mt-1">{entry.data.problem}</p>
                </div>
                
                <div>
                  <span className="text-xs font-medium text-gray-500 uppercase">Chosen Solution</span>
                  <p className="text-sm text-green-800 mt-1 p-3 bg-green-50 rounded-lg border border-green-200">
                    {entry.data.chosenSolution}
                  </p>
                </div>

                {entry.data.actionSteps && entry.data.actionSteps.length > 0 && (
                  <div>
                    <span className="text-xs font-medium text-gray-500 uppercase">Action Steps</span>
                    <ul className="mt-1 space-y-1">
                      {entry.data.actionSteps.map((step, i) => (
                        <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                          <span className="text-blue-600">•</span>
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProblemSolvingWorksheet;
