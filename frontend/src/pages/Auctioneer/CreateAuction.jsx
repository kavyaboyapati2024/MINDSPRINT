import React, { useState } from 'react';
import { ArrowLeft, DollarSign, Calendar, Upload, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CreateAuction = () => {
    const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    basePrice: '',
    startDateTime: '',
    endDateTime: '',
    file: null
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [filePreview, setFilePreview] = useState(null);
  const [modal, setModal] = useState({ show: false, title: '', message: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, file }));
      
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setFilePreview(null);
      }
      
      if (errors.file) {
        setErrors(prev => ({ ...prev, file: '' }));
      }
    }
  };

  const removeFile = () => {
    setFormData(prev => ({ ...prev, file: null }));
    setFilePreview(null);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!formData.basePrice || formData.basePrice <= 0) {
      newErrors.basePrice = 'Base price must be greater than 0';
    }
    if (!formData.startDateTime) {
      newErrors.startDateTime = 'Start date & time is required';
    }
    if (!formData.endDateTime) {
      newErrors.endDateTime = 'End date & time is required';
    }
    if (formData.startDateTime && formData.endDateTime) {
      if (new Date(formData.endDateTime) <= new Date(formData.startDateTime)) {
        newErrors.endDateTime = 'End date must be after start date';
      }
    }
    if (!formData.file) {
      newErrors.file = 'Image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('basePrice', formData.basePrice);
    formDataToSend.append('startDateTime', formData.startDateTime);
    formDataToSend.append('endDateTime', formData.endDateTime);
    formDataToSend.append('file', formData.file);
    // Attach auctionerId preferring sessionStorage (set at signin), fallback to localStorage
    let auctionerId = '';
    try {
      const auctioneerDataJson = sessionStorage.getItem('auctioneerData');
      if (auctioneerDataJson) {
        const auctioneerData = JSON.parse(auctioneerDataJson);
        if (auctioneerData && auctioneerData._id) auctionerId = auctioneerData._id;
      }
    } catch (err) {
      console.warn('Could not read auctioneerData from sessionStorage', err);
    }
    if (!auctionerId) {
      auctionerId = localStorage.getItem('auctioneerId') || localStorage.getItem('auctioneer_id') || '';
    }
    if (auctionerId) formDataToSend.append('auctionerId', auctionerId);

    try {
      const response = await fetch('http://localhost:9000/api/auctions/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formDataToSend
      });

      const data = await response.json();
      if (response.ok) {
        // Show success modal; navigation will happen when user clicks OK
        setModal({ show: true, title: 'Success', message: 'Auction created successfully!' });
      } else {
        setErrors({ general: data.message || 'Failed to create auction' });
      }
    } catch (error) {
      setErrors({ general: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/auctioneer-dashboard");
  };

  return (
    <>
    <div className="min-h-screen bg-slate-900 relative overflow-hidden">
      {/* Subtle Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-sky-500/8 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-indigo-500/8 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <div className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700/50 py-4 px-6 shadow-lg relative z-10">
        <div className="max-w-5xl mx-auto flex items-center">
          <button
            onClick={handleBack}
            className="flex items-center text-slate-400 hover:text-white transition-all duration-200 mr-6 group"
          >
            <div className="p-1.5 rounded-lg bg-slate-700/60 group-hover:bg-slate-700 transition-colors mr-2">
              <ArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
            </div>
            <span className="font-medium">Back</span>
          </button>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-200 via-sky-200 to-white bg-clip-text text-transparent">
            Create New Auction
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-10 relative z-10">
        {errors.general && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 shadow-lg">
            {errors.general}
          </div>
        )}

        <div className="space-y-10">
          {/* Basic Details */}
          <div className="bg-slate-800/60 backdrop-blur-sm p-8 rounded-xl border border-slate-700/50 shadow-xl">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
              <div className="w-1 h-6 bg-gradient-to-b from-sky-500 to-indigo-500 rounded-full mr-3"></div>
              Basic Details
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Auction Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all"
                  placeholder="Enter auction title"
                />
                {errors.title && <p className="text-red-400 text-sm mt-1.5">{errors.title}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Description <span className="text-red-400">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="5"
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 resize-none transition-all"
                  placeholder="Describe your item in detail..."
                />
                {errors.description && <p className="text-red-400 text-sm mt-1.5">{errors.description}</p>}
                <p className="text-slate-500 text-xs mt-1.5">{formData.description.length} characters</p>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-slate-800/60 backdrop-blur-sm p-8 rounded-xl border border-slate-700/50 shadow-xl">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
              <div className="w-1 h-6 bg-gradient-to-b from-sky-500 to-indigo-500 rounded-full mr-3"></div>
              Pricing
            </h2>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Starting Bid Price <span className="text-red-400">*</span>
              </label>
              <div className="relative max-w-xs">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-400">
                  <DollarSign size={20} />
                </span>
                <input
                  type="number"
                  name="basePrice"
                  value={formData.basePrice}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
              {errors.basePrice && <p className="text-red-400 text-sm mt-1.5">{errors.basePrice}</p>}
            </div>
          </div>

          {/* Schedule */}
          <div className="bg-slate-800/60 backdrop-blur-sm p-8 rounded-xl border border-slate-700/50 shadow-xl">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
              <div className="w-1 h-6 bg-gradient-to-b from-sky-500 to-indigo-500 rounded-full mr-3"></div>
              Schedule
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Start Date & Time <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-400 pointer-events-none" size={18} />
                  <input
                    type="datetime-local"
                    name="startDateTime"
                    value={formData.startDateTime}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all"
                  />
                </div>
                {errors.startDateTime && <p className="text-red-400 text-sm mt-1.5">{errors.startDateTime}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  End Date & Time <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-400 pointer-events-none" size={18} />
                  <input
                    type="datetime-local"
                    name="endDateTime"
                    value={formData.endDateTime}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all"
                  />
                </div>
                {errors.endDateTime && <p className="text-red-400 text-sm mt-1.5">{errors.endDateTime}</p>}
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-slate-800/60 backdrop-blur-sm p-8 rounded-xl border border-slate-700/50 shadow-xl">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
              <div className="w-1 h-6 bg-gradient-to-b from-sky-500 to-indigo-500 rounded-full mr-3"></div>
              Images
            </h2>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">
                Upload Image <span className="text-red-400">*</span>
              </label>
              
              {!filePreview ? (
                <div>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                    accept="image/*"
                  />
                  <label
                    htmlFor="file-upload"
                    className="inline-flex items-center px-5 py-2.5 bg-slate-700/60 border border-slate-700/50 rounded-lg text-slate-300 hover:bg-slate-700 hover:border-sky-500/50 cursor-pointer transition-all"
                  >
                    <Upload size={18} className="mr-2" />
                    Choose File
                  </label>
                  <span className="ml-3 text-sm text-slate-400">
                    {formData.file ? formData.file.name : 'No file chosen'}
                  </span>
                </div>
              ) : (
                <div className="relative inline-block group">
                  <img 
                    src={filePreview} 
                    alt="Preview" 
                    className="w-64 h-64 object-cover rounded-lg border border-slate-700/50 shadow-lg"
                  />
                  <button
                    type="button"
                    onClick={removeFile}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-all shadow-lg opacity-0 group-hover:opacity-100"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
              
              {errors.file && <p className="text-red-400 text-sm mt-2">{errors.file}</p>}
              <p className="text-slate-500 text-xs mt-2">Accepted formats: JPG, PNG (Max 10MB)</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-2">
            <button
              type="button"
              onClick={handleBack}
              className="px-8 py-3 border border-slate-700/50 rounded-lg text-slate-300 hover:bg-slate-700/30 hover:border-slate-600 transition-all"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="px-8 py-3 bg-gradient-to-r from-sky-500 to-indigo-600 text-white rounded-lg hover:from-sky-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-sky-500/20 hover:shadow-sky-500/30"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  Creating...
                </span>
              ) : (
                'Create Auction'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>

      {/* Success Modal */}
      {modal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setModal({ show: false, title: '', message: '' })}></div>
          <div className="relative bg-slate-900/95 p-6 rounded-xl w-full max-w-md mx-4 border border-slate-700/50 shadow-lg">
            <h3 className="text-lg font-semibold text-white mb-2">{modal.title}</h3>
            <p className="text-slate-300 mb-4">{modal.message}</p>
            <div className="flex justify-end">
              <button
                onClick={() => {
                  setModal({ show: false, title: '', message: '' });
                  navigate('/auctioneer-dashboard', { replace: true });
                }}
                className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateAuction;