import React, { useState } from "react";

const initialRequests = [
  { id: 1, name: "John Doe", avatar: "J", avatarBg: "bg-blue-100 text-blue-600", type: "Leave", details: "Sick Leave", date: "Oct 10–12" },
  { id: 2, name: "Alice Smith", avatar: "A", avatarBg: "bg-purple-100 text-purple-600", type: "Punch", details: "Missed Punch In", date: "Oct 09" },
  { id: 3, name: "David Johnson", avatar: "D", avatarBg: "bg-emerald-100 text-emerald-600", type: "Leave", details: "Casual Leave", date: "Oct 15" },
  { id: 4, name: "Sarah Williams", avatar: "S", avatarBg: "bg-rose-100 text-rose-600", type: "Punch", details: "Wrong Punch Out", date: "Oct 08" },
];

const inputCls = "w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all duration-200 text-sm";
const labelCls = "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5";

const HandleEmployee = () => {
  const [formData, setFormData] = useState({ fullName: "", email: "", phone: "", department: "", role: "" });
  const [requests, setRequests] = useState(initialRequests);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    showToast(`${formData.fullName} registered successfully!`);
    setFormData({ fullName: "", email: "", phone: "", department: "", role: "" });
  };

  const handleAction = (id, action) => {
    const req = requests.find((r) => r.id === id);
    showToast(`${req.name}'s ${req.type.toLowerCase()} ${action}d.`, action === "approve" ? "success" : "error");
    setRequests(requests.filter((r) => r.id !== id));
  };

  return (
    <div className="p-4 md:p-8 space-y-7 relative">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-semibold border
          ${toast.type === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-rose-50 border-rose-200 text-rose-700"}`}>
          {toast.type === "success" ? "✓" : "✕"} {toast.msg}
        </div>
      )}

      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800">Employee Management</h1>
        <p className="text-slate-400 text-sm mt-1">Register new employees and manage requests</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Register Form */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 bg-amber-50/50">
            <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">Register New Employee</h2>
              <p className="text-slate-400 text-xs">Fill in the details below</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className={labelCls} htmlFor="fullName">Full Name</label>
              <input type="text" id="fullName" value={formData.fullName} onChange={handleChange} className={inputCls} placeholder="John Doe" required />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls} htmlFor="email">Email</label>
                <input type="email" id="email" value={formData.email} onChange={handleChange} className={inputCls} placeholder="john@company.com" required />
              </div>
              <div>
                <label className={labelCls} htmlFor="phone">Phone</label>
                <input type="tel" id="phone" value={formData.phone} onChange={handleChange} className={inputCls} placeholder="+91 98765 43210" required />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls} htmlFor="department">Department</label>
                <select id="department" value={formData.department} onChange={handleChange} className={inputCls} required>
                  <option value="" disabled>Select</option>
                  {["Java", "Python", "MERN", ".NET", "DevOps", "Tester"].map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls} htmlFor="role">Designation</label>
                <input type="text" id="role" value={formData.role} onChange={handleChange} className={inputCls} placeholder="Software Engineer" required />
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 transition-all duration-200 text-sm shadow-md shadow-amber-200 mt-1"
            >
              Create Employee
            </button>
          </form>
        </div>

        {/* Requests Panel */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-rose-50/40">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-800">Pending Requests</h2>
                <p className="text-slate-400 text-xs">Approve or reject</p>
              </div>
            </div>
            {requests.length > 0 && (
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-rose-100 text-rose-600">{requests.length}</span>
            )}
          </div>

          <div className="flex-1 p-4 space-y-3 overflow-y-auto max-h-[420px]">
            {requests.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                <svg className="w-12 h-12 mx-auto mb-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="font-medium text-sm">No pending requests</p>
              </div>
            ) : (
              requests.map((req) => (
                <div
                  key={req.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 hover:bg-amber-50/50 border border-slate-100 hover:border-amber-200 rounded-xl p-4 transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full ${req.avatarBg} flex items-center justify-center font-bold text-sm flex-shrink-0`}>
                      {req.avatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-slate-800 font-semibold text-sm">{req.name}</p>
                        <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                          req.type === "Leave" ? "bg-amber-100 text-amber-700" : "bg-indigo-100 text-indigo-700"
                        }`}>{req.type}</span>
                      </div>
                      <p className="text-slate-400 text-xs mt-0.5">{req.details} · {req.date}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => handleAction(req.id, "approve")} className="px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 transition-all">✓ Approve</button>
                    <button onClick={() => handleAction(req.id, "reject")} className="px-3 py-1.5 rounded-lg text-xs font-bold text-rose-700 bg-rose-100 hover:bg-rose-200 transition-all">✕ Reject</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default HandleEmployee;
