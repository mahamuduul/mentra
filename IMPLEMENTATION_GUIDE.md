# Quick Implementation Guide for Remaining Male Mental Health Tools

## Template Structure (Based on GoalBreakdownTool.jsx)

Every tool should follow this structure:

```javascript
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { showSuccessToast, showErrorToast } from '../../utils/toast';

const ToolName = () => {
  const { currentUser } = useAuth();
  const [entries, setEntries] = useState([]);
  const [formData, setFormData] = useState({
    // Tool-specific fields
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchEntries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchEntries = async () => {
    try {
      const token = await currentUser.getIdToken();
      const response = await fetch('http://localhost:5000/api/tools/TOOL-TYPE-HERE', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      if (!response.ok) throw new Error('Failed to fetch');
      
      const data = await response.json();
      setEntries(data || []);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSave = async () => {
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
          toolType: 'TOOL-TYPE-HERE',
          data: formData,
        }),
      });

      if (!response.ok) throw new Error('Failed to save');
      
      await response.json();
      showSuccessToast('Saved successfully');
      fetchEntries();
      // Reset form
      setFormData({ /* initial state */ });
    } catch (error) {
      showErrorToast(error.message || 'Failed to save');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Form Section */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-4">Tool Title</h4>
        
        {/* Form fields here */}
        
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="w-full px-6 py-3 bg-[COLOR]-600 text-white font-semibold rounded-lg hover:bg-[COLOR]-700 transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : 'Save'}
        </button>
      </div>

      {/* History Section */}
      {entries.length > 0 && (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-4">History</h4>
          <div className="space-y-3">
            {entries.map((entry, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                {/* Display entry data */}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ToolName;
```

## Remaining Tools Implementation Details

