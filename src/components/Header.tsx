import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-20 sm:h-24">
          <div className="flex items-center justify-center p-2 rounded-xl transition-transform hover:scale-[1.02]">
            <img
              src="https://edunura.com/images/edunura-font-02.png"
              alt="Edunura Logo"
              className="h-10 sm:h-12 w-auto object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
