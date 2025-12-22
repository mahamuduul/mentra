import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
const Community = lazy(() => import('./pages/Community'));
const CommunityPost = lazy(() => import('./pages/CommunityPost'));
const LiveChat = lazy(() => import('./pages/LiveChat'));
const MentalHealthSupport = lazy(() => import('./pages/MentalHealthSupport'));
const MaleMentalHealthTools = lazy(() => import('./pages/MaleMentalHealthTools'));
const FemaleTools = lazy(() => import('./pages/FemaleTools'));
const MyBookings = lazy(() => import('./pages/MyBookings'));
const BookingDetails = lazy(() => import('./pages/BookingDetails'));

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <Router>
            <Suspense fallback={<PageLoader />}>
              <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={true}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
                toastClassName="bg-primary-800 text-white"
              />
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
                  
                  {/* Community Routes */}
                  <Route 
                    path="community" 
                    element={
                      <ProtectedRoute>
                        <Community />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="community/:postId" 
                    element={
                      <ProtectedRoute>
                        <CommunityPost />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="live-chat" 
                    element={
                      <ProtectedRoute>
                        <LiveChat />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="mental-health-support" 
                    element={
                      <ProtectedRoute>
                        <MentalHealthSupport />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="male-mental-health-tools" 
                    element={
                      <ProtectedRoute>
                        <MaleMentalHealthTools />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="female-tools" 
                    element={
                      <ProtectedRoute>
                        <FemaleTools />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="my-bookings" 
                    element={
                      <ProtectedRoute>
                        <MyBookings />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="booking/:bookingNumber" 
                    element={
                      <ProtectedRoute>
                        <BookingDetails />
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
