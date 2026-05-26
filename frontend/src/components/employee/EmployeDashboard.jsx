import React, { useState } from "react";
import EmployeeSidebar from "./EmployeeSidebar";
import PunchinViewProfile from "../../others/PunchinViewProfile";
import RequestToHr from "../../others/RequestToHr";

const EmployeDashboard = () => {
  const [activeTab, setActiveTab] = useState("attendance");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case "attendance": return <PunchinViewProfile />;
      case "requests": return <RequestToHr />;
      default: return <PunchinViewProfile />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Mobile top bar */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-white/5 sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center text-slate-950 font-extrabold text-sm">F</div>
          <span className="text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500">FactoHR</span>
        </div>
        <button onClick={() => setSidebarOpen(true)} className="text-white/60 hover:text-white p-1">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <EmployeeSidebar
          activeTab={activeTab}
          setActiveTab={(tab) => { setActiveTab(tab); setSidebarOpen(false); }}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/60 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}
        <main className="flex-1 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default EmployeDashboard;
