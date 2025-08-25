import React from 'react';

const BackgroundEffects = () => {
  return (
    <>
      {/* Enhanced Glowing Orbs - Darker theme */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-sky-500/8 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-blue-600/6 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      <div className="absolute top-1/2 left-1/2 w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 bg-indigo-500/6 rounded-full blur-2xl animate-pulse" style={{animationDelay: '2s'}}></div>
      <div className="absolute top-1/6 right-1/6 w-40 h-40 sm:w-56 sm:h-56 lg:w-72 lg:h-72 bg-slate-600/4 rounded-full blur-3xl animate-pulse" style={{animationDelay: '0.5s'}}></div>
    </>
  );
};

export default BackgroundEffects;