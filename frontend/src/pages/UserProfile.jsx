import { useState, useEffect } from 'react';
import { 
  Edit3, Save, X, Camera, Mail, Phone, MapPin, 
  Calendar, Shield, Star, User, ArrowLeft
} from 'lucide-react';
import AuthService from '../services/authServices'; // Import AuthService
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  
  // User data state - now uses session storage via AuthService
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    website: '',
    company: '',
    joinDate: 'March 2024',
    verified: false,
    rating: 0
  });

  // Temporary edit data
  const [editData, setEditData] = useState({ ...userData });

  // Load user data on component mount
  useEffect(() => {
    // Get user data from session storage via AuthService
    const currentUser = AuthService.getCurrentUser();
    
    if (currentUser) {
      setUserData(prev => ({
        ...prev,
        name: currentUser.userName || currentUser.name || currentUser.fullName || '',
        email: currentUser.email || '',
        phone: currentUser.phone || currentUser.phoneNumber || '',
        location: currentUser.location || currentUser.address || '',
        bio: currentUser.bio || currentUser.about || '',
        website: currentUser.website || '',
        company: currentUser.company || '',
        verified: currentUser.verified || currentUser.isVerified || false,
        rating: currentUser.rating || 0,
        // Store the original user ID for updates
        userId: currentUser.id || currentUser._id || currentUser.userId
      }));
    } else {
      // No user logged in, redirect to signin
      console.log('No user found in session, redirecting to signin');
      navigate('/signin/user');
    }
  }, [navigate]);

  // Update editData when userData changes
  useEffect(() => {
    setEditData({ ...userData });
  }, [userData]);

  const handleEdit = () => {
    setEditData({ ...userData });
    setIsEditing(true);
  };

  const handleSave = async () => {
    // Update local state
    setUserData({ ...editData });
    setIsEditing(false);
    
    // Update session storage with new data
    const currentUser = AuthService.getCurrentUser();
    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        userName: editData.name,
        name: editData.name,
        email: editData.email,
        phone: editData.phone,
        location: editData.location,
        bio: editData.bio,
        website: editData.website,
        company: editData.company
      };
      
      // Save updated data to session storage
      AuthService.setUserData(updatedUser);
      
      // Optional: Send update to backend API
      // You would need to create an update profile endpoint
      /*
      try {
        const response = await fetch('http://localhost:9000/api/authUsers/update-profile', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(updatedUser)
        });
        
        if (response.ok) {
          console.log('Profile updated successfully on server');
        }
      } catch (error) {
        console.error('Error updating profile on server:', error);
      }
      */
    }
    
    console.log('Profile updated successfully');
  };

  const handleCancel = () => {
    setEditData({ ...userData });
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
      {/* Back Button */}
      <div className="absolute top-6 right-6 z-20">
        <button 
          onClick={handleBack}
          className="bg-slate-800/80 hover:bg-slate-700/80 backdrop-blur-sm text-white p-2 rounded-lg border border-sky-500/30 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      <div className="flex">
        
        {/* Left Sidebar */}
        <div className="w-80 min-h-screen bg-slate-900/95 backdrop-blur-xl border-r border-sky-500/30 p-6 flex flex-col">
          
          {/* Profile Picture Section */}
          <div className="text-center mb-6">
            <div className="relative inline-block mb-4">
              <div className="w-24 h-24 bg-gradient-to-br from-sky-400 to-sky-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {getInitials(isEditing ? editData.name : userData.name)}
              </div>
              <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-sky-500 hover:bg-sky-400 rounded-full flex items-center justify-center text-white transition-colors">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            
            {/* Display username below profile picture */}
            <div className="mb-3">
              <h2 className="text-xl font-semibold text-white">
                {(isEditing ? editData.name : userData.name) || 'User Name'}
              </h2>
            </div>
            
            <div className="flex items-center justify-center space-x-2 mb-3">
              {userData.verified && (
                <div className="flex items-center space-x-1 bg-green-500/20 px-2 py-1 rounded-full border border-green-500/30">
                  <Shield className="w-3 h-3 text-green-400" />
                  <span className="text-green-400 text-xs">Verified</span>
                </div>
              )}
              {userData.rating > 0 && (
                <div className="flex items-center space-x-1 bg-yellow-500/20 px-2 py-1 rounded-full border border-yellow-500/30">
                  <Star className="w-3 h-3 text-yellow-400" />
                  <span className="text-yellow-400 text-xs">{userData.rating}</span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Info */}
          <div className="space-y-3 text-sm mb-6">
            {userData.email && (
              <div className="flex items-center space-x-3 text-slate-300">
                <Mail className="w-4 h-4 text-sky-400" />
                <span className="truncate">{userData.email}</span>
              </div>
            )}
            {userData.phone && (
              <div className="flex items-center space-x-3 text-slate-300">
                <Phone className="w-4 h-4 text-sky-400" />
                <span>{userData.phone}</span>
              </div>
            )}
            {userData.location && (
              <div className="flex items-center space-x-3 text-slate-300">
                <MapPin className="w-4 h-4 text-sky-400" />
                <span>{userData.location}</span>
              </div>
            )}
          </div>

          {/* Additional Info Section */}
          <div className="flex-1 mb-6">
            <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/50">
              <h3 className="text-slate-300 font-medium mb-3 text-sm">Profile Completion</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Progress</span>
                  <span>{Math.round((Object.values(userData).filter(v => v && v !== '' && v !== false && v !== 0).length / Object.keys(userData).length) * 100)}%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-sky-400 to-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.round((Object.values(userData).filter(v => v && v !== '' && v !== false && v !== 0).length / Object.keys(userData).length) * 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            {/* Profile Tips */}
            <div className="mt-4 bg-slate-800/40 rounded-xl p-4 border border-slate-700/50">
              <h3 className="text-slate-300 font-medium mb-2 text-sm">Profile Tips</h3>
              <ul className="text-xs text-slate-400 space-y-1">
                <li>• Complete your profile for better visibility</li>
                <li>• Add a professional bio</li>
                <li>• Verify your email address</li>
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-auto">
            {!isEditing ? (
              <button
                onClick={handleEdit}
                className="w-full bg-sky-500 hover:bg-sky-400 text-white font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center space-x-2"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={handleSave}
                  className="w-full bg-green-500 hover:bg-green-400 text-white font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
                <button
                  onClick={handleCancel}
                  className="w-full bg-slate-600 hover:bg-slate-500 text-white font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center space-x-2"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Profile Information</h1>
              <p className="text-slate-400">
                {isEditing ? 'Edit your profile details below' : 'Manage your personal information'}
              </p>
            </div>

            {/* Profile Form */}
            <div className="bg-slate-900/90 backdrop-blur-xl rounded-2xl p-8 border border-sky-500/30">
              <div className="grid md:grid-cols-2 gap-6">
                
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full bg-slate-800 border border-slate-600 text-white rounded-lg px-4 py-3 focus:border-sky-400 focus:outline-none transition-colors"
                    />
                  ) : (
                    <div className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-lg px-4 py-3 min-h-[48px] flex items-center">
                      {userData.name || <span className="text-slate-500">Not provided</span>}
                    </div>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Email Address
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="Enter your email"
                      className="w-full bg-slate-800 border border-slate-600 text-white rounded-lg px-4 py-3 focus:border-sky-400 focus:outline-none transition-colors"
                    />
                  ) : (
                    <div className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-lg px-4 py-3 min-h-[48px] flex items-center">
                      {userData.email || <span className="text-slate-500">Not provided</span>}
                    </div>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="Enter your phone number"
                      className="w-full bg-slate-800 border border-slate-600 text-white rounded-lg px-4 py-3 focus:border-sky-400 focus:outline-none transition-colors"
                    />
                  ) : (
                    <div className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-lg px-4 py-3 min-h-[48px] flex items-center">
                      {userData.phone || <span className="text-slate-500">Not provided</span>}
                    </div>
                  )}
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Location
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="Enter your location"
                      className="w-full bg-slate-800 border border-slate-600 text-white rounded-lg px-4 py-3 focus:border-sky-400 focus:outline-none transition-colors"
                    />
                  ) : (
                    <div className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-lg px-4 py-3 min-h-[48px] flex items-center">
                      {userData.location || <span className="text-slate-500">Not provided</span>}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Bio Section */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Bio
                </label>
                {isEditing ? (
                  <textarea
                    value={editData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    placeholder="Tell us about yourself..."
                    rows={4}
                    className="w-full bg-slate-800 border border-slate-600 text-white rounded-lg px-4 py-3 focus:border-sky-400 focus:outline-none transition-colors resize-none"
                  />
                ) : (
                  <div className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-lg px-4 py-3 min-h-[100px] flex items-start">
                    {userData.bio || <span className="text-slate-500">Tell us about yourself...</span>}
                  </div>
                )}
              </div>

              {/* Save/Cancel Buttons for larger screens */}
              {isEditing && (
                <div className="mt-8 flex justify-end space-x-4">
                  <button
                    onClick={handleCancel}
                    className="px-6 py-2 bg-slate-600 hover:bg-slate-500 text-white font-medium rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-6 py-2 bg-sky-500 hover:bg-sky-400 text-white font-medium rounded-lg transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;