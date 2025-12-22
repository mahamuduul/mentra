import { toast } from 'react-toastify';

// Toast configuration
const toastConfig = {
  position: "top-right",
  autoClose: 4000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "colored",
};

// Success notifications
export const showSuccessToast = (message) => {
  toast.success(message, toastConfig);
};

// Error notifications
export const showErrorToast = (message) => {
  toast.error(message, toastConfig);
};

// Info notifications
export const showInfoToast = (message) => {
  toast.info(message, toastConfig);
};

// Warning notifications
export const showWarningToast = (message) => {
  toast.warning(message, toastConfig);
};

// Authentication specific toasts
export const authToasts = {
  loginSuccess: (userName) => showSuccessToast(`Welcome back, ${userName}! 🎉`),
  registerSuccess: (userName) => showSuccessToast(`Account created successfully! Welcome to Mentra, ${userName}! 🌟`),
  logoutSuccess: () => showSuccessToast('Logged out successfully. Take care! 👋'),
  profileUpdated: () => showSuccessToast('Profile updated successfully! ✨'),
  surveyCompleted: () => showSuccessToast('Survey completed! Your profile has been created. 📋✅'),
  
  // Error toasts
  loginError: (error) => showErrorToast(`Login failed: ${error}`),
  registerError: (error) => showErrorToast(`Registration failed: ${error}`),
  authError: (error) => showErrorToast(`Authentication error: ${error}`),
  surveyError: (error) => showErrorToast(`Survey submission failed: ${error}`),
};

// Mental health feature toasts
export const featureToasts = {
  moodSaved: () => showSuccessToast('Mood entry saved successfully! 😊'),
  journalSaved: () => showSuccessToast('Journal entry saved! 📝'),
  journalUpdated: () => showSuccessToast('Journal entry updated! ✏️'),
  journalDeleted: () => showSuccessToast('Journal entry deleted! 🗑️'),
  quizCompleted: () => showSuccessToast('Mental health quiz completed! 🧠'),
  
  // Error toasts
  moodError: () => showErrorToast('Failed to save mood entry. Please try again.'),
  journalError: () => showErrorToast('Failed to save journal entry. Please try again.'),
  quizError: () => showErrorToast('Failed to submit quiz. Please try again.'),
};