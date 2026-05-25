import React from "react";

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-yellow-100 backdrop-blur-lg border-b border-yellow-500/20 shadow-[0_4px_30px_rgba(0,0,0,0.1)] sticky top-0 z-50">
      {/* Left side: Company Logo */}
      <div className="flex items-center space-x-3 cursor-pointer">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center text-slate-950 font-extrabold text-xl shadow-md">
          A
        </div>
        <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500 tracking-wide">
          ABC
        </span>
      </div>

      {/* Right side: Logout Button */}
      <div>
        <button className="px-5 py-2.5 text-sm font-bold text-slate-950 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 !rounded-full shadow-[0_0_15px_rgba(234,179,8,0.3)] transform hover:-translate-y-0.5 transition-all duration-300 ease-in-out border border-white/10">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
