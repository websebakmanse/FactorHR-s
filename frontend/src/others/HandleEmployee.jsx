import React, { useState } from "react";

const initialRequests = [
  { id: 1, name: "John Doe", avatar: "J", type: "Leave", details: "Sick Leave", date: "Oct 10 - Oct 12", status: "Pending" },
  { id: 2, name: "Alice Smith", avatar: "A", type: "Punch", details: "Missed Punch In", date: "Oct 09", status: "Pending" },
  { id: 3, name: "David Johnson", avatar: "D", type: "Leave", details: "Casual Leave", date: "Oct 15", status: "Pending" },
  { id: 4, name: "Sarah Williams", avatar: "S", type: "Punch", details: "Wrong Punch Out", date: "Oct 08", status: "Pending" },
];

const inputCls = "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/50 transition-all duration-200 text-sm";
const labelCls = "block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5";

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
    showToast(`${req.name}'s ${req.type.toLowerCase()} request ${action}d.`, action === "approve" ? "success" : "error");
    setRequests(requests.filter((r) => r.id !== id));
  };

  return (
    <div className="p-4 md:p-8 space-y-8 relative">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-2xl text-sm font-semibold border transition-all duration-300
          ${toast.type === "success"
            ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-300"
            : "bg-rose-500/20 border-rose-500/30 text-rose-300"
          }`}>
          {toast.msg}
        </div>
      )}

      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white">Employee Management</h1>
        <p className="text-white/40 text-sm mt-1">Register new employees and manage requests</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Register Employee Form */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center text-yellow-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Register New Employee</h2>
              <p className="text-white/40 text-xs">Fill in the details below</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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
                <select id="department" value={formData.department} onChange={handleChange} className={inputCls + " [&>option]:bg-slate-900"} required>
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
              className="w-full py-3 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 transition-all duration-200 mt-2 text-sm tracking-wide shadow-lg shadow-yellow-500/20"
            >
              Create Employee
            </button>
          </form>
        </div>

        {/* Manage Requests */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-rose-400/10 border border-rose-400/20 flex items-center justify-center text-rose-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Pending Requests</h2>
                <p className="text-white/40 text-xs">Approve or reject employee requests</p>
              </div>
            </div>
            {requests.length > 0 && (
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/20">
                {requests.length}
              </span>
            )}
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto max-h-[420px] pr-1 [&::-webkit-scrollbar]:hidden">
            {requests.length === 0 ? (
              <div className="text-center py-16 text-white/20">
                <svg className="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="font-medium text-sm">No pending requests</p>
              </div>
            ) : (
              requests.map((req) => (
                <div
                  key={req.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/5 hover:bg-white/8 border border-white/5 hover:border-yellow-500/20 rounded-xl p-4 transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-yellow-400/20 to-amber-600/10 border border-yellow-500/20 flex items-center justify-center text-yellow-400 font-bold text-sm flex-shrink-0">
                      {req.avatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-white font-semibold text-sm">{req.name}</p>
                        <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                          req.type === "Leave" ? "bg-amber-500/20 text-amber-400" : "bg-indigo-500/20 text-indigo-400"
                        }`}>
                          {req.type}
                        </span>
                      </div>
                      <p className="text-white/40 text-xs mt-0.5">{req.details} · {req.date}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleAction(req.id, "approve")}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 transition-all"
                    >
                      ✓ Approve
                    </button>
                    <button
                      onClick={() => handleAction(req.id, "reject")}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-all"
                    >
                      ✕ Reject
                    </button>
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
