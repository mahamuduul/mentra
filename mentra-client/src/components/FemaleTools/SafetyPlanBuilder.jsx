import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaShieldAlt, FaUserFriends, FaMapMarkerAlt, FaPhoneAlt, FaExclamationTriangle, FaPlus, FaTrash, FaEdit, FaStar } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { showSuccessToast, showErrorToast } from '../../utils/toast';

const SafetyPlanBuilder = () => {
  const { currentUser } = useAuth();
  const [safetyPlan, setSafetyPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  
  const [contacts, setContacts] = useState([]);
  const [safePlaces, setSafePlaces] = useState([]);
  const [emergencySteps, setEmergencySteps] = useState([]);
  
  const [newContact, setNewContact] = useState({ name: '', phone: '', relationship: '', trusted: true });
  const [newPlace, setNewPlace] = useState({ name: '', address: '', howToGet: '' });
  const [newStep, setNewStep] = useState('');

  useEffect(() => {
    fetchSafetyPlan();
  }, []);

  const fetchSafetyPlan = async () => {
    try {
      const token = await currentUser.getIdToken();
      const response = await fetch('http://localhost:5000/api/tools/safety-plan', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const plans = await response.json();
        if (plans && plans.length > 0) {
          const plan = plans[0];
          setSafetyPlan(plan);
          setContacts(plan.data.contacts || []);
          setSafePlaces(plan.data.safePlaces || []);
          setEmergencySteps(plan.data.emergencySteps || []);
        } else {
          setEditMode(true);
        }
      }
    } catch (error) {
      console.error('Error fetching safety plan:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (contacts.length === 0 || safePlaces.length === 0 || emergencySteps.length === 0) {
      showErrorToast('Please add at least one contact, safe place, and emergency step');
      return;
    }

    try {
      const planData = {
        contacts,
        safePlaces,
        emergencySteps,
        lastUpdated: new Date().toISOString()
      };

      const url = safetyPlan 
        ? `http://localhost:5000/api/tools/${safetyPlan._id}`
        : 'http://localhost:5000/api/tools';
      
      const method = safetyPlan ? 'PUT' : 'POST';
      const token = await currentUser.getIdToken();
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(
          safetyPlan 
            ? { data: planData }
            : { toolType: 'safety-plan', data: planData }
        ),
      });

      if (response.ok) {
        showSuccessToast('Safety plan saved successfully');
        setEditMode(false);
        fetchSafetyPlan();
      } else {
        showErrorToast('Failed to save safety plan');
      }
    } catch (error) {
      console.error('Error saving safety plan:', error);
      showErrorToast('Failed to save safety plan');
    }
  };

  const addContact = () => {
    if (!newContact.name || !newContact.phone) {
      showErrorToast('Please enter name and phone number');
      return;
    }
    setContacts([...contacts, { ...newContact, id: Date.now() }]);
    setNewContact({ name: '', phone: '', relationship: '', trusted: true });
  };

  const removeContact = (id) => {
    setContacts(contacts.filter(c => c.id !== id));
  };

  const addPlace = () => {
    if (!newPlace.name) {
      showErrorToast('Please enter place name');
      return;
    }
    setSafePlaces([...safePlaces, { ...newPlace, id: Date.now() }]);
    setNewPlace({ name: '', address: '', howToGet: '' });
  };

  const removePlace = (id) => {
    setSafePlaces(safePlaces.filter(p => p.id !== id));
  };

  const addStep = () => {
    if (!newStep.trim()) {
      showErrorToast('Please enter an emergency step');
      return;
    }
    setEmergencySteps([...emergencySteps, { text: newStep, id: Date.now() }]);
    setNewStep('');
  };

  const removeStep = (id) => {
    setEmergencySteps(emergencySteps.filter(s => s.id !== id));
  };

  const makeEmergencyCall = (phone) => {
    window.location.href = `tel:${phone}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white mb-8 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <FaShieldAlt className="text-4xl" />
              <h1 className="text-3xl font-bold">Personal Safety Plan</h1>
            </div>
            <p className="text-purple-100 text-lg">
              Create your customized safety plan with trusted contacts, safe places, and emergency steps
            </p>
          </div>
          {!editMode && safetyPlan && (
            <button
              onClick={() => setEditMode(true)}
              className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-all flex items-center gap-2 shadow-lg"
            >
              <FaEdit /> Edit Plan
            </button>
          )}
        </div>
      </div>

      {editMode ? (
        <div className="space-y-6">
          {/* Trusted Contacts Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
              <FaUserFriends className="text-purple-600" />
              Trusted Contacts ({contacts.length})
            </h3>
            
            <div className="bg-purple-50 p-4 rounded-lg mb-4">
              <div className="grid md:grid-cols-3 gap-3 mb-3">
                <input
                  type="text"
                  placeholder="Name *"
                  value={newContact.name}
                  onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
                <input
                  type="tel"
                  placeholder="Phone Number *"
                  value={newContact.phone}
                  onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
                <input
                  type="text"
                  placeholder="Relationship (optional)"
                  value={newContact.relationship}
                  onChange={(e) => setNewContact({...newContact, relationship: e.target.value})}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <button
                onClick={addContact}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-all flex items-center gap-2"
              >
                <FaPlus /> Add Contact
              </button>
            </div>

            <div className="space-y-3">
              {contacts.map(contact => (
                <div key={contact.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border-2 border-purple-200">
                  <div>
                    <div className="flex items-center gap-2">
                      <FaStar className="text-yellow-500" />
                      <p className="font-semibold text-gray-800">{contact.name}</p>
                    </div>
                    <p className="text-purple-600 font-medium">{contact.phone}</p>
                    {contact.relationship && (
                      <p className="text-sm text-gray-600">{contact.relationship}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => makeEmergencyCall(contact.phone)}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all flex items-center gap-2"
                    >
                      <FaPhoneAlt /> Call
                    </button>
                    <button
                      onClick={() => removeContact(contact.id)}
                      className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
              {contacts.length === 0 && (
                <p className="text-gray-500 text-center py-4">No contacts added yet</p>
              )}
            </div>
          </div>

          {/* Safe Places Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
              <FaMapMarkerAlt className="text-pink-600" />
              Safe Places ({safePlaces.length})
            </h3>
            
            <div className="bg-pink-50 p-4 rounded-lg mb-4">
              <div className="space-y-3 mb-3">
                <input
                  type="text"
                  placeholder="Place Name (e.g., Friend's house, Library) *"
                  value={newPlace.name}
                  onChange={(e) => setNewPlace({...newPlace, name: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                />
                <input
                  type="text"
                  placeholder="Address or Location (optional)"
                  value={newPlace.address}
                  onChange={(e) => setNewPlace({...newPlace, address: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                />
                <textarea
                  placeholder="How to get there / Special notes (optional)"
                  value={newPlace.howToGet}
                  onChange={(e) => setNewPlace({...newPlace, howToGet: e.target.value})}
                  rows="2"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                />
              </div>
              <button
                onClick={addPlace}
                className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-all flex items-center gap-2"
              >
                <FaPlus /> Add Place
              </button>
            </div>

            <div className="space-y-3">
              {safePlaces.map(place => (
                <div key={place.id} className="bg-gray-50 p-4 rounded-lg border-2 border-pink-200">
                  <div className="flex justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <FaMapMarkerAlt className="text-pink-600" />
                        <p className="font-semibold text-gray-800">{place.name}</p>
                      </div>
                      {place.address && <p className="text-sm text-gray-600 ml-6">📍 {place.address}</p>}
                      {place.howToGet && <p className="text-sm text-gray-600 ml-6 mt-1">ℹ️ {place.howToGet}</p>}
                    </div>
                    <button
                      onClick={() => removePlace(place.id)}
                      className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg h-fit"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
              {safePlaces.length === 0 && (
                <p className="text-gray-500 text-center py-4">No safe places added yet</p>
              )}
            </div>
          </div>

          {/* Emergency Steps Checklist */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
              <FaExclamationTriangle className="text-orange-600" />
              Emergency Action Steps ({emergencySteps.length})
            </h3>
            
            <div className="bg-orange-50 p-4 rounded-lg mb-4">
              <div className="flex gap-3 mb-3">
                <input
                  type="text"
                  placeholder="Enter an emergency step (e.g., Grab my phone and wallet)"
                  value={newStep}
                  onChange={(e) => setNewStep(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addStep()}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
                <button
                  onClick={addStep}
                  className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-all flex items-center gap-2"
                >
                  <FaPlus /> Add Step
                </button>
              </div>
              <p className="text-xs text-gray-600">Add step-by-step actions to take in an emergency situation</p>
            </div>

            <div className="space-y-2">
              {emergencySteps.map((step, index) => (
                <div key={step.id} className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg border-2 border-orange-200">
                  <span className="bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    {index + 1}
                  </span>
                  <p className="flex-1 text-gray-800">{step.text}</p>
                  <button
                    onClick={() => removeStep(step.id)}
                    className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
              {emergencySteps.length === 0 && (
                <p className="text-gray-500 text-center py-4">No emergency steps added yet</p>
              )}
            </div>
          </div>

          {/* Save Button */}
          <div className="flex gap-4">
            <button
              onClick={handleSave}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg text-lg"
            >
              Save Safety Plan
            </button>
            {safetyPlan && (
              <button
                onClick={() => {
                  setEditMode(false);
                  fetchSafetyPlan();
                }}
                className="px-8 py-4 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Quick Access Buttons */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4 text-gray-800">🚨 Quick Access Emergency Buttons</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {contacts.slice(0, 3).map(contact => (
                <button
                  key={contact.id}
                  onClick={() => makeEmergencyCall(contact.phone)}
                  className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 rounded-lg hover:from-red-600 hover:to-red-700 transition-all shadow-lg flex items-center justify-between group"
                >
                  <div className="text-left">
                    <p className="font-bold">{contact.name}</p>
                    <p className="text-sm text-red-100">{contact.phone}</p>
                  </div>
                  <FaPhoneAlt className="text-2xl group-hover:scale-110 transition-transform" />
                </button>
              ))}
              <button
                onClick={() => window.location.href = 'tel:911'}
                className="bg-gradient-to-r from-red-700 to-red-800 text-white p-4 rounded-lg hover:from-red-800 hover:to-red-900 transition-all shadow-lg flex items-center justify-between group"
              >
                <div className="text-left">
                  <p className="font-bold">Emergency 911</p>
                  <p className="text-sm text-red-200">Call immediately</p>
                </div>
                <FaPhoneAlt className="text-2xl group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>

          {/* View Safety Plan */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4 text-purple-800 flex items-center gap-2">
                <FaUserFriends />
                Trusted Contacts ({contacts.length})
              </h3>
              <div className="space-y-3">
                {contacts.map(contact => (
                  <div key={contact.id} className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-gray-800">{contact.name}</p>
                        <p className="text-purple-600 font-medium">{contact.phone}</p>
                        {contact.relationship && (
                          <p className="text-sm text-gray-600">{contact.relationship}</p>
                        )}
                      </div>
                      <button
                        onClick={() => makeEmergencyCall(contact.phone)}
                        className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600"
                      >
                        <FaPhoneAlt />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4 text-pink-800 flex items-center gap-2">
                <FaMapMarkerAlt />
                Safe Places ({safePlaces.length})
              </h3>
              <div className="space-y-3">
                {safePlaces.map(place => (
                  <div key={place.id} className="bg-pink-50 p-4 rounded-lg border-l-4 border-pink-500">
                    <p className="font-bold text-gray-800">{place.name}</p>
                    {place.address && <p className="text-sm text-gray-600">📍 {place.address}</p>}
                    {place.howToGet && <p className="text-sm text-gray-600 mt-1">ℹ️ {place.howToGet}</p>}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4 text-orange-800 flex items-center gap-2">
              <FaExclamationTriangle />
              Emergency Action Steps Checklist
            </h3>
            <div className="space-y-2">
              {emergencySteps.map((step, index) => (
                <div key={step.id} className="flex items-center gap-3 bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500">
                  <span className="bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    {index + 1}
                  </span>
                  <p className="flex-1 text-gray-800">{step.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg text-center text-sm text-gray-600">
            Last updated: {new Date(safetyPlan?.data?.lastUpdated).toLocaleString()}
          </div>
        </div>
      )}
    </div>
  );
};

export default SafetyPlanBuilder;
