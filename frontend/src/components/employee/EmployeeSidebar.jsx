import React from "react";
import { useAuth } from "../../context/AuthProvider";

const navItems = [
  {
    id: "attendance",
    label: "Attendance",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    id: "requests",
    label: "Requests",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
];

const EmployeeSidebar = ({ activeTab, setActiveTab, isOpen, onClose }) => {
  const { user, logout } = useAuth();

  return (
    <aside
      className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-slate-900 border-r border-white/5 flex flex-col transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-white/5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center text-slate-950 font-extrabold text-lg shadow">
          F
        </div>
        <span className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500">
          FactoHR
        </span>
        <button onClick={onClose} className="ml-auto lg:hidden text-white/40 hover:text-white">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* User Info */}
      <div className="px-6 py-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400/30 to-teal-600/30 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-lg">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold text-white truncate max-w-[130px]">{user?.name}</p>
            <p className="text-xs text-emerald-400 capitalize font-medium">{user?.designation || user?.role}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200
              ${activeTab === item.id
                ? "bg-yellow-400/10 text-yellow-400 border border-yellow-400/20"
                : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
          >
            {item.icon}
            {item.label}
            {activeTab === item.id && (
              <span className="ml-auto w-1.5 h-1.5 rounded-full bg-yellow-400"></span>
            )}
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-white/5">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-rose-400 hover:bg-rose-500/10 transition-all duration-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>
    </aside>
  );
};

export default EmployeeSidebar;
