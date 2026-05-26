import React, { useState } from "react";

const stats = [
  {
    label: "Total Employees",
    value: "48",
    change: "+3 this month",
    positive: true,
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    bg: "bg-blue-50",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    border: "border-blue-100",
    valueColor: "text-blue-700",
  },
  {
    label: "Present Today",
    value: "41",
    change: "85% attendance",
    positive: true,
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    bg: "bg-emerald-50",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    border: "border-emerald-100",
    valueColor: "text-emerald-700",
  },
  {
    label: "On Leave",
    value: "5",
    change: "3 pending approval",
    positive: false,
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    bg: "bg-amber-50",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    border: "border-amber-100",
    valueColor: "text-amber-700",
  },
  {
    label: "Pending Requests",
    value: "4",
    change: "Needs attention",
    positive: false,
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    ),
    bg: "bg-rose-50",
    iconBg: "bg-rose-100",
    iconColor: "text-rose-600",
    border: "border-rose-100",
    valueColor: "text-rose-700",
  },
];

const initialRequests = [
  { id: 1, name: "John Doe", avatar: "J", avatarBg: "bg-blue-100 text-blue-600", type: "Leave", details: "Sick Leave", date: "Oct 10–12" },
  { id: 2, name: "Alice Smith", avatar: "A", avatarBg: "bg-purple-100 text-purple-600", type: "Punch", details: "Missed Punch In", date: "Oct 09" },
  { id: 3, name: "David Johnson", avatar: "D", avatarBg: "bg-emerald-100 text-emerald-600", type: "Leave", details: "Casual Leave", date: "Oct 15" },
  { id: 4, name: "Sarah Williams", avatar: "S", avatarBg: "bg-rose-100 text-rose-600", type: "Punch", details: "Wrong Punch Out", date: "Oct 08" },
];

const departments = [
  { name: "MERN", count: 12, max: 12, color: "bg-blue-500" },
  { name: "Java", count: 10, max: 12, color: "bg-amber-500" },
  { name: "Python", count: 9, max: 12, color: "bg-emerald-500" },
  { name: "DevOps", count: 7, max: 12, color: "bg-purple-500" },
  { name: ".NET", count: 6, max: 12, color: "bg-rose-500" },
  { name: "Tester", count: 4, max: 12, color: "bg-cyan-500" },
];

const HrOverview = () => {
  const [requests, setRequests] = useState(initialRequests);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAction = (id, action) => {
    const req = requests.find((r) => r.id === id);
    showToast(`${req.name}'s request ${action}d.`, action === "approve" ? "success" : "error");
    setRequests((prev) => prev.filter((r) => r.id !== id));
  };

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  return (
    <div className="p-4 md:p-8 space-y-7">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-semibold border transition-all
          ${toast.type === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-rose-50 border-rose-200 text-rose-700"}`}>
          {toast.type === "success" ? "✓" : "✕"} {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800">Good Morning 👋</h1>
          <p className="text-slate-400 text-sm mt-0.5">{today}</p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2 shadow-sm text-sm text-slate-500">
          <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          May 2026
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`${stat.bg} border ${stat.border} rounded-2xl p-5 flex items-start gap-4 hover:shadow-md transition-shadow duration-200`}
          >
            <div className={`${stat.iconBg} ${stat.iconColor} p-3 rounded-xl flex-shrink-0`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">{stat.label}</p>
              <p className={`text-3xl font-extrabold mt-0.5 ${stat.valueColor}`}>{stat.value}</p>
              <p className={`text-xs font-medium mt-1 ${stat.positive ? "text-emerald-600" : "text-amber-600"}`}>
                {stat.change}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Pending Requests */}
        <div className="xl:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-800">Pending Requests</h2>
            {requests.length > 0 && (
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-rose-100 text-rose-600">
                {requests.length} pending
              </span>
            )}
          </div>

          <div className="p-4 space-y-3">
            {requests.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <svg className="w-12 h-12 mx-auto mb-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="font-medium text-sm">All caught up! No pending requests.</p>
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
                      <p className="text-slate-800 font-semibold text-sm">{req.name}</p>
                      <p className="text-slate-400 text-xs">{req.details} · {req.date}</p>
                    </div>
                    <span className={`ml-1 px-2 py-0.5 text-xs font-bold rounded-full ${
                      req.type === "Leave" ? "bg-amber-100 text-amber-700" : "bg-indigo-100 text-indigo-700"
                    }`}>
                      {req.type}
                    </span>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleAction(req.id, "approve")}
                      className="px-4 py-1.5 rounded-lg text-xs font-bold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 transition-all"
                    >
                      ✓ Approve
                    </button>
                    <button
                      onClick={() => handleAction(req.id, "reject")}
                      className="px-4 py-1.5 rounded-lg text-xs font-bold text-rose-700 bg-rose-100 hover:bg-rose-200 transition-all"
                    >
                      ✕ Reject
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Department Breakdown */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-800">Departments</h2>
            <p className="text-slate-400 text-xs mt-0.5">48 total employees</p>
          </div>
          <div className="p-5 space-y-4">
            {departments.map((dept) => (
              <div key={dept.name}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-slate-600 font-medium">{dept.name}</span>
                  <span className="text-slate-800 font-bold">{dept.count}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className={`${dept.color} h-2 rounded-full transition-all duration-700`}
                    style={{ width: `${(dept.count / dept.max) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default HrOverview;
