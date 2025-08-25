import React from 'react';

const StepIndicator = ({ currentStep }) => {
  return (
    <div className="flex justify-center mb-8 sm:mb-10 relative z-10">
      <div className="flex items-center space-x-2 sm:space-x-4">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center">
            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-all duration-500 ${
              currentStep >= step 
                ? 'bg-gradient-to-r from-sky-400 to-blue-500 text-white shadow-[0_0_20px_rgba(14,165,233,0.5),0_8px_16px_rgba(0,0,0,0.3),0_0_40px_rgba(14,165,233,0.2)]' 
                : 'bg-slate-700/80 text-slate-400 border border-slate-600/70 shadow-[0_4px_8px_rgba(0,0,0,0.3),0_0_10px_rgba(30,41,59,0.2)]'
            }`}>
              {step}
            </div>
            {step < 3 && (
              <div className={`w-8 sm:w-12 h-0.5 mx-1 sm:mx-2 transition-all duration-500 ${
                currentStep > step ? 'bg-gradient-to-r from-sky-400 to-blue-500 shadow-[0_0_8px_rgba(14,165,233,0.4)]' : 'bg-slate-700'
              }`}></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepIndicator;