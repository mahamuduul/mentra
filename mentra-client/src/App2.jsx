import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Loading Component
const PageLoader = () => (
  <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 flex items-center justify-center">
    <div className="text-center">
      <div className="inline-block h-16 w-16 animate-spin rounded-full border-4 border-solid border-white border-r-transparent"></div>
      <p className="mt-4 text-white font-medium">Loading...</p>
    </div>
  </div>
);

// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const SurveyPage = lazy(() => import('./pages/SurveyPage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Profile = lazy(() => import('./pages/Profile'));
const MoodTracker = lazy(() => import('./pages/MoodTracker'));
const Journal = lazy(() => import('./pages/Journal'));
const Resources = lazy(() => import('./pages/Resources'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <Router>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Authentication Routes */}
                <Route 
                  path="/login" 
                  element={
                    <ProtectedRoute requireAuth={false}>
                      <Login />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/register" 
                  element={
                    <ProtectedRoute requireAuth={false}>
                      <Register />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Survey Route */}
                <Route 
                  path="/survey" 
                  element={
                    <ProtectedRoute>
                      <SurveyPage />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Dashboard Route */}
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Profile Route */}
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Main App Routes with Layout */}
                <Route path="/" element={<MainLayout />}>
                  <Route index element={<Home />} />
                  
                  {/* Mental Health Tools */}
                  <Route 
                    path="mood-tracker" 
                    element={
                      <ProtectedRoute>
                        <MoodTracker />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="journal" 
                    element={
                      <ProtectedRoute>
                        <Journal />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Info Pages */}
                  <Route path="resources" element={<Resources />} />
                  <Route path="about" element={<About />} />
                  <Route path="contact" element={<Contact />} />
                </Route>

                {/* 404 Redirect */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </Router>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
