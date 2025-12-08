import React, { useState, useEffect } from 'react';
import { User, Phone, Mail, MapPin, FileText, Building, Camera, Save, Edit2, Check, ArrowLeft, Award, Briefcase, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../services/authServices'; // Import your AuthService

const AuctioneerProfile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const [profileData, setProfileData] = useState({
    accountType: 'personal',
    email: '',
    fullName: '',
    phoneNumber: '',
    address: '',
    gst: '',
    organizationName: '',
    contactPersonName: '',
    contactPersonPhone: '',
    govtId: '',
    profileImage: null,
    yearsOfExperience: '',
    licenseNumber: '',
    specialization: 'Real Estate',
    bio: '',
  });

  // Load auctioneer data from session storage on mount
  useEffect(() => {
    const loadAuctioneerData = async () => {
      // Prefer sessionStorage key 'auctioneerData' to load profile
      let currentUser = null;
      try {
        const raw = sessionStorage.getItem('auctioneerData');
        if (raw) currentUser = JSON.parse(raw);
      } catch (err) {
        console.warn('Failed to parse sessionStorage.auctioneerData', err);
      }

      // Fallback to AuthService.getCurrentUser() if sessionStorage missing
      if (!currentUser && typeof AuthService.getCurrentUser === 'function') {
        try { currentUser = AuthService.getCurrentUser(); } catch (err) { /* ignore */ }
      }

      if (currentUser) {
        console.log('Loaded auctioneer data (from session/Auth):', currentUser);

        // If we have an id, attempt to fetch the canonical auctioneer record from backend
        const auctionerId = currentUser._id || currentUser.id || currentUser.userId;
        if (auctionerId) {
          try {
            const resp = await fetch(`http://localhost:9000/api/auctioners/${auctionerId}`);
            if (resp.ok) {
              const body = await resp.json();
              // backend returns { auctioner }
              const remote = body && body.auctioner ? body.auctioner : body;
              if (remote) {
                // merge remote values with currentUser (remote takes precedence)
                currentUser = { ...currentUser, ...remote };
                console.log('Merged auctioneer data from server:', currentUser);
              }
            } else {
              console.warn('Failed to fetch auctioneer details from server:', resp.statusText);
            }
          } catch (err) {
            console.warn('Error fetching auctioneer details:', err);
          }
        }

        setProfileData(prev => ({
          ...prev,
          accountType: currentUser.accountType || currentUser.type || 'personal',
          email: currentUser.email || '',
          fullName: currentUser.fullName || currentUser.name || currentUser.userName || '',
          phoneNumber: currentUser.phoneNumber || currentUser.phone || '',
          address: currentUser.address || currentUser.location || '',
          gst: currentUser.gst || currentUser.gstNumber || '',
          organizationName: currentUser.organizationName || currentUser.companyName || '',
          contactPersonName: currentUser.contactPersonName || currentUser.contactName || '',
          contactPersonPhone: currentUser.contactPersonPhone || currentUser.contactPhone || '',
          govtId: currentUser.govtId || currentUser.registrationNumber || currentUser.companyRegistrationNumber || '',
          profileImage: currentUser.profileImage || currentUser.avatar || null,
          yearsOfExperience: currentUser.yearsOfExperience || currentUser.experience || '',
          licenseNumber: currentUser.licenseNumber || currentUser.license || '',
          specialization: currentUser.specialization || currentUser.category || 'Real Estate',
          bio: currentUser.bio || currentUser.description || '',
          // Store user ID for future updates
          userId: currentUser.id || currentUser._id || currentUser.userId
        }));
      } else {
        console.log('No auctioneer data found, redirecting to signin');
        navigate('/signin/auctioneer');
      }
    };

    loadAuctioneerData();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData(prev => ({
          ...prev,
          profileImage: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    // Update session storage with new data
    const currentUser = AuthService.getCurrentUser ? AuthService.getCurrentUser() : null;
    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        accountType: profileData.accountType,
        fullName: profileData.fullName,
        name: profileData.fullName,
        phoneNumber: profileData.phoneNumber,
        phone: profileData.phoneNumber,
        address: profileData.address,
        gst: profileData.gst,
        organizationName: profileData.organizationName,
        contactPersonName: profileData.contactPersonName,
        contactPersonPhone: profileData.contactPersonPhone,
        govtId: profileData.govtId,
        profileImage: profileData.profileImage,
        yearsOfExperience: profileData.yearsOfExperience,
        licenseNumber: profileData.licenseNumber,
        specialization: profileData.specialization,
        bio: profileData.bio
      };
      
      // Save to session storage (and AuthService if available)
      try {
        sessionStorage.setItem('auctioneerData', JSON.stringify(updatedUser));
      } catch (err) {
        console.warn('Failed to write auctioneerData to sessionStorage', err);
      }
      if (typeof AuthService.setUserData === 'function') {
        try { AuthService.setUserData(updatedUser); } catch (err) { console.warn('AuthService.setUserData failed', err); }
      }
      console.log('Profile updated in session storage:', updatedUser);
      
      // Optional: Send update to backend API
      /*
      try {
        const response = await fetch('http://localhost:9000/api/auctioners/update-profile', {
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
    
    setSaveSuccess(true);
    setIsEditing(false);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleBackToDashboard = () => {
    navigate('/auctioneer-dashboard');
  };

  const isPersonal = profileData.accountType === 'personal';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation Bar */}
      <nav className="bg-slate-800/80 backdrop-blur-md border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left side - Title */}
            <div className="flex items-center">
              <h1 className="text-xl sm:text-2xl font-bold text-white">Profile Management</h1>
            </div>
            
            {/* Right side - Back button */}
            <button
              onClick={handleBackToDashboard}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-all duration-300 group"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium hidden sm:inline">Back to Dashboard</span>
              <span className="text-sm font-medium sm:hidden">Back</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          {saveSuccess && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl flex items-center justify-center">
              <Check className="text-green-400 mr-2" size={20} />
              <p className="text-green-400">Profile updated successfully!</p>
            </div>
          )}

          {/* Profile Header Card */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 sm:p-8 mb-6 shadow-xl">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {/* Profile Image */}
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center overflow-hidden border-4 border-slate-700">
                  {profileData.profileImage ? (
                    <img src={profileData.profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User size={48} className="text-white" />
                  )}
                </div>
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-sky-500 hover:bg-sky-600 p-2 rounded-full cursor-pointer transition-colors shadow-lg">
                    <Camera size={20} className="text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Header Info */}
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                  {isPersonal ? (profileData.fullName || 'Auctioneer Name') : (profileData.organizationName || 'Organization Name')}
                </h2>
                {!isPersonal && profileData.contactPersonName && (
                  <p className="text-lg text-slate-300 mb-2">Contact: {profileData.contactPersonName}</p>
                )}
                <p className="text-slate-400 mb-4">{profileData.email || 'email@example.com'}</p>
                <span className="inline-block px-4 py-2 bg-sky-500/20 border border-sky-500/30 rounded-full text-sky-400 text-sm">
                  {isPersonal ? 'Personal Account' : 'Organization'}
                </span>
              </div>

              {/* Edit/Save Button */}
              <button
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                className="bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2 shadow-lg shadow-sky-500/30"
              >
                {isEditing ? (
                  <>
                    <Save size={20} />
                    Save Changes
                  </>
                ) : (
                  <>
                    <Edit2 size={20} />
                    Edit Profile
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Profile Details Card */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-xl">
            <h3 className="text-2xl font-bold text-white mb-6">Profile Information</h3>

            <div className="space-y-6">
              {/* Account Type */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">Account Type</label>
                <div className="relative">
                  <Building className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 z-10" size={20} />
                  <select
                    name="accountType"
                    value={profileData.accountType}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full pl-12 pr-10 py-3 sm:py-4 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-300 appearance-none disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <option value="personal">Personal Account</option>
                    <option value="organization">Organization</option>
                  </select>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {isPersonal ? (
                <>
                  {/* Full Name */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-300">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                      <input
                        type="text"
                        name="fullName"
                        value={profileData.fullName}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        placeholder="Enter your full name"
                        className="w-full pl-12 pr-4 py-3 sm:py-4 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-300">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={profileData.phoneNumber}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        placeholder="Enter phone number"
                        className="w-full pl-12 pr-4 py-3 sm:py-4 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Organization Name */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-300">Organization Name</label>
                    <div className="relative">
                      <Building className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                      <input
                        type="text"
                        name="organizationName"
                        value={profileData.organizationName}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        placeholder="Enter organization name"
                        className="w-full pl-12 pr-4 py-3 sm:py-4 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Contact Person Name */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-300">Contact Person Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                      <input
                        type="text"
                        name="contactPersonName"
                        value={profileData.contactPersonName}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        placeholder="Enter contact person name"
                        className="w-full pl-12 pr-4 py-3 sm:py-4 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Contact Person Phone */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-300">Contact Person Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                      <input
                        type="tel"
                        name="contactPersonPhone"
                        value={profileData.contactPersonPhone}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        placeholder="Enter contact phone number"
                        className="w-full pl-12 pr-4 py-3 sm:py-4 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Government ID / Company Registration Number */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-300">Govt ID / Company Registration Number</label>
                    <div className="relative">
                      <FileText className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                      <input
                        type="text"
                        name="govtId"
                        value={profileData.govtId}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        placeholder="Enter registration number"
                        className="w-full pl-12 pr-4 py-3 sm:py-4 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Email (Read-only) */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                  <input
                    type="email"
                    value={profileData.email}
                    className="w-full pl-12 pr-4 py-3 sm:py-4 bg-slate-800/30 border border-slate-700/50 rounded-xl text-slate-400 cursor-not-allowed"
                    disabled
                    readOnly
                  />
                </div>
              </div>

              {/* GST Number */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">
                  GST Number <span className="text-slate-500 text-xs">(Optional)</span>
                </label>
                <div className="relative">
                  <FileText className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                  <input
                    type="text"
                    name="gst"
                    value={profileData.gst}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="Enter GST number"
                    className="w-full pl-12 pr-4 py-3 sm:py-4 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Address */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">Address</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-4 text-slate-400" size={20} />
                  <textarea
                    name="address"
                    value={profileData.address}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    rows="3"
                    placeholder="Enter address"
                    className="w-full pl-12 pr-4 py-3 sm:py-4 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-300 resize-none disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Professional Details Section */}
              <div className="pt-6 border-t border-slate-700">
                <h4 className="text-xl font-semibold text-white mb-4">Professional Details</h4>
                
                {/* License Number */}
                <div className="space-y-2 mb-6">
                  <label className="block text-sm font-medium text-slate-300">Auctioneer License Number</label>
                  <div className="relative">
                    <Award className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                    <input
                      type="text"
                      name="licenseNumber"
                      value={profileData.licenseNumber}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="e.g., AUC-2020-12345"
                      className="w-full pl-12 pr-4 py-3 sm:py-4 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Years of Experience */}
                <div className="space-y-2 mb-6">
                  <label className="block text-sm font-medium text-slate-300">Years of Experience</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                    <input
                      type="number"
                      name="yearsOfExperience"
                      value={profileData.yearsOfExperience}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      min="0"
                      placeholder="Years"
                      className="w-full pl-12 pr-4 py-3 sm:py-4 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Specialization */}
                <div className="space-y-2 mb-6">
                  <label className="block text-sm font-medium text-slate-300">Specialization</label>
                  <div className="relative">
                    <Briefcase className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 z-10" size={20} />
                    <select
                      name="specialization"
                      value={profileData.specialization}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full pl-12 pr-10 py-3 sm:py-4 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-300 appearance-none disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      <option value="Real Estate">Real Estate</option>
                      <option value="Automobiles">Automobiles</option>
                      <option value="Art & Antiques">Art & Antiques</option>
                      <option value="Jewelry">Jewelry</option>
                      <option value="Livestock">Livestock</option>
                      <option value="Industrial Equipment">Industrial Equipment</option>
                      <option value="General Merchandise">General Merchandise</option>
                      <option value="Other">Other</option>
                    </select>
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-300">Professional Bio</label>
                  <div className="relative">
                    <FileText className="absolute left-4 top-4 text-slate-400" size={20} />
                    <textarea
                      name="bio"
                      value={profileData.bio}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      rows="4"
                      placeholder="Brief description of your experience and expertise..."
                      className="w-full pl-12 pr-4 py-3 sm:py-4 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-300 resize-none disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctioneerProfile;