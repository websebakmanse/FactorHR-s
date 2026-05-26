import React, { useState } from "react";
import Navbar from "../../others/Navbar";
import HrSidebar from "./HrSidebar";
import HrOverview from "./HrOverview";
import HandleEmployee from "../../others/HandleEmployee";

const HrDashBoard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case "overview": return <HrOverview />;
      case "employees": return <HandleEmployee />;
      default: return <HrOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Navbar onMenuClick={() => setSidebarOpen(true)} />
      <div className="flex flex-1 overflow-hidden">
        <HrSidebar
          activeTab={activeTab}
          setActiveTab={(tab) => { setActiveTab(tab); setSidebarOpen(false); }}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <main className="flex-1 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default HrDashBoard;
