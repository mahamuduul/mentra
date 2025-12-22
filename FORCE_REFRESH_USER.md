# Force Refresh User Data

Your user object in localStorage is cached and doesn't have the latest profile data.

## Quick Fix - Run in Browser Console:

```javascript
// Clear cached user data
localStorage.removeItem('mentra_user');

// Reload the page
window.location.reload();
```

This will force the app to fetch fresh data from the backend with your complete profile including gender.

After doing this, the gender-based filtering will work correctly!
