# Gender-Based Authentication System Documentation

## Overview
This document describes the implementation of the gender-based registration and authentication system for the Mentra Mental Health Support Platform.

## Features Implemented

### 1. User Registration with Gender Selection
- Registration form now includes a **Gender** field with two options: **Male** and **Female**
- Gender selection is required (validation added)
- Visual radio button cards for better UX
- Gender data is stored in the user profile

### 2. Database Schema
The User model has been updated to include:
```javascript
gender: {
  type: String,
  enum: ['Male', 'Female'],
  required: true
}
```

### 3. Backend Integration
- **Firebase-Sync Endpoint** (`/api/auth/firebase-sync`) now accepts gender parameter
- Gender is stored during user registration
- Existing users (Google sign-in) default to 'Male' if gender not provided
- Gender can be updated for existing users

### 4. Frontend Context
- Gender is included in the user object throughout the application
- Available via `useAuth()` hook: `const { user } = useAuth();`
- User object includes: `user.gender` (either 'Male' or 'Female')

### 5. Gender-Based Access Control Component
A reusable `GenderProtectedSection` component has been created for controlling access to gender-specific features.

## Usage Guide

### Accessing User Gender
```jsx
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { user } = useAuth();
  
  // Check user's gender
  if (user?.gender === 'Male') {
    // Male-specific logic
  } else if (user?.gender === 'Female') {
    // Female-specific logic
  }
}
```

### Using Gender-Protected Sections

#### Example 1: Male-Only Section
```jsx
import GenderProtectedSection from '../components/GenderProtectedSection';

function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      
      <GenderProtectedSection allowedGenders={['Male']}>
        <MaleSpecificContent />
      </GenderProtectedSection>
    </div>
  );
}
```

#### Example 2: Female-Only Section
```jsx
<GenderProtectedSection 
  allowedGenders={['Female']}
  fallbackMessage="This resource is specifically designed for female users."
>
  <FemaleHealthResources />
</GenderProtectedSection>
```

#### Example 3: Hide Section Without Fallback
```jsx
<GenderProtectedSection 
  allowedGenders={['Male']} 
  showFallback={false}
>
  <MaleOnlyFeature />
</GenderProtectedSection>
```

#### Example 4: Multiple Genders (for future expansion)
```jsx
<GenderProtectedSection allowedGenders={['Male', 'Female']}>
  <UniversalContent />
</GenderProtectedSection>
```

### Custom Gender-Based Rendering
```jsx
import { useAuth } from '../context/AuthContext';

function CustomComponent() {
  const { user } = useAuth();
  
  return (
    <div>
      {user?.gender === 'Male' ? (
        <MaleContent />
      ) : user?.gender === 'Female' ? (
        <FemaleContent />
      ) : null}
    </div>
  );
}
```

## Implementation Examples

### Example 1: Gender-Specific Resources Page
```jsx
import { useAuth } from '../context/AuthContext';
import GenderProtectedSection from '../components/GenderProtectedSection';

function Resources() {
  const { user } = useAuth();
  
  return (
    <div className="container mx-auto p-6">
      <h1>Mental Health Resources</h1>
      
      {/* Universal resources for all */}
      <section className="mb-8">
        <h2>General Resources</h2>
        <GeneralResources />
      </section>
      
      {/* Male-specific resources */}
      <GenderProtectedSection allowedGenders={['Male']}>
        <section className="mb-8">
          <h2>Resources for Men</h2>
          <MaleResources />
        </section>
      </GenderProtectedSection>
      
      {/* Female-specific resources */}
      <GenderProtectedSection allowedGenders={['Female']}>
        <section className="mb-8">
          <h2>Resources for Women</h2>
          <FemaleResources />
        </section>
      </GenderProtectedSection>
    </div>
  );
}
```

### Example 2: Conditional Navigation Items
```jsx
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

function Navbar() {
  const { user } = useAuth();
  
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/resources">Resources</Link>
      
      {user?.gender === 'Male' && (
        <Link to="/mens-health">Men's Health</Link>
      )}
      
      {user?.gender === 'Female' && (
        <Link to="/womens-health">Women's Health</Link>
      )}
    </nav>
  );
}
```

