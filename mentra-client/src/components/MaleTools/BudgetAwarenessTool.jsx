import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { showSuccessToast, showErrorToast } from '../../utils/toast';
import { FaDollarSign, FaChartPie } from 'react-icons/fa';

const BudgetAwarenessTool = () => {
  const { currentUser } = useAuth();
  const [budgets, setBudgets] = useState([]);
  const [newBudget, setNewBudget] = useState({
    month: new Date().toISOString().slice(0, 7),
    income: '',
    expenses: {
      housing: '',
      utilities: '',
      food: '',
      transportation: '',
      healthcare: '',
      debt: '',
      entertainment: '',
      savings: '',
      other: ''
    },
    notes: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const expenseCategories = [
    { key: 'housing', label: 'Housing/Rent', color: 'bg-blue-500' },
    { key: 'utilities', label: 'Utilities', color: 'bg-green-500' },
    { key: 'food', label: 'Food/Groceries', color: 'bg-yellow-500' },
    { key: 'transportation', label: 'Transportation', color: 'bg-purple-500' },
    { key: 'healthcare', label: 'Healthcare', color: 'bg-red-500' },
    { key: 'debt', label: 'Debt Payments', color: 'bg-orange-500' },
    { key: 'entertainment', label: 'Entertainment', color: 'bg-pink-500' },
    { key: 'savings', label: 'Savings', color: 'bg-teal-500' },
    { key: 'other', label: 'Other', color: 'bg-gray-500' }
  ];

  useEffect(() => {
    fetchBudgets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchBudgets = async () => {
    try {
      const token = await currentUser.getIdToken();
      const response = await fetch('http://localhost:5000/api/tools/budget-awareness', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      if (!response.ok) {
        console.error('Failed to fetch budgets:', response.status);
        return;
      }
      
      const data = await response.json();
      setBudgets(data || []);
    } catch (error) {
      console.error('Error fetching budgets:', error);
      showErrorToast('Failed to load budgets');
    }
  };

  const handleExpenseChange = (key, value) => {
    setNewBudget({
      ...newBudget,
      expenses: {
        ...newBudget.expenses,
        [key]: value
      }
    });
  };

  const calculateTotalExpenses = (expenses) => {
    return Object.values(expenses).reduce((sum, val) => {
      return sum + (parseFloat(val) || 0);
    }, 0);
  };

  const calculateRemaining = () => {
    const income = parseFloat(newBudget.income) || 0;
    const expenses = calculateTotalExpenses(newBudget.expenses);
    return income - expenses;
  };

  const handleSave = async () => {
    if (!newBudget.income || parseFloat(newBudget.income) <= 0) {
      showErrorToast('Please enter your monthly income');
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
          toolType: 'budget-awareness',
          data: {
            ...newBudget,
            totalExpenses: calculateTotalExpenses(newBudget.expenses),
            remaining: calculateRemaining()
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Save budget failed:', response.status, errorData);
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }
      
      await response.json();
      showSuccessToast('Budget saved successfully');
      fetchBudgets();
      setNewBudget({
        month: new Date().toISOString().slice(0, 7),
        income: '',
        expenses: {
          housing: '', utilities: '', food: '', transportation: '',
          healthcare: '', debt: '', entertainment: '', savings: '', other: ''
        },
        notes: ''
      });
    } catch (error) {
      console.error('Error saving budget:', error);
      showErrorToast(error.message || 'Failed to save budget');
    } finally {
      setIsLoading(false);
    }
  };

  const getExpensePercentage = (amount, total) => {
    if (total === 0) return 0;
    return ((amount / total) * 100).toFixed(1);
  };

  const remaining = calculateRemaining();
  const totalExpenses = calculateTotalExpenses(newBudget.expenses);

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
        <p className="text-sm text-gray-700">
          <strong>Financial awareness</strong> is the first step to reducing money stress. 
          Track where your money goes and identify areas for adjustment.
        </p>
      </div>

      {/* Budget Form */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-4">Monthly Budget</h4>
        
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Month
              </label>
              <input
                type="month"
                value={newBudget.month}
                onChange={(e) => setNewBudget({ ...newBudget, month: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monthly Income
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                <input
                  type="number"
                  value={newBudget.income}
                  onChange={(e) => setNewBudget({ ...newBudget, income: e.target.value })}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div>
            <h5 className="font-medium text-gray-900 mb-3">Monthly Expenses</h5>
            <div className="grid md:grid-cols-2 gap-3">
              {expenseCategories.map(({ key, label }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                    <input
                      type="number"
                      value={newBudget.expenses[key]}
                      onChange={(e) => handleExpenseChange(key, e.target.value)}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Total Income:</span>
                <span className="text-lg font-bold text-green-600">
                  ${parseFloat(newBudget.income || 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Total Expenses:</span>
                <span className="text-lg font-bold text-orange-600">
                  ${totalExpenses.toFixed(2)}
                </span>
              </div>
              <div className="border-t border-gray-300 pt-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-900">Remaining:</span>
                  <span className={`text-xl font-bold ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${Math.abs(remaining).toFixed(2)} {remaining < 0 && '(Deficit)'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              value={newBudget.notes}
              onChange={(e) => setNewBudget({ ...newBudget, notes: e.target.value })}
              rows="2"
              placeholder="Any additional notes about this month's budget..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <button
            onClick={handleSave}
            disabled={isLoading}
            className="w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Saving...' : 'Save Budget'}
          </button>
        </div>
      </div>

      {/* Budget History */}
      {budgets.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900">Budget History</h4>
          {budgets.slice(0, 3).map((budget) => {
            const income = parseFloat(budget.data.income) || 0;
            const expenses = budget.data.totalExpenses || 0;
            const remaining = income - expenses;

            return (
              <div key={budget._id} className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h5 className="font-semibold text-gray-900">
                      {new Date(budget.data.month + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </h5>
                    <div className="flex items-center gap-4 mt-2">
                      <div>
                        <span className="text-xs text-gray-500">Income</span>
                        <p className="text-lg font-bold text-green-600">${income.toFixed(2)}</p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500">Expenses</span>
                        <p className="text-lg font-bold text-orange-600">${expenses.toFixed(2)}</p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500">Remaining</span>
                        <p className={`text-lg font-bold ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          ${Math.abs(remaining).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <FaChartPie className="text-3xl text-green-600" />
                </div>

                {/* Expense Breakdown */}
                <div className="space-y-2">
                  <h6 className="text-sm font-medium text-gray-700">Expense Breakdown</h6>
                  {expenseCategories.map(({ key, label, color }) => {
                    const amount = parseFloat(budget.data.expenses[key]) || 0;
                    if (amount === 0) return null;
                    const percentage = getExpensePercentage(amount, expenses);

                    return (
                      <div key={key} className="flex items-center gap-3">
                        <div className="flex-1">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-700">{label}</span>
                            <span className="font-medium text-gray-900">${amount.toFixed(2)} ({percentage}%)</span>
                          </div>
                          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className={`h-full ${color}`} style={{ width: `${percentage}%` }}></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {budget.data.notes && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <span className="text-xs font-medium text-gray-500 uppercase">Notes</span>
                    <p className="text-sm text-gray-700 mt-1">{budget.data.notes}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BudgetAwarenessTool;
