# Firebase Admin SDK Setup Instructions

## Step 1: Generate Service Account Key

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `mentra-a0815`
3. Click the gear icon next to "Project Overview" → Project settings
4. Go to the "Service accounts" tab
5. Click "Generate new private key"
6. Download the JSON file

## Step 2: Configure Environment Variables

Copy the values from your downloaded JSON file and update the `.env` file:

```env
FIREBASE_PROJECT_ID=mentra-a0815
FIREBASE_PRIVATE_KEY_ID=your-private-key-id-here
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@mentra-a0815.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your-client-id-here
```

## Step 3: For Quick Testing (Alternative)

If you want to test immediately without service account setup, you can temporarily modify the Firebase Admin initialization in `index.js` to use the project ID only:

```javascript
admin.initializeApp({
  projectId: process.env.FIREBASE_PROJECT_ID || 'mentra-a0815'
});
```

This will work for basic token verification but may have limitations.

## Step 4: Security Notes

- Never commit the actual service account JSON file to version control
- Keep your private keys secure
- Use environment variables for all sensitive data
- Consider using Firebase Auth emulator for local development