### Example 3: Dynamic Content Based on Gender
```jsx
import { useAuth } from '../context/AuthContext';

function WelcomeMessage() {
  const { user } = useAuth();
  
  const genderSpecificGreeting = {
    'Male': 'Welcome, Sir!',
    'Female': 'Welcome, Ma\'am!'
  };
  
  const genderSpecificTips = {
    'Male': 'Men often benefit from physical activity to manage stress.',
    'Female': 'Self-care and emotional expression are powerful tools.'
  };
  
  return (
    <div>
      <h2>{genderSpecificGreeting[user?.gender] || 'Welcome!'}</h2>
      <p>{genderSpecificTips[user?.gender]}</p>
    </div>
  );
}
```

## API Reference

### Backend Endpoints

#### POST `/api/auth/firebase-sync`
Syncs Firebase user with backend database.

**Request Body:**
```json
{
  "uid": "firebase-user-id",
  "email": "user@example.com",
  "name": "John Doe",
  "gender": "Male",
  "avatar": "https://...",
  "emailVerified": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "User synced successfully",
  "data": {
    "user": {
      "firebaseUID": "firebase-user-id",
      "name": "John Doe",
      "email": "user@example.com",
      "gender": "Male",
      "avatar": "https://...",
      "isEmailVerified": true,
      "needsSurvey": true,
      // ... other fields
    }
  }
}
```

### Frontend Context API

#### useAuth Hook
```javascript
const {
  user,              // User object with gender field
  isAuthenticated,   // Boolean
  isLoading,         // Boolean
  register,          // (name, email, password, gender) => Promise
  login,             // (email, password) => Promise
  loginWithGoogle,   // () => Promise
  logout            // () => Promise
} = useAuth();
```

#### User Object Structure
```javascript
{
  firebaseUID: string,
  name: string,
  email: string,
  gender: 'Male' | 'Female',
  avatar: string | null,
  isEmailVerified: boolean,
  needsSurvey: boolean,
  profileCompleted: boolean,
  // ... other fields
}
```

## Design Changes

### Background Color Removal
Both Login and Register pages have been updated:
- ✅ Removed gradient background (`bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900`)
- ✅ Removed decorative background elements (blur circles)
- ✅ Updated text colors to work with light/dark theme
- ✅ Updated form card to use solid background
- ✅ Maintained dark mode support with Tailwind's `dark:` classes

The pages now adapt to the application's theme system and appear cleaner.

## Security Considerations

1. **Client-Side Protection Only**: The current implementation provides UI-level protection. For production:
   - Add server-side validation in backend routes
   - Verify gender in API endpoints before serving restricted data

2. **Gender Privacy**: Consider adding settings to allow users to:
   - Update their gender selection
   - Hide gender from certain features

3. **Future Expansion**: The system can be extended to support:
   - Non-binary options
   - Prefer not to say option
   - Custom gender identity fields

## Testing Checklist

- [x] Gender field appears in registration form
- [x] Gender validation works (required field)
- [x] Gender is saved to database on registration
- [x] Gender is available in user context after login
- [x] GenderProtectedSection component works correctly
- [x] Background colors removed from auth pages
- [x] Dark mode works properly on auth pages
- [ ] Test with male account - verify male-only sections visible
- [ ] Test with female account - verify female-only sections visible
- [ ] Test existing Google users - verify default gender assignment

## Files Modified

### Backend
- `mentra-client/backend/models/User.js` - Added gender field to schema
- `mentra-client/backend/routes/auth.js` - Updated sync endpoint to handle gender

### Frontend
- `mentra-client/src/pages/Register.jsx` - Added gender selection, removed background
- `mentra-client/src/pages/Login.jsx` - Removed background colors
- `mentra-client/src/context/AuthContext.jsx` - Updated register function to pass gender
- `mentra-client/src/components/GenderProtectedSection.jsx` - New component created

## Next Steps

1. **Implement Gender-Specific Features**: Use the GenderProtectedSection component in actual pages
2. **Add Gender Update**: Allow users to update their gender in profile settings
3. **Create Gender-Specific Content**: Develop male and female-specific mental health resources
4. **Backend Validation**: Add server-side gender verification in protected routes
5. **Analytics**: Track which gender-specific features are most used
6. **Testing**: Thoroughly test with different user types

## Support

For questions or issues related to the gender-based authentication system, please contact the development team or refer to the main documentation.
