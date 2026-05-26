import React from "react";

// Navbar is now only used as a mobile top bar trigger — sidebars handle full nav.
// Pass onMenuClick prop to show hamburger on mobile.
const Navbar = ({ onMenuClick }) => {
  return (
    <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-white/5 sticky top-0 z-10">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center text-slate-950 font-extrabold text-sm">
          F
        </div>
        <span className="text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500">
          FactoHR
        </span>
      </div>
      {onMenuClick && (
        <button onClick={onMenuClick} className="text-white/60 hover:text-white p-1">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default Navbar;
