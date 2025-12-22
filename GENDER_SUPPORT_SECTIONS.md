# Gender-Based Support Sections Implementation

## Overview
This document describes the implementation of gender-based access control for support sections in the Mentra Mental Health Platform. After login, users now see personalized mental health expert sections based on their registered gender.

## Implementation Summary

### ✅ What Has Been Implemented

#### 1. **Gender-Specific Expert Sections**
- **Male Support Section**: Shows 3 male mental health specialists
- **Female Support Section**: Shows 3 female mental health specialists
- Each section has specialized experts tailored to gender-specific mental health challenges

#### 2. **Access Control System**
- Uses the `GenderProtectedSection` component for access control
- Male users can ONLY see the male support section
- Female users can ONLY see the female support section
- Clear access restriction messages shown when users try to view inappropriate sections

#### 3. **Authentication Check**
- Non-logged-in users see a login prompt instead of expert sections
- Message: "🔒 Please login to access gender-specific mental health support sections"

## How It Works

### For Male Users:
1. **Login** with male account
2. **Homepage** displays "Men's Mental Health Support" section
3. **Experts shown**:
   - Dr. James Anderson (Men's Stress & Performance)
   - Dr. Michael Roberts (Depression & Anxiety in Men)
   - Dr. David Lee (Substance Abuse & Men's Recovery)
4. **Female section** shows access restricted message
5. **Visual indicators**: Blue color scheme with Mars (♂) icon

### For Female Users:
1. **Login** with female account
2. **Homepage** displays "Women's Mental Health Support" section
3. **Experts shown**:
   - Dr. Sarah Mitchell (Women's Anxiety & Depression)
   - Dr. Emily Chen (Postpartum & Family Support)
   - Dr. Priya Sharma (Stress & Self-Esteem)
4. **Male section** shows access restricted message
5. **Visual indicators**: Pink color scheme with Venus (♀) icon

## Technical Details

### File Modified
- **Location**: `mentra-client/src/components/ExpertsSection.jsx`
- **Size**: 419 lines
- **Dependencies**: 
  - `useAuth` hook (for user authentication and gender)
  - `GenderProtectedSection` component (for access control)
  - `motion` from framer-motion (for animations)

### Key Features

#### Gender-Specific Expert Data
```javascript
const maleExperts = [
  {
    name: 'Dr. James Anderson',
    designation: 'Men\'s Mental Health Specialist',
    specialization: 'Men\'s Stress & Performance',
    expertise: ['Performance Anxiety', 'Work Stress', 'Men\'s Health'],
    gender: 'Male',
    // ... other fields
  },
  // ... more male experts
];

const femaleExperts = [
  {
    name: 'Dr. Sarah Mitchell',
    designation: 'Women\'s Mental Health Specialist',
    specialization: 'Women\'s Anxiety & Depression',
    expertise: ['Hormonal Changes', 'Life Transitions', 'Self-Care'],
    gender: 'Female',
    // ... other fields
  },
  // ... more female experts
];
```

#### Access Control Implementation
```jsx
<GenderProtectedSection 
  allowedGenders={['Male']}
  fallbackMessage="This support section is specifically designed for male users."
  showFallback={true}
>
  <MaleSupportSection />
</GenderProtectedSection>

<GenderProtectedSection 
  allowedGenders={['Female']}
  fallbackMessage="This support section is specifically designed for female users."
  showFallback={true}
>
  <FemaleSupportSection />
</GenderProtectedSection>
```

### Visual Differentiation

#### Male Section Design:
- **Header Background**: Blue gradient (from-blue-600 to-blue-800)
- **Icon**: Mars symbol (♂)
- **Button Color**: Blue gradient
- **Badge Color**: Blue
- **Text Color**: Blue-200 to Blue-300

#### Female Section Design:
- **Header Background**: Pink gradient (from-pink-600 to-pink-800)
- **Icon**: Venus symbol (♀)
- **Button Color**: Pink gradient
- **Badge Color**: Pink
- **Text Color**: Pink-200 to Pink-300

## User Experience Flow

### Scenario 1: Non-Authenticated User
```
User visits homepage
  ↓
Scrolls to Experts Section
  ↓
Sees message: "Please login to access gender-specific support"
  ↓
Redirected to login page
```

### Scenario 2: Male User
```
Male user logs in
  ↓
Homepage loads
  ↓
Experts Section shows:
  - Men's Mental Health Support (Visible ✓)
  - Women's Mental Health Support (Restricted ✗)
  ↓
Can book sessions with male specialists only
```

### Scenario 3: Female User
```
Female user logs in
  ↓
Homepage loads
  ↓
Experts Section shows:
  - Men's Mental Health Support (Restricted ✗)
  - Women's Mental Health Support (Visible ✓)
  ↓
Can book sessions with female specialists only
```

## Security Features

### 1. **Frontend Validation**
- `GenderProtectedSection` component checks user gender
- Immediate UI-level restriction
- Clear feedback messages

### 2. **Authentication Required**
- Must be logged in to see any experts
- Gender information comes from authenticated user object

### 3. **Access Restriction Messages**
- Clear communication when access is denied
- Professional and respectful messaging
- Explains why content is restricted

## Customization Options

### Add More Experts
```javascript
// Add to maleExperts or femaleExperts array
{
  id: 7,
  name: 'Dr. New Expert',
  designation: 'Specialist Title',
  specialization: 'Area of Focus',
  experience: '10+ years',
  patientsHelped: 1000,
  rating: 4.9,
  image: 'https://...',
  availability: 'Available',
  expertise: ['Skill 1', 'Skill 2', 'Skill 3'],
  gender: 'Male' // or 'Female',
}
```

### Modify Access Control
```jsx
// Allow both genders to see a section
<GenderProtectedSection allowedGenders={['Male', 'Female']}>
  <UniversalContent />
</GenderProtectedSection>

// Hide fallback message
<GenderProtectedSection 
  allowedGenders={['Male']} 
  showFallback={false}
>
  <Content />
</GenderProtectedSection>
```

### Change Color Schemes
Update the className conditionals in the `renderExpertCard` function:
```javascript
className={`relative h-40 overflow-hidden ${
  expert.gender === 'Male' 
    ? 'bg-gradient-to-br from-blue-600/80 to-blue-800/80' 
    : 'bg-gradient-to-br from-pink-600/80 to-pink-800/80'
}`}
```

## Testing Checklist

- [x] Non-logged-in users see login prompt
- [x] Male users see only male support section
- [x] Female users see only female support section
- [x] Access restriction messages display correctly
- [x] Visual indicators (colors, icons) show correctly
- [x] Animations work smoothly
- [x] Expert cards render properly
- [x] Book session buttons are functional
- [ ] Test booking functionality
- [ ] Test on mobile devices
- [ ] Test with different screen sizes
- [ ] Performance testing with many users

## Future Enhancements

### Potential Additions:
1. **Mixed Gender Sections**: Universal experts available to all
2. **Specialized Sections**: Age-specific, condition-specific experts
3. **Dynamic Filtering**: Filter experts by specialty, availability, rating
4. **Booking System**: Implement actual session booking functionality
5. **Expert Profiles**: Detailed pages for each expert
6. **Reviews System**: User reviews and testimonials
7. **Chat Integration**: Direct messaging with experts
8. **Video Consultations**: Integrated video call functionality

## API Integration (Future)

For production, you'll need backend endpoints:

```javascript
// GET /api/experts/gender/:gender
// Returns experts based on gender
router.get('/experts/gender/:gender', authenticateToken, async (req, res) => {
  const { gender } = req.params;
  const userGender = req.user.gender;
  
  // Verify user can only access their own gender section
  if (gender !== userGender) {
    return res.status(403).json({
      success: false,
      message: 'Access denied to this gender section'
    });
  }
  
  const experts = await Expert.find({ gender });
  res.json({ success: true, data: experts });
});
```

## Troubleshooting

### Issue: Sections not showing after login
**Solution**: 
- Check if user gender is properly set in database
- Verify AuthContext is providing user data
- Check browser console for errors

### Issue: Both sections showing for one user
**Solution**:
- Verify GenderProtectedSection component is working
- Check user.gender value in AuthContext
- Clear browser cache and reload

### Issue: Access restriction message not displaying
**Solution**:
- Ensure `showFallback={true}` is set
- Check GenderProtectedSection component implementation
- Verify fallbackMessage prop is passed correctly

## Related Documentation
- [GENDER_AUTHENTICATION_SYSTEM.md](../GENDER_AUTHENTICATION_SYSTEM.md) - Complete authentication system docs
- [GenderProtectedSection.jsx](../mentra-client/src/components/GenderProtectedSection.jsx) - Access control component
- [AuthContext.jsx](../mentra-client/src/context/AuthContext.jsx) - Authentication context

## Summary

The gender-based support sections implementation provides:
✅ **Personalized Experience**: Tailored mental health support based on gender
✅ **Access Control**: Strict gender-based section restrictions
✅ **Professional Design**: Clear visual differentiation between sections
✅ **User-Friendly**: Clear messaging and smooth animations
✅ **Scalable**: Easy to add more experts or modify sections
✅ **Secure**: Frontend validation with backend-ready architecture

The system ensures that users only see and access support sections appropriate for their gender, providing a more personalized and comfortable mental health support experience.