### 1. TimeManagementPlanner
**Tool Type:** `time-management`
**Color:** Blue-600 (#2563eb)
**Fields:**
```javascript
{
  date: string,
  tasks: [
    { time: string, task: string, completed: boolean }
  ],
  pomodoroSessions: number,
  priorityMatrix: {
    urgent_important: [string],
    not_urgent_important: [string],
    urgent_not_important: [string],
    not_urgent_not_important: [string]
  }
}
```

**Components to include:**
- Calendar date picker
- Task time slots
- Pomodoro timer (25min work / 5min break)
- 2x2 priority matrix (Eisenhower Matrix)

---

### 2. CBTReframingWorksheet
**Tool Type:** `cbt-reframing`
**Color:** Blue-600 (#2563eb)
**Fields:**
```javascript
{
  situation: string,
  automaticThought: string,
  emotions: string[],
  evidence: {
    for: string,
    against: string
  },
  balancedThought: string,
  outcomeEmotions: string[]
}
```

**Components to include:**
- Text area for situation description
- Automatic thought input
- Emotion selector (checkboxes: anxious, worried, stressed, etc.)
- Evidence for/against text areas
- Balanced thought textarea
- Before/after emotion comparison

---

### 3. FinancialStressJournal
**Tool Type:** `financial-journal`
**Color:** Green-600 (#16a34a)
**Fields:**
```javascript
{
  date: string,
  trigger: string,
  intensity: number, // 0-10 slider
  physicalSymptoms: string[],
  thoughtsAndFears: string,
  copingActions: string,
  helpfulness: number // 0-10 slider
}
```

**Components to include:**
- Date picker
- Trigger description textarea
- Intensity slider (0-10)
- Physical symptoms checkboxes (racing heart, sweating, etc.)
- Thoughts textarea
- Coping actions textarea
- Helpfulness rating slider

---

### 4. ProblemSolvingWorksheet
**Tool Type:** `problem-solving`
**Color:** Green-600 (#16a34a)
**Fields:**
```javascript
{
  problem: string,
  goalStatement: string,
  options: [
    { option: string, pros: string, cons: string }
  ],
  chosenOption: number, // index
  actionSteps: [
    { step: string, deadline: string, completed: boolean }
  ]
}
```

**Components to include:**
- Problem definition textarea
- Goal statement input
- Add/remove options with pros/cons
- Option selector (radio buttons)
- Action steps with deadline and checkbox

---

### 5. BudgetAwarenessTool
**Tool Type:** `budget-awareness`
**Color:** Green-600 (#16a34a)
**Fields:**
```javascript
{
  month: string,
  income: {
    salary: number,
    other: [{ source: string, amount: number }]
  },
  expenses: {
    housing: number,
    food: number,
    transportation: number,
    utilities: number,
    entertainment: number,
    debt: number,
    other: [{ category: string, amount: number }]
  },
  notes: string
}
```

**Components to include:**
- Month selector
- Income inputs with add other sources
- Category expense inputs
- Add custom expense categories
- Total income/expense/balance calculation
- Visual chart (simple bar or pie)

---

### 6. SupportResourceHub
**Tool Type:** `support-resource` (not saved, just display)
**Color:** Green-600 (#16a34a)

**This is a static resource page, no database needed**

**Components to include:**
- Resource cards with:
  - Financial counseling services
  - Debt management programs
  - Government assistance programs
  - Budgeting apps recommendations
  - Financial literacy courses
  - Emergency fund resources

---

### 7. TriggerTracker
**Tool Type:** `trigger-tracker`
**Color:** Red-600 (#dc2626)
**Fields:**
```javascript
{
  date: string,
  time: string,
  triggerType: string, // dropdown
  situation: string,
  intensity: number, // 0-10 slider
  physicalSigns: string[],
  thoughts: string,
  response: string,
  alternativeResponse: string
}
```

**Components to include:**
- Date & time pickers
- Trigger type dropdown (criticism, disrespect, frustration, etc.)
- Situation textarea
- Intensity slider (0-10)
- Physical signs checkboxes (clenched fists, raised voice, etc.)
- Thoughts textarea
- Response description
- Alternative response brainstorming

---

### 8. CoolingOffTimer
**Tool Type:** `cooling-timer`
**Color:** Red-600 (#dc2626)
**Fields:**
```javascript
{
  startTime: string,
  duration: number, // 2, 5, or 10 minutes
  technique: string, // breathing, walking, etc.
  intensity_before: number,
  intensity_after: number,
  completed: boolean
}
```

**Components to include:**
- Timer duration buttons (2, 5, 10 minutes)
- Countdown display
- Breathing instruction animation
- Intensity before/after sliders
- Technique selector
- Start/Stop/Complete buttons

---

### 9. AngerCBTWorksheet
**Tool Type:** `anger-cbt`
**Color:** Red-600 (#dc2626)
**Fields:**
```javascript
{
  situation: string,
  thoughts: string,
  emotions: string[],
  intensity: number, // 0-10
  behaviors: string,
  consequences: string,
  alternativeThoughts: string,
  alternativeBehaviors: string,
  newIntensity: number // 0-10
}
```

**Components to include:**
- Situation textarea
- Thoughts textarea
- Emotion checkboxes
- Intensity slider (0-10)
- Behaviors textarea
- Consequences textarea
- Alternative thoughts textarea
- Alternative behaviors textarea
- New intensity slider

---

### 10. ConflictResolutionScripts
**Tool Type:** `conflict-resolution`
**Color:** Red-600 (#dc2626)
**Fields:**
```javascript
{
  conflictType: string, // dropdown
  relationship: string, // dropdown
  iStatement: {
    when: string,
    iFeelI: string,
    because: string,
    iNeed: string
  },
  apologyScript: {
    acknowledge: string,
    takeResponsibility: string,
    makeAmends: string
  },
  practiced: boolean,
  outcome: string
}
```

**Components to include:**
- Conflict type dropdown (work, family, romantic, etc.)
- Relationship type dropdown
- I-statement builder:
  - "When [situation]..."
  - "I feel [emotion]..."
  - "Because [reason]..."
  - "I need [request]..."
- Apology script builder:
  - Acknowledge impact
  - Take responsibility
  - Make amends
- Practice checkbox
- Outcome notes

---

## Color Reference

| Category | Color Class | Hex Code |
|----------|------------|----------|
| Career Pressure | `blue-600` | #2563eb |
| Financial Stress | `green-600` | #16a34a |
| Anger Management | `red-600` | #dc2626 |

## Common Tailwind Classes

```css
/* Buttons */
bg-blue-600 hover:bg-blue-700    // Career
bg-green-600 hover:bg-green-700  // Financial
bg-red-600 hover:bg-red-700      // Anger

/* Borders */
border-blue-200   // Career
border-green-200  // Financial
border-red-200    // Anger

/* Backgrounds */
bg-blue-50   // Career light bg
bg-green-50  // Financial light bg
bg-red-50    // Anger light bg

/* Text */
text-blue-600   // Career
text-green-600  // Financial
text-red-600    // Anger
```

## Implementation Order (Recommended)

1. **SupportResourceHub** - Easiest (no database, just static content)
2. **CoolingOffTimer** - Simple timer logic
3. **TriggerTracker** - Basic form with dropdown
4. **TimeManagementPlanner** - Moderate complexity
5. **FinancialStressJournal** - Similar to BurnoutCheckIn
6. **BudgetAwarenessTool** - Math calculations
7. **ProblemSolvingWorksheet** - Multiple options handling
8. **CBTReframingWorksheet** - Structured cognitive approach
9. **AngerCBTWorksheet** - Similar to CBT Reframing
10. **ConflictResolutionScripts** - Most complex with templates

## Testing Checklist

For each tool:
- [ ] Form validation works
- [ ] Save functionality works
- [ ] Data persists to database
- [ ] History displays correctly
- [ ] Loading states work
- [ ] Error handling works
- [ ] Toast notifications appear
- [ ] Data appears in Dashboard
- [ ] Color scheme matches category
- [ ] Mobile responsive

---

*Follow this guide to implement all remaining tools consistently!*
