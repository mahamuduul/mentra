import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { showSuccessToast, showErrorToast } from '../../utils/toast';
import { FaDollarSign, FaTrash } from 'react-icons/fa';

const FinancialStressJournal = () => {
  const { currentUser } = useAuth();
  const [entries, setEntries] = useState([]);
  const [newEntry, setNewEntry] = useState({
    date: new Date().toISOString().split('T')[0],
    stressor: '',
    amount: '',
    emotionalImpact: 5,
    copingStrategy: '',
    notes: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const stressorTypes = [
    'Bills/Rent', 'Debt', 'Job Loss/Income Reduction', 'Unexpected Expense',
    'Medical Costs', 'Family Support', 'Student Loans', 'Other'
  ];

  useEffect(() => {
    fetchEntries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchEntries = async () => {
    try {
      const token = await currentUser.getIdToken();
      const response = await fetch('http://localhost:5000/api/tools/financial-journal', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      if (!response.ok) {
        console.error('Failed to fetch entries:', response.status);
        return;
      }
      
      const data = await response.json();
      setEntries(data || []);
    } catch (error) {
      console.error('Error fetching entries:', error);
      showErrorToast('Failed to load journal entries');
    }
  };

  const handleSave = async () => {
    if (!newEntry.stressor) {
      showErrorToast('Please select a stressor type');
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
          toolType: 'financial-journal',
          data: newEntry,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Save entry failed:', response.status, errorData);
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }
      
      await response.json();
      showSuccessToast('Journal entry saved');
      fetchEntries();
      setNewEntry({
        date: new Date().toISOString().split('T')[0],
        stressor: '',
        amount: '',
        emotionalImpact: 5,
        copingStrategy: '',
        notes: '',
      });
    } catch (error) {
      console.error('Error saving entry:', error);
      showErrorToast(error.message || 'Failed to save entry');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (entryId) => {
    try {
      const token = await currentUser.getIdToken();
      const response = await fetch(`http://localhost:5000/api/tools/${entryId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to delete entry');
      
      showSuccessToast('Entry deleted');
      fetchEntries();
    } catch (error) {
      showErrorToast('Failed to delete entry');
    }
  };

  const getTotalAmount = () => {
    return entries.reduce((sum, entry) => {
      const amount = parseFloat(entry.data.amount) || 0;
      return sum + amount;
    }, 0);
  };

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
        <p className="text-sm text-gray-700">
          <strong>Track your financial stressors</strong> to identify patterns and develop healthy coping strategies.
          Understanding your emotional response to money stress is the first step to managing it.
        </p>
      </div>

      {/* New Entry Form */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-4">New Journal Entry</h4>
        
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <input
                type="date"
                value={newEntry.date}
                onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Financial Stressor
              </label>
              <select
                value={newEntry.stressor}
                onChange={(e) => setNewEntry({ ...newEntry, stressor: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Select stressor type</option>
                {stressorTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount (Optional)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-500">$</span>
              <input
                type="number"
                value={newEntry.amount}
                onChange={(e) => setNewEntry({ ...newEntry, amount: e.target.value })}
                placeholder="0.00"
                min="0"
                step="0.01"
                className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Emotional Impact: {newEntry.emotionalImpact}/10
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={newEntry.emotionalImpact}
              onChange={(e) => setNewEntry({ ...newEntry, emotionalImpact: parseInt(e.target.value) })}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-600 mt-1">
              <span>Minimal</span>
              <span>Severe</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Coping Strategy Used
            </label>
            <input
              type="text"
              value={newEntry.copingStrategy}
              onChange={(e) => setNewEntry({ ...newEntry, copingStrategy: e.target.value })}
              placeholder="e.g., Made a budget, Talked to friend, Researched resources"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              value={newEntry.notes}
              onChange={(e) => setNewEntry({ ...newEntry, notes: e.target.value })}
              rows="3"
              placeholder="Describe the situation and how you're feeling..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <button
            onClick={handleSave}
            disabled={isLoading}
            className="w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Saving...' : 'Save Entry'}
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      {entries.length > 0 && (
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Entries</span>
              <span className="text-2xl font-bold text-gray-900">{entries.length}</span>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Tracked Amount</span>
              <span className="text-2xl font-bold text-green-600">${getTotalAmount().toFixed(2)}</span>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Avg. Impact</span>
              <span className="text-2xl font-bold text-orange-600">
                {(entries.reduce((sum, e) => sum + e.data.emotionalImpact, 0) / entries.length).toFixed(1)}/10
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Journal Entries */}
      {entries.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900">Journal Entries</h4>
          {entries.map((entry) => (
            <div key={entry._id} className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-900">
                      {new Date(entry.data.date).toLocaleDateString()}
                    </span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                      {entry.data.stressor}
                    </span>
                  </div>
                  {entry.data.amount && (
                    <div className="flex items-center gap-2 mt-2">
                      <FaDollarSign className="text-green-600" />
                      <span className="text-lg font-semibold text-gray-900">
                        ${parseFloat(entry.data.amount).toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(entry._id)}
                  className="text-red-600 hover:text-red-700 p-2"
                >
                  <FaTrash />
                </button>
              </div>

              <div className="space-y-2">
                <div>
                  <span className="text-xs font-medium text-gray-500 uppercase">Emotional Impact</span>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${entry.data.emotionalImpact > 7 ? 'bg-red-600' : entry.data.emotionalImpact > 4 ? 'bg-yellow-600' : 'bg-green-600'}`}
                        style={{ width: `${entry.data.emotionalImpact * 10}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{entry.data.emotionalImpact}/10</span>
                  </div>
                </div>

                {entry.data.copingStrategy && (
                  <div>
                    <span className="text-xs font-medium text-gray-500 uppercase">Coping Strategy</span>
                    <p className="text-sm text-gray-900 mt-1">{entry.data.copingStrategy}</p>
                  </div>
                )}

                {entry.data.notes && (
                  <div>
                    <span className="text-xs font-medium text-gray-500 uppercase">Notes</span>
                    <p className="text-sm text-gray-700 mt-1">{entry.data.notes}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {entries.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>No journal entries yet. Create your first entry above!</p>
        </div>
      )}
    </div>
  );
};

export default FinancialStressJournal;
