import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthProvider";

const initialHistory = [
  { id: 1, date: "25 May 2026", punchIn: "09:00 AM", punchOut: "06:00 PM", hours: "9h 00m", status: "Present" },
  { id: 2, date: "24 May 2026", punchIn: "09:45 AM", punchOut: "06:10 PM", hours: "8h 25m", status: "Late" },
  { id: 3, date: "23 May 2026", punchIn: "08:50 AM", punchOut: "01:30 PM", hours: "4h 40m", status: "Half Day" },
  { id: 4, date: "22 May 2026", punchIn: "09:05 AM", punchOut: "06:00 PM", hours: "8h 55m", status: "Present" },
];

const statusStyle = {
  "Present":   "bg-emerald-100 text-emerald-700 border-emerald-200",
  "Late":      "bg-rose-100 text-rose-700 border-rose-200",
  "Half Day":  "bg-orange-100 text-orange-700 border-orange-200",
  "Working...":"bg-amber-100 text-amber-700 border-amber-200 animate-pulse",
};

const PunchinViewProfile = () => {
  const { user } = useAuth();
  const [isPunchedIn, setIsPunchedIn] = useState(false);
  const [time, setTime] = useState(new Date());
  const [history, setHistory] = useState(initialHistory);
  const [punchInTime, setPunchInTime] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const getElapsed = () => {
    if (!punchInTime) return null;
    const diff = Math.floor((new Date() - punchInTime) / 1000);
    const h = Math.floor(diff / 3600);
    const m = Math.floor((diff % 3600) / 60);
    const s = diff % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const handlePunch = () => {
    const timeStr = time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const dateStr = time.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    if (!isPunchedIn) {
      setPunchInTime(new Date());
      setHistory([{ id: Date.now(), date: dateStr, punchIn: timeStr, punchOut: "--:--", hours: "--", status: "Working..." }, ...history]);
    } else {
      setPunchInTime(null);
      setHistory(history.map((r, i) => i === 0 && r.punchOut === "--:--" ? { ...r, punchOut: timeStr, status: "Present" } : r));
    }
    setIsPunchedIn(!isPunchedIn);
  };

  const today = time.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  const presentDays = history.filter((r) => r.status === "Present").length;
  const lateDays = history.filter((r) => r.status === "Late").length;

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800">Attendance</h1>
        <p className="text-slate-400 text-sm mt-0.5">{today}</p>
      </div>

      {/* Top Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Punch Card */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-extrabold text-2xl mb-3 shadow-md shadow-amber-200">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <p className="text-slate-800 font-bold text-lg">{user?.name}</p>
          <p className="text-slate-400 text-xs mb-5">{user?.department || "—"} · {user?.designation || user?.role}</p>

          <div className="text-4xl font-extrabold text-slate-800 tracking-wider mb-1 font-mono">
            {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
          </div>

          {isPunchedIn && (
            <p className="text-emerald-600 text-sm font-mono font-semibold mb-4">⏱ {getElapsed()}</p>
          )}
          {!isPunchedIn && <div className="mb-4" />}

          <button
            onClick={handlePunch}
            className={`w-full py-3.5 rounded-xl font-extrabold text-base tracking-wide transition-all duration-200 shadow-sm
              ${isPunchedIn
                ? "bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100"
                : "bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100"
              }`}
          >
            {isPunchedIn ? "⏹ PUNCH OUT" : "▶ PUNCH IN"}
          </button>
          <p className="mt-3 text-xs text-slate-400">
            {isPunchedIn ? "🟢 Currently clocked in" : "🔴 Currently clocked out"}
          </p>
        </div>

        {/* Stats */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4 content-start">
          {[
            { label: "Present", value: presentDays, color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-100" },
            { label: "Late", value: lateDays, color: "text-rose-700", bg: "bg-rose-50 border-rose-100" },
            { label: "Casual Leave", value: "10", color: "text-amber-700", bg: "bg-amber-50 border-amber-100" },
            { label: "Sick Leave", value: "4", color: "text-blue-700", bg: "bg-blue-50 border-blue-100" },
            { label: "Privilege", value: "15", color: "text-purple-700", bg: "bg-purple-50 border-purple-100" },
            { label: "Working Days", value: "22", color: "text-slate-700", bg: "bg-slate-50 border-slate-200" },
          ].map((s) => (
            <div key={s.label} className={`${s.bg} border rounded-xl p-4 hover:shadow-sm transition-shadow`}>
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">{s.label}</p>
              <p className={`text-2xl font-extrabold mt-1 ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Punch History */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-800">Punch History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[520px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 text-xs uppercase tracking-wider">
                <th className="py-3 px-5 font-semibold">Date</th>
                <th className="py-3 px-5 font-semibold">Punch In</th>
                <th className="py-3 px-5 font-semibold">Punch Out</th>
                <th className="py-3 px-5 font-semibold">Hours</th>
                <th className="py-3 px-5 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {history.map((record) => (
                <tr key={record.id} className="border-b border-slate-50 hover:bg-amber-50/30 transition-colors">
                  <td className="py-4 px-5 text-slate-700 text-sm font-medium">{record.date}</td>
                  <td className="py-4 px-5 text-emerald-600 text-sm font-semibold">{record.punchIn}</td>
                  <td className="py-4 px-5 text-rose-500 text-sm font-semibold">{record.punchOut}</td>
                  <td className="py-4 px-5 text-slate-500 text-sm">{record.hours}</td>
                  <td className="py-4 px-5 text-right">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusStyle[record.status] || statusStyle["Present"]}`}>
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PunchinViewProfile;
