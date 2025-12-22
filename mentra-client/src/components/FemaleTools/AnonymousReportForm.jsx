import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaShieldAlt, FaPlus, FaTrash, FaCalendar, FaMapMarkerAlt, FaFileUpload, FaExclamationTriangle, FaLock } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { showSuccessToast, showErrorToast } from '../../utils/toast';

const AnonymousReportForm = () => {
  const { currentUser } = useAuth();
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    incidentType: '',
    dateTime: '',
    location: '',
    description: '',
    evidence: '',
    status: 'submitted'
  });

  const incidentTypes = [
    'Workplace Harassment',
    'Street Harassment',
    'Online Harassment/Cyberbullying',
    'Domestic Violence',
    'Sexual Harassment',
    'Stalking/Following',
    'Verbal Abuse',
    'Discrimination',
    'Other'
  ];

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const token = await currentUser.getIdToken();
      const response = await fetch('http://localhost:5000/api/tools/harassment-report', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const reports = await response.json();
        setReports(reports || []);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.incidentType || !formData.description) {
      showErrorToast('Please fill in incident type and description');
      return;
    }

    try {
      const token = await currentUser.getIdToken();
      const response = await fetch('http://localhost:5000/api/tools', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          toolType: 'harassment-report',
          data: {
            ...formData,
            reportNumber: `HR-${Date.now()}`,
            submittedAt: new Date().toISOString(),
            anonymous: true
          }
        }),
      });

      if (response.ok) {
        showSuccessToast('Report submitted anonymously and securely');
        setFormData({
          incidentType: '',
          dateTime: '',
          location: '',
          description: '',
          evidence: '',
          status: 'submitted'
        });
        setShowForm(false);
        fetchReports();
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Submit failed:', response.status, errorData);
        showErrorToast(errorData.error || errorData.message || 'Failed to submit report');
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      showErrorToast(error.message || 'Failed to submit report');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this report? This cannot be undone.')) return;

    try {
      const token = await currentUser.getIdToken();
      const response = await fetch(`http://localhost:5000/api/tools/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        showSuccessToast('Report deleted');
        fetchReports();
      }
    } catch (error) {
      console.error('Error deleting report:', error);
      showErrorToast('Failed to delete report');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl p-8 text-white mb-8 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <FaShieldAlt className="text-4xl" />
              <h1 className="text-3xl font-bold">Anonymous Report Form</h1>
            </div>
            <p className="text-pink-100 text-lg">
              Submit incidents safely and anonymously. Your identity is protected.
            </p>
            <div className="flex items-center gap-2 mt-3 text-pink-200 text-sm">
              <FaLock />
              <span>Encrypted & Confidential</span>
            </div>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-white text-pink-600 px-6 py-3 rounded-lg font-semibold hover:bg-pink-50 transition-all flex items-center gap-2 shadow-lg"
          >
            <FaPlus /> New Report
          </button>
        </div>
      </div>

      {/* New Report Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-6 border-2 border-pink-200"
        >
          <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
            <FaExclamationTriangle className="text-pink-600" />
            Submit Anonymous Report
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Incident Type * <span className="text-red-500">(Required)</span>
              </label>
              <select
                value={formData.incidentType}
                onChange={(e) => handleInputChange('incidentType', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="">Select type of incident</option>
                {incidentTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <FaCalendar className="text-pink-600" />
                  Date & Time <span className="text-gray-500 text-xs">(Optional)</span>
                </label>
                <input
                  type="datetime-local"
                  value={formData.dateTime}
                  onChange={(e) => handleInputChange('dateTime', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <FaMapMarkerAlt className="text-pink-600" />
                  Location <span className="text-gray-500 text-xs">(Optional - General area only)</span>
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="e.g., Downtown area, workplace, online"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description * <span className="text-red-500">(Required)</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe the incident in as much detail as you feel comfortable sharing. What happened? Who was involved? How did it make you feel?"
                rows="8"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">Your identity will not be shared</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <FaFileUpload className="text-pink-600" />
                Evidence/Witness Information <span className="text-gray-500 text-xs">(Optional)</span>
              </label>
              <textarea
                value={formData.evidence}
                onChange={(e) => handleInputChange('evidence', e.target.value)}
                placeholder="List any evidence you have (screenshots, messages, witnesses, etc.). Note: Actual files are not uploaded - this is for your records."
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Note: This is for documentation purposes. For legal cases, please contact authorities directly.
              </p>
            </div>

            <div className="bg-pink-50 border-l-4 border-pink-500 p-4 rounded">
              <p className="text-sm text-pink-800">
                <strong>Privacy Notice:</strong> Your report is stored securely and anonymously. We do not track your identity or IP address. This tool is for personal documentation and emotional support.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSubmit}
                className="flex-1 bg-pink-600 text-white py-4 rounded-lg font-semibold hover:bg-pink-700 transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <FaShieldAlt /> Submit Anonymous Report
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="px-6 py-4 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Reports List */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-800">Your Confidential Reports ({reports.length})</h3>
          <span className="text-sm text-gray-500 flex items-center gap-2">
            <FaLock className="text-pink-600" /> Encrypted Storage
          </span>
        </div>
        
        {reports.length === 0 ? (
          <div className="bg-gray-50 rounded-xl p-12 text-center">
            <FaShieldAlt className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">No reports submitted yet</p>
            <p className="text-gray-400 text-sm">Your reports will be stored anonymously and securely for your records</p>
          </div>
        ) : (
          reports.map((report) => (
            <motion.div
              key={report._id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-xl shadow-md p-6 border-l-4 border-pink-500 hover:shadow-lg transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <span className="bg-pink-100 text-pink-700 px-4 py-1.5 rounded-full text-sm font-semibold">
                      {report.data.incidentType}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <FaLock className="text-pink-500" />
                      Report #{report.data.reportNumber}
                    </span>
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                      {report.data.status}
                    </span>
                  </div>
                  
                  {report.data.dateTime && (
                    <p className="text-sm text-gray-600 flex items-center gap-2 mb-2">
                      <FaCalendar className="text-pink-500" />
                      Incident Date: {new Date(report.data.dateTime).toLocaleString()}
                    </p>
                  )}
                  
                  {report.data.location && (
                    <p className="text-sm text-gray-600 flex items-center gap-2 mb-3">
                      <FaMapMarkerAlt className="text-pink-500" />
                      Location: {report.data.location}
                    </p>
                  )}
                  
                  <div className="bg-gray-50 p-4 rounded-lg mb-3">
                    <p className="text-xs font-semibold text-gray-600 mb-2">Description:</p>
                    <p className="text-gray-700 whitespace-pre-wrap">{report.data.description}</p>
                  </div>
                  
                  {report.data.evidence && (
                    <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                      <p className="text-xs font-semibold text-yellow-800 mb-1 flex items-center gap-2">
                        <FaFileUpload />
                        Evidence/Witness Information:
                      </p>
                      <p className="text-sm text-yellow-900">{report.data.evidence}</p>
                    </div>
                  )}
                </div>
                
                <button
                  onClick={() => handleDelete(report._id)}
                  className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-all ml-4"
                  title="Delete report"
                >
                  <FaTrash />
                </button>
              </div>
              
              <div className="flex justify-between items-center text-xs text-gray-500 pt-4 border-t">
                <span>Submitted: {new Date(report.data.submittedAt).toLocaleString()}</span>
                <span className="flex items-center gap-1 text-pink-600">
                  <FaLock /> Anonymous & Encrypted
                </span>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Important Information */}
      <div className="mt-8 bg-red-50 border-2 border-red-200 rounded-xl p-6">
        <h4 className="font-bold text-red-800 mb-3 flex items-center gap-2 text-lg">
          <FaExclamationTriangle />
          Important Safety Information
        </h4>
        <ul className="text-sm text-red-700 space-y-2">
          <li className="flex items-start gap-2">
            <span className="font-bold mt-0.5">•</span>
            <span><strong>Immediate Danger:</strong> If you are in immediate danger, call emergency services (911 or your local emergency number)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold mt-0.5">•</span>
            <span><strong>Legal Action:</strong> For legal matters, contact law enforcement or legal aid services directly</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold mt-0.5">•</span>
            <span><strong>Documentation:</strong> This tool is for personal documentation and emotional support - reports are not sent to authorities</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold mt-0.5">•</span>
            <span><strong>Counseling Support:</strong> Consider speaking with a counselor through our secure chat feature for emotional support</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold mt-0.5">•</span>
            <span><strong>Privacy:</strong> Your reports are encrypted and stored securely. We do not share your information without your explicit permission</span>
          </li>
        </ul>
        
        <div className="mt-4 pt-4 border-t border-red-300">
          <p className="font-semibold text-red-800 mb-2">Emergency Hotlines:</p>
          <div className="grid md:grid-cols-2 gap-2 text-sm">
            <div className="bg-white p-3 rounded border border-red-200">
              <strong>National Domestic Violence Hotline:</strong>
              <br />1-800-799-7233 (24/7)
            </div>
            <div className="bg-white p-3 rounded border border-red-200">
              <strong>RAINN Sexual Assault Hotline:</strong>
              <br />1-800-656-4673 (24/7)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnonymousReportForm;
