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
    color: "from-blue-500/20 to-blue-600/10 border-blue-500/20",
    iconColor: "text-blue-400",
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
    color: "from-emerald-500/20 to-emerald-600/10 border-emerald-500/20",
    iconColor: "text-emerald-400",
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
    color: "from-amber-500/20 to-amber-600/10 border-amber-500/20",
    iconColor: "text-amber-400",
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
    color: "from-rose-500/20 to-rose-600/10 border-rose-500/20",
    iconColor: "text-rose-400",
  },
];

const recentRequests = [
  { id: 1, name: "John Doe", avatar: "J", type: "Leave", details: "Sick Leave", date: "Oct 10 - Oct 12", status: "Pending" },
  { id: 2, name: "Alice Smith", avatar: "A", type: "Punch", details: "Missed Punch In", date: "Oct 09", status: "Pending" },
  { id: 3, name: "David Johnson", avatar: "D", type: "Leave", details: "Casual Leave", date: "Oct 15", status: "Pending" },
  { id: 4, name: "Sarah Williams", avatar: "S", type: "Punch", details: "Wrong Punch Out", date: "Oct 08", status: "Pending" },
];

const departments = [
  { name: "MERN", count: 12, color: "bg-blue-500" },
  { name: "Java", count: 10, color: "bg-amber-500" },
  { name: "Python", count: 9, color: "bg-emerald-500" },
  { name: "DevOps", count: 7, color: "bg-purple-500" },
  { name: ".NET", count: 6, color: "bg-rose-500" },
  { name: "Tester", count: 4, color: "bg-cyan-500" },
];

const HrOverview = () => {
  const [requests, setRequests] = useState(recentRequests);

  const handleAction = (id, action) => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
  };

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  return (
    <div className="p-4 md:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white">HR Dashboard</h1>
        <p className="text-white/40 text-sm mt-1">{today}</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`bg-gradient-to-br ${stat.color} border rounded-2xl p-5 flex items-start gap-4 hover:scale-[1.02] transition-transform duration-200`}
          >
            <div className={`${stat.iconColor} bg-white/5 p-3 rounded-xl`}>{stat.icon}</div>
            <div>
              <p className="text-white/50 text-xs font-medium uppercase tracking-wider">{stat.label}</p>
              <p className="text-3xl font-extrabold text-white mt-0.5">{stat.value}</p>
              <p className={`text-xs font-medium mt-1 ${stat.positive ? "text-emerald-400" : "text-amber-400"}`}>
                {stat.change}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Pending Requests */}
        <div className="xl:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-white">Pending Requests</h2>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/20">
              {requests.length} pending
            </span>
          </div>

          {requests.length === 0 ? (
            <div className="text-center py-12 text-white/30">
              <svg className="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="font-medium">All caught up! No pending requests.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {requests.map((req) => (
                <div
                  key={req.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/5 hover:bg-white/8 border border-white/5 hover:border-yellow-500/20 rounded-xl p-4 transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-yellow-400/30 to-amber-600/20 border border-yellow-500/20 flex items-center justify-center text-yellow-400 font-bold text-sm flex-shrink-0">
                      {req.avatar}
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">{req.name}</p>
                      <p className="text-white/40 text-xs">{req.details} · {req.date}</p>
                    </div>
                    <span className={`ml-1 px-2 py-0.5 text-xs font-bold rounded-full ${
                      req.type === "Leave"
                        ? "bg-amber-500/20 text-amber-400"
                        : "bg-indigo-500/20 text-indigo-400"
                    }`}>
                      {req.type}
                    </span>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleAction(req.id, "approve")}
                      className="px-4 py-1.5 rounded-lg text-xs font-bold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 transition-all"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleAction(req.id, "reject")}
                      className="px-4 py-1.5 rounded-lg text-xs font-bold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-all"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Department Breakdown */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-5">Departments</h2>
          <div className="space-y-4">
            {departments.map((dept) => (
              <div key={dept.name}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-white/70 font-medium">{dept.name}</span>
                  <span className="text-white font-bold">{dept.count}</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-2">
                  <div
                    className={`${dept.color} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${(dept.count / 12) * 100}%` }}
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
