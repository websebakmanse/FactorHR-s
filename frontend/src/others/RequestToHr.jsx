import React, { useState } from "react";

const inputCls = "w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all duration-200 text-sm [color-scheme:light]";
const labelCls = "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5";

const RequestToHr = () => {
  const [activeCard, setActiveCard] = useState("leave");
  const [leaveForm, setLeaveForm] = useState({ type: "", from: "", to: "", reason: "" });
  const [punchForm, setPunchForm] = useState({ date: "", punchIn: "", punchOut: "", reason: "" });
  const [profileForm, setProfileForm] = useState({ phone: "+91 98765 43210", address: "123 Tech Street, Pune" });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleLeaveSubmit = (e) => {
    e.preventDefault();
    showToast("Leave request submitted successfully!");
    setLeaveForm({ type: "", from: "", to: "", reason: "" });
  };

  const handlePunchSubmit = (e) => {
    e.preventDefault();
    showToast("Punch correction request submitted!");
    setPunchForm({ date: "", punchIn: "", punchOut: "", reason: "" });
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    showToast("Profile updated successfully!");
    setIsEditingProfile(false);
  };

  const tabs = [
    { id: "leave", label: "Apply Leave", icon: "📅" },
    { id: "punch", label: "Correct Punch", icon: "⏱" },
    { id: "profile", label: "My Profile", icon: "👤" },
  ];

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Toast */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-semibold bg-emerald-50 border border-emerald-200 text-emerald-700">
          ✓ {toast}
        </div>
      )}

      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800">Requests</h1>
        <p className="text-slate-400 text-sm mt-0.5">Submit leave, punch corrections, or update your profile</p>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-1 bg-slate-100 border border-slate-200 rounded-xl p-1 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveCard(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200
              ${activeCard === tab.id
                ? "bg-white text-amber-700 shadow-sm border border-amber-100"
                : "text-slate-500 hover:text-slate-700"
              }`}
          >
            <span>{tab.icon}</span>
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Leave Balance */}
      {activeCard === "leave" && (
        <div className="grid grid-cols-3 gap-3 max-w-xs">
          {[
            { label: "Casual", value: 10, color: "text-amber-700", bg: "bg-amber-50 border-amber-100" },
            { label: "Sick", value: 4, color: "text-rose-700", bg: "bg-rose-50 border-rose-100" },
            { label: "Privilege", value: 15, color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-100" },
          ].map((b) => (
            <div key={b.label} className={`${b.bg} border rounded-xl p-3 text-center`}>
              <p className={`text-2xl font-extrabold ${b.color}`}>{b.value}</p>
              <p className="text-slate-500 text-xs mt-0.5 font-medium">{b.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Form Card */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden max-w-2xl">

        {/* Apply Leave */}
        {activeCard === "leave" && (
          <form onSubmit={handleLeaveSubmit} className="p-6 space-y-4">
            <h2 className="text-base font-bold text-slate-800 mb-4">Apply for Leave</h2>
            <div>
              <label className={labelCls}>Leave Type</label>
              <select value={leaveForm.type} onChange={(e) => setLeaveForm({ ...leaveForm, type: e.target.value })} className={inputCls} required>
                <option value="" disabled>Select leave type</option>
                <option value="casual">Casual Leave</option>
                <option value="sick">Sick Leave</option>
                <option value="privilege">Privilege Leave</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>From Date</label>
                <input type="date" value={leaveForm.from} onChange={(e) => setLeaveForm({ ...leaveForm, from: e.target.value })} className={inputCls} required />
              </div>
              <div>
                <label className={labelCls}>To Date</label>
                <input type="date" value={leaveForm.to} onChange={(e) => setLeaveForm({ ...leaveForm, to: e.target.value })} className={inputCls} required />
              </div>
            </div>
            <div>
              <label className={labelCls}>Reason</label>
              <textarea value={leaveForm.reason} onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })} placeholder="Briefly describe your reason..." className={inputCls + " resize-none min-h-[100px]"} required />
            </div>
            <button type="submit" className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 transition-all text-sm shadow-md shadow-amber-200">
              Submit Leave Request
            </button>
          </form>
        )}

        {/* Correct Punch */}
        {activeCard === "punch" && (
          <form onSubmit={handlePunchSubmit} className="p-6 space-y-4">
            <h2 className="text-base font-bold text-slate-800 mb-1">Correct Punch In/Out</h2>
            <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 text-sm text-rose-700 font-medium">
              <span>⚠️</span>
              <span>Missing Punch Out detected — 25 May 2026</span>
            </div>
            <div>
              <label className={labelCls}>Date</label>
              <input type="date" value={punchForm.date} onChange={(e) => setPunchForm({ ...punchForm, date: e.target.value })} className={inputCls} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Actual Punch In</label>
                <input type="time" value={punchForm.punchIn} onChange={(e) => setPunchForm({ ...punchForm, punchIn: e.target.value })} className={inputCls} required />
              </div>
              <div>
                <label className={labelCls}>Actual Punch Out</label>
                <input type="time" value={punchForm.punchOut} onChange={(e) => setPunchForm({ ...punchForm, punchOut: e.target.value })} className={inputCls} required />
              </div>
            </div>
            <div>
              <label className={labelCls}>Reason</label>
              <textarea value={punchForm.reason} onChange={(e) => setPunchForm({ ...punchForm, reason: e.target.value })} placeholder="Explain the reason for correction..." className={inputCls + " resize-none min-h-[100px]"} required />
            </div>
            <button type="submit" className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 transition-all text-sm shadow-md shadow-amber-200">
              Submit Correction Request
            </button>
          </form>
        )}

        {/* Profile */}
        {activeCard === "profile" && (
          <div className="p-6">
            <h2 className="text-base font-bold text-slate-800 mb-5">My Profile</h2>
            {!isEditingProfile ? (
              <div className="space-y-3">
                {[
                  { label: "Phone Number", value: profileForm.phone, icon: "📞" },
                  { label: "Address", value: profileForm.address, icon: "📍" },
                ].map((field) => (
                  <div key={field.label} className="flex items-start gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
                    <span className="text-lg mt-0.5">{field.icon}</span>
                    <div>
                      <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">{field.label}</p>
                      <p className="text-slate-800 font-medium text-sm mt-0.5">{field.value || "Not provided"}</p>
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => setIsEditingProfile(true)}
                  className="w-full py-3 rounded-xl font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all text-sm mt-2"
                >
                  Edit Profile
                </button>
              </div>
            ) : (
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div>
                  <label className={labelCls}>Phone Number</label>
                  <input type="tel" value={profileForm.phone} onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })} className={inputCls} placeholder="+91 98765 43210" required />
                </div>
                <div>
                  <label className={labelCls}>Address</label>
                  <textarea value={profileForm.address} onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })} className={inputCls + " resize-none min-h-[80px]"} placeholder="Your current address" required />
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setIsEditingProfile(false)} className="flex-1 py-3 rounded-xl font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-all text-sm">
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 transition-all text-sm">
                    Save Changes
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default RequestToHr;
