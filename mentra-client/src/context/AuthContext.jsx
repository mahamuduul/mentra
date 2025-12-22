import { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChangedListener,
  signInWithGooglePopup,
  createAuthUserWithEmailAndPassword,
  signInAuthUserWithEmailAndPassword,
  signOutUser,
  updateUserProfile
} from '../config/firebase';
import { authToasts } from '../utils/toast';

const AuthContext = createContext();

// API base URL
const API_BASE_URL = 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null); // Firebase user
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [needsSurvey, setNeedsSurvey] = useState(false);

  useEffect(() => {
    // Listen to Firebase auth state changes
    const unsubscribe = onAuthStateChangedListener(async (firebaseUser) => {
      setIsLoading(true);
      
      if (firebaseUser) {
        setCurrentUser(firebaseUser); // Set Firebase user
        try {
          // Get or create user in backend
          const userData = await syncUserWithBackend(firebaseUser);
          setUser(userData);
          setIsAuthenticated(true);
          setNeedsSurvey(userData.needsSurvey !== false);
          
          // Save to localStorage
          localStorage.setItem('mentra_user', JSON.stringify(userData));
        } catch (error) {
          console.error('Error syncing user with backend:', error);
          // Fallback to Firebase user data if backend sync fails
          const fallbackUserData = {
            firebaseUID: firebaseUser.uid,
            name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
            email: firebaseUser.email,
            avatar: firebaseUser.photoURL,
            isEmailVerified: firebaseUser.emailVerified,
            needsSurvey: true, // Assume needs survey if backend sync fails
            profileCompleted: false,
          };
          setUser(fallbackUserData);
          setIsAuthenticated(true);
          setNeedsSurvey(true);
          localStorage.setItem('mentra_user', JSON.stringify(fallbackUserData));
          authToasts.authError('Using offline mode - some features may be limited');
        }
      } else {
        // User logged out
        setCurrentUser(null);
        setUser(null);
        setIsAuthenticated(false);
        setNeedsSurvey(false);
        localStorage.removeItem('mentra_user');
      }
      
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  // Sync Firebase user with backend (CREATE USER ON LOGIN)
  const syncUserWithBackend = async (firebaseUser = null) => {
    try {
      const userToSync = firebaseUser || currentUser;
      
      if (!userToSync) {
        throw new Error('No user to sync');
      }
      
      console.log('🔄 Syncing user with backend:', userToSync.email);
      
      const token = await userToSync.getIdToken();
      
      const response = await fetch(`${API_BASE_URL}/auth/firebase-sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          uid: userToSync.uid,
          email: userToSync.email,
          name: userToSync.displayName || userToSync.email.split('@')[0],
          avatar: userToSync.photoURL,
          emailVerified: userToSync.emailVerified,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to sync user with backend');
      }

      const data = await response.json();
      console.log('✅ User synced with backend:', data.data.user);
      console.log('📊 User profile data:', data.data.user.profile);
      console.log('👤 User gender:', data.data.user.gender || data.data.user.profile?.gender);
      
      // Update local state
      setUser(data.data.user);
      setNeedsSurvey(data.data.user.needsSurvey !== false);
      localStorage.setItem('mentra_user', JSON.stringify(data.data.user));
      
      return data.data.user;
    } catch (error) {
      console.error('❌ Backend sync error:', error);
      throw error;
    }
  };

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      // Sign in with Firebase
      const userCredential = await signInAuthUserWithEmailAndPassword(email, password);
      const firebaseUser = userCredential.user;
      
      // Firebase auth state listener will handle the rest
      authToasts.loginSuccess(firebaseUser.displayName || firebaseUser.email.split('@')[0]);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      let errorMessage = 'Login failed. Please try again.';
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email address.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password. Please try again.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address format.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed attempts. Please try again later.';
      }
      
      authToasts.loginError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      // Sign in with Google using Firebase
      const result = await signInWithGooglePopup();
      const firebaseUser = result.user;
      
      // Firebase auth state listener will handle the rest
      authToasts.loginSuccess(firebaseUser.displayName || firebaseUser.email.split('@')[0]);
      return { success: true };
    } catch (error) {
      console.error('Google login error:', error);
      let errorMessage = 'Google login failed. Please try again.';
      
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Google login was cancelled.';
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage = 'Popup was blocked. Please allow popups and try again.';
      }
      
      authToasts.loginError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name, email, password, gender) => {
    setIsLoading(true);
    try {
      // Create user with Firebase
      const userCredential = await createAuthUserWithEmailAndPassword(email, password);
      const firebaseUser = userCredential.user;
      
      // Update display name
      await updateUserProfile(firebaseUser, { displayName: name });
      
      // Sync with backend to include gender
      const token = await firebaseUser.getIdToken();
      await fetch(`${API_BASE_URL}/auth/firebase-sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: name,
          gender: gender,
          avatar: firebaseUser.photoURL,
          emailVerified: firebaseUser.emailVerified,
        }),
      });
      
      // Firebase auth state listener will handle the rest
      authToasts.registerSuccess(name);
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      let errorMessage = 'Registration failed. Please try again.';
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'An account with this email already exists.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Please choose a stronger password.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address format.';
      }
      
      authToasts.registerError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOutUser();
      authToasts.logoutSuccess();
    } catch (error) {
      console.error('Logout error:', error);
      authToasts.authError('Logout failed');
    }
  };

  // Complete user survey
  const completeSurvey = async (surveyData) => {
    try {
      if (!currentUser) {
        throw new Error('No authenticated user');
      }
      
      const token = await currentUser.getIdToken();
      
      const response = await fetch(`${API_BASE_URL}/user/survey`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(surveyData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit survey');
      }

      const data = await response.json();
      
      // Update user state
      const updatedUser = { ...user, ...data.data.user, needsSurvey: false };
      setUser(updatedUser);
      setNeedsSurvey(false);
      localStorage.setItem('mentra_user', JSON.stringify(updatedUser));
      
      authToasts.surveyCompleted();
      return { success: true };
    } catch (error) {
      console.error('Survey submission error:', error);
      authToasts.surveyError(error.message);
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    currentUser,
    isAuthenticated,
    isLoading,
    needsSurvey,
    login,
    loginWithGoogle,
    register,
    logout,
    completeSurvey,
    syncUserWithBackend,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
