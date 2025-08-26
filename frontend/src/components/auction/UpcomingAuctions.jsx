import React, { useState } from "react";
import {
    User,
    Calendar,
    UserPlus,
    X,
    Mail,
    Phone,
    CreditCard,
    Notebook,
    ChevronRight,
    ChevronLeft,
    MapPin,
} from "lucide-react";

const UpcomingAuctions = ({ registeredAuctions = new Set(), userId = null }) => {
    const [selectedAuction, setSelectedAuction] = useState(null);
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        address: ""
    });

    // 🔹 FIX: define closeRegistrationModal
    const closeRegistrationModal = () => {
        setSelectedAuction(null);
        setCurrentStep(1);
        setFormData({
            fullName: "",
            email: "",
            phone: "",
            address: ""
        });
    };


    // ✅ Validation function
    const validateStep = () => {
        if (currentStep === 1) {
            return formData.fullName.trim() !== "" &&
                formData.email.trim() !== "" &&
                formData.phone.trim() !== "";
        }
        if (currentStep === 2) {
            return formData.address.trim() !== "";
        }
        return false;
    };


    const upcomingAuctions = [
        {
            title: "Vehicle Fleet Auction",
            auctioneer: "Robert Davis",
            purpose: "Transportation Services",
            startTime: "Dec 28, 2024 - 10:00 AM",
            endTime: "Dec 28, 2024 - 06:00 PM",
            status: "UPCOMING",
            baseAmount: 50000,
        },
        {
            title: "Medical Equipment Procurement",
            auctioneer: "Dr. Emily Brown",
            purpose: "Hospital Equipment",
            startTime: "Dec 30, 2024 - 09:00 AM",
            endTime: "Dec 30, 2024 - 05:00 PM",
            status: "UPCOMING",
            baseAmount: 75000,
        },
        {
            title: "Construction Materials Bid",
            auctioneer: "David Wilson",
            purpose: "Infrastructure Development",
            startTime: "Jan 02, 2025 - 11:00 AM",
            endTime: "Jan 02, 2025 - 07:00 PM",
            status: "UPCOMING",
            baseAmount: 100000,
        }
    ];

    const ActionButton = ({ type, onClick, isRegistered = false }) => {
        const styles = {
            register: isRegistered
                ? 'bg-gradient-to-r from-gray-500 to-gray-600 text-white cursor-not-allowed'
                : 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white'
        };

        const icons = {
            register: <UserPlus className="w-3 h-3" />
        };

        const labels = {
            register: isRegistered ? 'Registered' : 'Register'
        };

        return (
            <button
                onClick={isRegistered ? undefined : onClick}
                disabled={isRegistered}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-semibold text-xs transition-all duration-300 ${!isRegistered ? 'hover:transform hover:scale-105 hover:shadow-lg' : ''
                    } ${styles[type]}`}
            >
                {icons[type]}
                {labels[type]}
            </button>
        );
    };

    const openRegistrationModal = (auction) => {
        setSelectedAuction(auction);
        setCurrentStep(1);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const nextStep = () => {
        if (currentStep < 2) setCurrentStep(currentStep + 1);
    };

    const prevStep = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    };

    const handleSubmit = () => {
        const registrationFee = selectedAuction.baseAmount * 0.1;
        console.log("Submitting Registration:", {
            ...formData,
            selectedAuction,
            userId,
            registrationFee
        });
        closeRegistrationModal(); // ✅ now works
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm mb-2 font-medium text-slate-300 flex items-center gap-2">
                                <User className="w-4 h-4" />
                                Full Name <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                                className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-3 py-2.5 text-sm text-slate-200 placeholder-slate-400 outline-none focus:border-blue-500 transition-colors"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm mb-2 font-medium text-slate-300 flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                Email Address <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-3 py-2.5 text-sm text-slate-200 placeholder-slate-400 outline-none focus:border-blue-500 transition-colors"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm mb-2 font-medium text-slate-300 flex items-center gap-2">
                                <Phone className="w-4 h-4" />
                                Phone Number <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Enter your phone number"
                                className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-3 py-2.5 text-sm text-slate-200 placeholder-slate-400 outline-none focus:border-blue-500 transition-colors"
                                required
                            />
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div>
                        <label className="block text-sm mb-2 font-medium text-slate-300 flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            Address
                        </label>
                        <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Enter your address"
                            className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-3 py-2.5 text-sm text-slate-200 placeholder-slate-400 outline-none focus:border-blue-500 transition-colors resize-none"
                            rows={3}
                        />

                        <div className="space-y-4 mt-4">
                            <div>
                                <label className="block text-sm mb-2 font-medium text-slate-300 flex items-center gap-2">
                                    <Notebook className="w-4 h-4" />
                                    Registration fee is 10% of the base amount
                                </label>
                            </div>
                        </div>

                        {/* Registration Fee Display */}
                        <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-lg p-4 border border-emerald-400/20">
                            <div className="text-center">
                                <div className="text-sm text-slate-400 mb-1">Registration Fee</div>
                                <div className="text-xl font-bold text-emerald-400">
                                    {formatCurrency(selectedAuction.baseAmount * 0.1)}
                                </div>
                                <div className="text-xs text-slate-500 mt-1">
                                    10% of base amount ({formatCurrency(selectedAuction.baseAmount)})
                                </div>
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    const getStepTitle = () => {
        switch (currentStep) {
            case 1: return "Personal Information";
            case 2: return "Company Details";
            default: return "";
        }
    };

    return (
        <>
            {/* Auction Table */}
            <div className="bg-slate-800/60 backdrop-blur-lg border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3 grid grid-cols-8 gap-3 font-semibold text-white">
                    <div className="col-span-2">Auction Title</div>
                    <div className="col-span-1">Auctioneer</div>
                    <div className="col-span-1">Purpose</div>
                    <div className="col-span-1">Start Time</div>
                    <div className="col-span-1">End Time</div>
                    <div className="col-span-1">Base Amount</div>
                    <div className="col-span-1">Action</div>
                </div>
                {upcomingAuctions.map((auction, index) => (
                    <div
                        key={index}
                        className="px-4 py-3 border-b border-slate-700/30 last:border-b-0 hover:bg-blue-500/5 transition-all duration-300 hover:transform hover:translate-x-2"
                    >
                        <div className="grid grid-cols-8 gap-3 items-center">
                            <div className="col-span-2 font-semibold text-slate-200">
                                {auction.title}
                            </div>
                            <div className="col-span-1 flex items-center gap-1 text-slate-400 text-sm">
                                <User className="w-3 h-3" />
                                {auction.auctioneer}
                            </div>
                            <div className="col-span-1 flex items-center gap-1 text-slate-400 text-sm">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                {auction.purpose}
                            </div>
                            <div className="col-span-1 flex items-center gap-1 text-slate-400 text-sm">
                                <Calendar className="w-3 h-3" />
                                <span className="text-xs">{auction.startTime}</span>
                            </div>
                            <div className="col-span-1 flex items-center gap-1 text-slate-400 text-sm">
                                <Calendar className="w-3 h-3" />
                                <span className="text-xs">{auction.endTime}</span>
                            </div>
                            <div className="col-span-1 flex items-center gap-1 text-slate-400 text-sm">
                                <span className="text-xs font-semibold text-green-400">
                                    {formatCurrency(auction.baseAmount)}
                                </span>
                            </div>
                            <div className="col-span-1">
                                <ActionButton
                                    type="register"
                                    onClick={() => openRegistrationModal(auction)}
                                    isRegistered={registeredAuctions.has(auction.title)}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Registration Modal */}
            {selectedAuction && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 text-slate-200 rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-hidden">
                        {/* Header */}
                        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-700/50">
                            <div>
                                <h2 className="text-lg font-bold text-white">
                                    Register for Auction
                                </h2>
                                <p className="text-sm text-slate-400 mt-1">{getStepTitle()}</p>
                            </div>
                            <button
                                onClick={closeRegistrationModal}
                                className="text-slate-400 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Progress Indicator */}
                        <div className="px-6 py-3 bg-slate-700/30">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-medium text-slate-300">Step {currentStep} of 2</span>
                                <span className="text-xs text-slate-400">{Math.round((currentStep / 2) * 100)}%</span>
                            </div>
                            <div className="w-full bg-slate-600/50 rounded-full h-2">
                                <div
                                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${(currentStep / 2) * 100}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Auction Title */}
                        <div className="px-6 py-2 bg-slate-700/20 border-b border-slate-700/50">
                            <div className="text-center text-slate-300 font-medium text-sm">
                                {selectedAuction.title}
                            </div>
                        </div>

                        {/* Form Content */}
                        <div className="px-6 py-4 max-h-[400px] overflow-y-auto">
                            {renderStepContent()}
                        </div>
                        {/* Footer */}
                        <div className="px-6 py-4 border-t border-slate-700/50">
                            <div className="flex gap-3">
                                {currentStep > 1 && (
                                    <button
                                        onClick={prevStep}
                                        className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2.5 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                        Previous
                                    </button>
                                )}

                                {currentStep < 2 ? (
                                    <button
                                        onClick={nextStep}
                                        disabled={!validateStep()}   // ✅ Disable until valid
                                        className={`flex-1 font-semibold py-2.5 rounded-lg transition-all duration-300 flex items-center justify-center gap-2
          ${validateStep()
                                                ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                                                : "bg-slate-600 text-slate-400 cursor-not-allowed"}`}
                                    >
                                        Next
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleSubmit}
                                        disabled={!validateStep()}   // ✅ Disable until address entered
                                        className={`flex-1 font-semibold py-2.5 rounded-lg transition-all duration-300 flex items-center justify-center gap-2
          ${validateStep()
                                                ? "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white"
                                                : "bg-slate-600 text-slate-400 cursor-not-allowed"}`}
                                    >
                                        <CreditCard className="w-4 h-4" />
                                        Pay & Register
                                    </button>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </>
    );
};

export default UpcomingAuctions;
