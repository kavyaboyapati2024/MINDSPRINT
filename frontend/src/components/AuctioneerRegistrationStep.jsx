import React from 'react';
import { ArrowLeft, User, Phone, Mail, Lock, Eye, EyeOff, MapPin, FileText, Building } from 'lucide-react';

const AuctioneerRegistrationStep = ({ 
  formData, 
  errors, 
  isLoading, 
  showPassword, 
  onInputChange, 
  onTogglePassword, 
  onRegister, 
  onBack 
}) => {
  const isPersonal = formData.accountType === 'personal';

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center text-slate-400 hover:text-white transition-colors duration-200"
      >
        <ArrowLeft size={20} className="mr-2" />
        Back
      </button>

      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          Complete Registration
        </h2>
        <p className="text-slate-400 text-sm sm:text-base">
          Provide your details to finish setting up
        </p>
      </div>

      {/* Account Type Dropdown */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Account Type
        </label>
        <div className="relative">
          <Building className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 z-10" size={20} />
          <select
            name="accountType"
            value={formData.accountType}
            onChange={onInputChange}
            className="w-full pl-12 pr-10 py-3 sm:py-4 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-300 appearance-none cursor-pointer"
            disabled={isLoading}
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

      {/* Email (Auto-filled and read-only) */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Email Address
        </label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="email"
            value={formData.email}
            className="w-full pl-12 pr-4 py-3 sm:py-4 bg-slate-800/30 border border-slate-700/50 rounded-xl text-slate-400 cursor-not-allowed"
            disabled
            readOnly
          />
        </div>
      </div>

      {/* Personal Account Fields */}
      {isPersonal && (
        <>
          {/* Full Name */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={onInputChange}
                className="w-full pl-12 pr-4 py-3 sm:py-4 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-300"
                placeholder="John Doe"
                disabled={isLoading}
              />
            </div>
            {errors.fullName && (
              <p className="text-red-400 text-sm mt-1">{errors.fullName}</p>
            )}
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={onInputChange}
                className="w-full pl-12 pr-4 py-3 sm:py-4 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-300"
                placeholder="+1 (555) 000-0000"
                disabled={isLoading}
              />
            </div>
            {errors.phoneNumber && (
              <p className="text-red-400 text-sm mt-1">{errors.phoneNumber}</p>
            )}
          </div>
        </>
      )}

      {/* Organization Fields */}
      {!isPersonal && (
        <>
          {/* Organization Name */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Organization Name
            </label>
            <div className="relative">
              <Building className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                name="organizationName"
                value={formData.organizationName}
                onChange={onInputChange}
                className="w-full pl-12 pr-4 py-3 sm:py-4 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-300"
                placeholder="Acme Corporation"
                disabled={isLoading}
              />
            </div>
            {errors.organizationName && (
              <p className="text-red-400 text-sm mt-1">{errors.organizationName}</p>
            )}
          </div>

          {/* Contact Person Name */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Contact Person Name
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                name="contactPersonName"
                value={formData.contactPersonName}
                onChange={onInputChange}
                className="w-full pl-12 pr-4 py-3 sm:py-4 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-300"
                placeholder="John Doe"
                disabled={isLoading}
              />
            </div>
            {errors.contactPersonName && (
              <p className="text-red-400 text-sm mt-1">{errors.contactPersonName}</p>
            )}
          </div>

          {/* Contact Person Phone */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Contact Person Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="tel"
                name="contactPersonPhone"
                value={formData.contactPersonPhone}
                onChange={onInputChange}
                className="w-full pl-12 pr-4 py-3 sm:py-4 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-300"
                placeholder="+1 (555) 000-0000"
                disabled={isLoading}
              />
            </div>
            {errors.contactPersonPhone && (
              <p className="text-red-400 text-sm mt-1">{errors.contactPersonPhone}</p>
            )}
          </div>

          {/* Government ID / Company Registration Number */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Govt ID / Company Registration Number
            </label>
            <div className="relative">
              <FileText className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                name="govtId"
                value={formData.govtId}
                onChange={onInputChange}
                className="w-full pl-12 pr-4 py-3 sm:py-4 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-300"
                placeholder="CRN123456789"
                disabled={isLoading}
              />
            </div>
            {errors.govtId && (
              <p className="text-red-400 text-sm mt-1">{errors.govtId}</p>
            )}
          </div>
        </>
      )}

      {/* Password */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={onInputChange}
            className="w-full pl-12 pr-12 py-3 sm:py-4 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-300"
            placeholder="Create a strong password"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {errors.password && (
          <p className="text-red-400 text-sm mt-1">{errors.password}</p>
        )}
      </div>

      {/* GST (Optional) */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-300 mb-2">
          GST Number <span className="text-slate-500 text-xs">(Optional)</span>
        </label>
        <div className="relative">
          <FileText className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            name="gst"
            value={formData.gst}
            onChange={onInputChange}
            className="w-full pl-12 pr-4 py-3 sm:py-4 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-300"
            placeholder="22AAAAA0000A1Z5"
            disabled={isLoading}
          />
        </div>
        {errors.gst && (
          <p className="text-red-400 text-sm mt-1">{errors.gst}</p>
        )}
      </div>

      {/* Address */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Address
        </label>
        <div className="relative">
          <MapPin className="absolute left-4 top-4 text-slate-400" size={20} />
          <textarea
            name="address"
            value={formData.address}
            onChange={onInputChange}
            rows="3"
            className="w-full pl-12 pr-4 py-3 sm:py-4 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-300 resize-none"
            placeholder="Enter your complete address"
            disabled={isLoading}
          />
        </div>
        {errors.address && (
          <p className="text-red-400 text-sm mt-1">{errors.address}</p>
        )}
      </div>

      {/* General Error */}
      {errors.general && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
          <p className="text-red-400 text-sm">{errors.general}</p>
        </div>
      )}

      {/* Register Button */}
      <button
        onClick={onRegister}
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-semibold py-3 sm:py-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-sky-500/30"
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Registering...
          </span>
        ) : (
          'Complete Registration'
        )}
      </button>
    </div>
  );
};

export default AuctioneerRegistrationStep;