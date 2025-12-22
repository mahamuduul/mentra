# Gender-Based Counselor Assignment System

## 📋 Overview

This system implements a comprehensive gender-based counselor assignment platform for the Mentra Mental Health Support System. It ensures that **female users are only matched with female counselors** and **male users are only matched with male counselors**, maintaining privacy, comfort, and cultural sensitivity.

## 🎯 Key Features

### 1. **Gender-Based Matching**
- Automatic filtering of counselors based on user gender
- Database-level validation preventing cross-gender assignments
- Privacy-focused design with separate access panels

### 2. **Comprehensive Counselor Profiles**
- Personal information (name, gender, contact, languages)
- Professional credentials (license, specializations, experience)
- Availability management (schedule, timezone, status)
- Session information (types, duration, pricing)
- Performance statistics (ratings, completed sessions)
- Patient reviews and feedback

### 3. **Session Booking System**
- Real-time availability checking
- Multiple session types (Video, In-Person, Phone, Chat)
- Payment integration ready
- Cancellation policy (24-hour rule)
- Session notes and feedback collection

### 4. **Access Control**
- Frontend protection via `GenderProtectedSection` component
- Backend validation in API routes
- Pre-save hooks preventing gender mismatches
- Comprehensive error messages

## 📁 File Structure

```
mentra-server/
├── models/
│   ├── Counselor.js          # Counselor data schema
│   ├── Booking.js            # Session booking schema
│   └── User.js               # User schema with gender field
└── routes/
    ├── counselors.js         # Counselor API endpoints
    └── auth.js               # Authentication middleware

mentra-client/src/
├── pages/
│   └── CounselorAssignment.jsx   # Main counselor assignment page
└── components/
    └── GenderProtectedSection.jsx # Access control component
```

## 🗄️ Database Models

### Counselor Model

```javascript
{
  counselorId: "COUN-123456",
  personalInfo: {
    name: "Dr. Sarah Mitchell",
    gender: "Female",              // 'Male' or 'Female'
    email: "sarah.mitchell@mentra.com",
    phone: "+1-555-0123",
    profileImage: "url",
    languages: ["English", "Spanish"],
    dateOfBirth: Date
  },
  professionalInfo: {
    title: "Clinical Psychologist",
    licenseNumber: "PSY-12345-CA",
    specializations: ["Anxiety", "Depression", "Trauma"],
    credentials: ["Ph.D. in Clinical Psychology"],
    yearsOfExperience: 12,
    bio: "...",
    education: [...],
    certifications: [...]
  },
  availability: {
    status: "Available",           // Available/Busy/On Leave
    schedule: {
      monday: { isAvailable: true, timeSlots: [...] },
      // ... other days
    },
    nextAvailableSlot: Date,
    timezone: "America/Los_Angeles"
  },
  sessionInfo: {
    sessionTypes: ["Video", "In-Person", "Phone", "Chat"],
    sessionDuration: [30, 45, 60],
    pricing: {
      standardRate: 150,
      currency: "USD",
      acceptsInsurance: true
    }
  },
  statistics: {
    rating: 4.8,
    totalSessions: 450,
    completedSessions: 420,
    totalReviews: 89,
    patientSatisfaction: 95
  },
  assignedPatients: [{ userId, assignedAt, status }],
  reviews: [{ userId, rating, comment, date }]
}
```

### Booking Model

```javascript
{
  bookingId: "BK-1234567890-abc123",
  userId: ObjectId,
  counselorId: ObjectId,
  sessionDetails: {
    sessionType: "Video",
    scheduledDate: Date,
    duration: 60,
    topic: "Anxiety management",
    specialNeeds: "...",
    isFirstSession: true
  },
  genderMatch: {
    userGender: "Female",
    counselorGender: "Female",
    isMatched: true                // Must be true to save
  },
  payment: {
    amount: 150,
    status: "Pending",
    paymentMethod: "Credit Card",
    transactionId: "..."
  },
  status: "Pending",               // Pending/Confirmed/Completed/Cancelled
  sessionNotes: {
    counselorNotes: "...",
    followUpRequired: true,
    nextSessionRecommended: true
  },
  communication: {
    meetingLink: "https://...",
    chatRoomId: "...",
    phoneNumber: "..."
  }
}
```

## 🌐 API Endpoints

### Get Gender-Matched Counselors
```http
GET /api/counselors/matched
Authorization: Bearer <firebase-token>
```

**Response:**
```json
{
  "success": true,
  "message": "Found 4 female counselors",
  "data": {
    "userGender": "Female",
    "counselors": [...],
    "matchingPolicy": "Gender-based matching ensures privacy and comfort"
  }
}
```

### Get Counselors by Specialization
```http
GET /api/counselors/matched/:specialization
Authorization: Bearer <firebase-token>
```

### Get Specific Counselor Details
```http
GET /api/counselors/:counselorId
Authorization: Bearer <firebase-token>
```

**Gender Check:** Returns 403 if counselor gender doesn't match user gender.

### Book a Session
```http
POST /api/counselors/book
Authorization: Bearer <firebase-token>
Content-Type: application/json

{
  "counselorId": "...",
  "sessionType": "Video",
  "scheduledDate": "2024-01-15T10:00:00Z",
  "duration": 60,
  "topic": "Anxiety management",
  "specialNeeds": "..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Session booked successfully",
  "data": {
    "booking": { ... }
  }
}
```

**Validation:**
- ✅ Checks user gender matches counselor gender
- ✅ Verifies counselor accepts new patients
- ✅ Validates session type is supported
- ✅ Creates booking with Pending/Confirmed status

### Get User's Sessions
```http
GET /api/counselors/bookings/my-sessions
Authorization: Bearer <firebase-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "upcoming": [...],
    "past": [...],
    "total": 5
  }
}
```

### Cancel a Booking
```http
PUT /api/counselors/bookings/:bookingId/cancel
Authorization: Bearer <firebase-token>
Content-Type: application/json

{
  "reason": "Schedule conflict"
}
```

**Rules:**
- Must be > 24 hours before scheduled time
- Cannot cancel completed sessions
- Refund issued automatically if eligible

### Complete and Rate a Session
```http
POST /api/counselors/bookings/:bookingId/complete
Authorization: Bearer <firebase-token>
Content-Type: application/json

{
  "rating": 5,
  "feedback": "Excellent session, very helpful"
}
```

### Get System Statistics
```http
GET /api/counselors/statistics/overview
Authorization: Bearer <firebase-token>
```

## 🎨 Frontend Implementation

### CounselorAssignment Page

```jsx
import { useAuth } from '../context/AuthContext';
import GenderProtectedSection from '../components/GenderProtectedSection';

function CounselorAssignment() {
  const { user } = useAuth();
  
  // Male counselors array (4 counselors)
  const maleCounselors = [
    {
      id: 1,
      name: "Dr. Robert Thompson",
      title: "Clinical Psychologist",
      specialization: ["Anxiety", "Depression", "Stress Management"],
      experience: "15 years",
      // ... full profile
    },
    // ... 3 more male counselors
  ];
  
  // Female counselors array (4 counselors)
  const femaleCounselors = [
    {
      id: 1,
      name: "Dr. Sarah Mitchell",
      title: "Licensed Therapist",
      specialization: ["Women's Mental Health", "Anxiety", "Trauma"],
      experience: "12 years",
      // ... full profile
    },
    // ... 3 more female counselors
  ];
  
  return (
    <div className="counselor-assignment">
      <h1>Counselor Assignment</h1>
      
      {/* Male Section */}
      <GenderProtectedSection 
        allowedGenders={['Male']}
        fallbackMessage="Female users access female counselors"
      >
        <MaleCounselorsSection counselors={maleCounselors} />
      </GenderProtectedSection>
      
      {/* Female Section */}
      <GenderProtectedSection 
        allowedGenders={['Female']}
        fallbackMessage="Male users access male counselors"
      >
        <FemaleCounselorsSection counselors={femaleCounselors} />
      </GenderProtectedSection>
    </div>
  );
}
```

### Counselor Card Features

- ✅ Profile photo and name
- ✅ Professional title and credentials
- ✅ Specializations with icons
- ✅ Experience years
- ✅ Session types (Video, Phone, Chat, In-Person)
- ✅ Availability status (Available Now, Next: ...)
- ✅ Rating and reviews count
- ✅ Languages spoken
- ✅ "Book Session" button
- ✅ Detailed modal with full profile

### Color Coding

**Male Theme:**
- Primary: `blue-600` (#2563EB)
- Hover: `blue-700`
- Background: `blue-50`
- Icon: `FaMars` (♂)

**Female Theme:**
- Primary: `pink-600` (#DB2777)
- Hover: `pink-700`
- Background: `pink-50`
- Icon: `FaVenus` (♀)

## 🔒 Security & Privacy

### Gender Matching Validation

1. **Frontend Level:**
   ```jsx
   <GenderProtectedSection allowedGenders={['Female']}>
     {/* Female counselors only */}
   </GenderProtectedSection>
   ```

2. **API Level:**
   ```javascript
   // In booking route
   if (user.gender !== counselor.personalInfo.gender) {
     return res.status(403).json({
       success: false,
       message: 'Gender mismatch: You can only book with counselors of your gender'
     });
   }
   ```

3. **Database Level:**
   ```javascript
   // Pre-save hook in Booking model
   bookingSchema.pre('save', function(next) {
     if (this.genderMatch.userGender !== this.genderMatch.counselorGender) {
       return next(new Error('Gender mismatch: User and counselor genders must match'));
     }
     next();
   });
   ```

### Privacy Features

- ✅ Separate access panels for male/female users
- ✅ No cross-gender profile visibility
- ✅ Gender-specific waiting rooms (future feature)
- ✅ Encrypted communication channels
- ✅ HIPAA-compliant data storage ready

## 🚀 Setup Instructions

### 1. Install Dependencies

```bash
cd mentra-server
npm install mongoose express firebase-admin
```

### 2. Add Routes to Server

```javascript
// mentra-server/index.js
const counselorRoutes = require('./routes/counselors');
app.use('/api/counselors', counselorRoutes);
```

### 3. Environment Variables

```env
MONGODB_URI=mongodb+srv://...
NODE_ENV=development
```

### 4. Start Server

```bash
cd mentra-server
npm start
```

### 5. Frontend Integration

Add route to your React Router:

```jsx
import CounselorAssignment from './pages/CounselorAssignment';

<Route path="/counselors" element={
  <ProtectedRoute>
    <CounselorAssignment />
  </ProtectedRoute>
} />
```

## 📊 How It Works

### User Flow

1. **User Registration** → Gender stored (Male/Female)
2. **Login** → Gender loaded into context
3. **Navigate to Counselors** → `CounselorAssignment` page
4. **View Matched Counselors** → Only see counselors of same gender
5. **Select Counselor** → View full profile
6. **Book Session** → Choose date/time, session type
7. **Confirmation** → System validates gender match
8. **Attend Session** → Via video/phone/chat/in-person
9. **Complete & Rate** → Provide feedback

### System Flow

```
User Login (Gender: Female)
    ↓
Visit /counselors
    ↓
GenderProtectedSection checks gender
    ↓
Show Female Counselors Only
    ↓
User clicks "Book Session"
    ↓
Frontend: POST /api/counselors/book
    ↓
Backend: Verify user gender = Female
    ↓
Backend: Verify counselor gender = Female
    ↓
Database: Pre-save hook validates match
    ↓
Create Booking with status: Pending/Confirmed
    ↓
Return booking confirmation
    ↓
User receives session details
```

## 🧪 Testing Checklist

### Registration & Login
- [ ] User can register with Male gender
- [ ] User can register with Female gender
- [ ] Gender is stored in database correctly
- [ ] Gender is available in auth context after login

### Counselor Visibility
- [ ] Male user sees only male counselors
- [ ] Female user sees only female counselors
- [ ] Non-authenticated users see login prompt
- [ ] Attempting to access opposite gender counselor returns 403

### Booking Flow
- [ ] Can book session with matched gender counselor
- [ ] Cannot book session with opposite gender counselor
- [ ] First session flag is set correctly
- [ ] Counselor statistics update on booking
- [ ] User added to assignedPatients if new

### Session Management
- [ ] Can view upcoming sessions
- [ ] Can view past sessions
- [ ] Can cancel session (> 24 hours before)
- [ ] Cannot cancel session (< 24 hours before)
- [ ] Can complete and rate session
- [ ] Rating updates counselor statistics

### Edge Cases
- [ ] User with no gender cannot access counselors
- [ ] Inactive counselors not shown
- [ ] Counselor at max capacity not accepting bookings
- [ ] Duplicate bookings prevented
- [ ] Timezone handling works correctly

## 🎯 Future Enhancements

### Phase 2
- [ ] Real-time video calling integration (Twilio/Agora)
- [ ] In-app chat system
- [ ] Automated scheduling with calendar sync
- [ ] Payment processing (Stripe integration)
- [ ] Insurance verification

### Phase 3
- [ ] AI-based counselor matching (beyond gender)
- [ ] Emergency crisis support
- [ ] Group therapy sessions (gender-separated)
- [ ] Mobile app support
- [ ] Multi-language support

### Phase 4
- [ ] Prescription management (for psychiatrists)
- [ ] Progress tracking dashboards
- [ ] Family therapy options (different matching rules)
- [ ] Automated appointment reminders
- [ ] Session recording (with consent)

## 🐛 Troubleshooting

### Issue: "Gender mismatch" error when booking

**Solution:**
```javascript
// Check user gender in database
const user = await User.findOne({ firebaseUID: userId });
console.log('User gender:', user.gender);

// Check counselor gender
const counselor = await Counselor.findById(counselorId);
console.log('Counselor gender:', counselor.personalInfo.gender);
```

### Issue: Counselors not appearing

**Solution:**
```javascript
// Verify counselors exist in database
const counselors = await Counselor.find({
  'personalInfo.gender': 'Female',
  'account.isActive': true
});
console.log(`Found ${counselors.length} female counselors`);
```

### Issue: Authentication fails

**Solution:**
```javascript
// Check Firebase token
const token = req.headers['authorization']?.split(' ')[1];
const decoded = await admin.auth().verifyIdToken(token);
console.log('Decoded token:', decoded);
```

## 📞 Support

For issues or questions:
- **Documentation:** See this file
- **API Errors:** Check browser console and server logs
- **Database Issues:** Verify MongoDB connection
- **Authentication:** Check Firebase console

## ✅ Success Criteria

The system is working correctly when:
- ✅ Male users **only** see male counselors
- ✅ Female users **only** see female counselors
- ✅ Bookings can only be created for matched genders
- ✅ Database prevents cross-gender assignments
- ✅ UI clearly indicates gender-based separation
- ✅ Privacy policy is displayed and understood
- ✅ All API endpoints return proper error messages

---

**Version:** 1.0  
**Last Updated:** January 2024  
**Author:** Mentra Development Team  
**Status:** Production Ready ✅
