import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthProvider";

const initialHistory = [
  { id: 1, date: "25 May 2026", punchIn: "09:00 AM", punchOut: "06:00 PM", hours: "9h 00m", status: "Present" },
  { id: 2, date: "24 May 2026", punchIn: "09:45 AM", punchOut: "06:10 PM", hours: "8h 25m", status: "Late" },
  { id: 3, date: "23 May 2026", punchIn: "08:50 AM", punchOut: "01:30 PM", hours: "4h 40m", status: "Half Day" },
  { id: 4, date: "22 May 2026", punchIn: "09:05 AM", punchOut: "06:00 PM", hours: "8h 55m", status: "Present" },
];

const statusStyle = {
  "Present": "bg-emerald-500/20 text-emerald-400 border-emerald-500/20",
  "Late": "bg-rose-500/20 text-rose-400 border-rose-500/20",
  "Half Day": "bg-orange-500/20 text-orange-400 border-orange-500/20",
  "Working...": "bg-amber-500/20 text-amber-400 border-amber-500/20 animate-pulse",
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
      setHistory(history.map((r, i) => i === 0 && r.punchOut === "--:--"
        ? { ...r, punchOut: timeStr, status: "Present" }
        : r
      ));
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
        <h1 className="text-2xl md:text-3xl font-extrabold text-white">Attendance</h1>
        <p className="text-white/40 text-sm mt-1">{today}</p>
      </div>

      {/* Top Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Punch Card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center text-center">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400/30 to-amber-600/20 border-2 border-yellow-500/30 flex items-center justify-center text-yellow-400 font-extrabold text-2xl mb-3">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <p className="text-white font-bold text-lg">{user?.name}</p>
          <p className="text-white/40 text-xs mb-5">{user?.department || "—"} · {user?.designation || user?.role}</p>

          {/* Clock */}
          <div className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500 tracking-wider mb-1">
            {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
          </div>

          {/* Elapsed timer */}
          {isPunchedIn && (
            <p className="text-emerald-400 text-sm font-mono mb-4">⏱ {getElapsed()}</p>
          )}
          {!isPunchedIn && <div className="mb-4" />}

          <button
            onClick={handlePunch}
            className={`w-full py-3.5 rounded-xl font-extrabold text-base tracking-wide transition-all duration-300 transform hover:-translate-y-0.5 border
              ${isPunchedIn
                ? "bg-rose-500/15 text-rose-400 border-rose-500/40 hover:bg-rose-500/25 hover:shadow-[0_0_20px_rgba(244,63,94,0.2)]"
                : "bg-emerald-500/15 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/25 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]"
              }`}
          >
            {isPunchedIn ? "⏹ PUNCH OUT" : "▶ PUNCH IN"}
          </button>
          <p className="mt-3 text-xs text-white/30">
            {isPunchedIn ? "🟢 Currently clocked in" : "🔴 Currently clocked out"}
          </p>
        </div>

        {/* Stats */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4 content-start">
          {[
            { label: "Present", value: presentDays, color: "text-emerald-400", bg: "from-emerald-500/10 to-emerald-600/5 border-emerald-500/15" },
            { label: "Late", value: lateDays, color: "text-rose-400", bg: "from-rose-500/10 to-rose-600/5 border-rose-500/15" },
            { label: "Leave Balance", value: "10", color: "text-amber-400", bg: "from-amber-500/10 to-amber-600/5 border-amber-500/15" },
            { label: "Working Days", value: "22", color: "text-blue-400", bg: "from-blue-500/10 to-blue-600/5 border-blue-500/15" },
            { label: "Avg Hours", value: "8.5h", color: "text-purple-400", bg: "from-purple-500/10 to-purple-600/5 border-purple-500/15" },
            { label: "This Month", value: "May", color: "text-cyan-400", bg: "from-cyan-500/10 to-cyan-600/5 border-cyan-500/15" },
          ].map((s) => (
            <div key={s.label} className={`bg-gradient-to-br ${s.bg} border rounded-xl p-4`}>
              <p className="text-white/40 text-xs font-medium uppercase tracking-wider">{s.label}</p>
              <p className={`text-2xl font-extrabold mt-1 ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Punch History Table */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h2 className="text-lg font-bold text-white mb-5">Punch History</h2>
        <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden">
          <table className="w-full text-left min-w-[520px]">
            <thead>
              <tr className="border-b border-white/5 text-white/30 text-xs uppercase tracking-wider">
                <th className="pb-3 px-2 font-semibold">Date</th>
                <th className="pb-3 px-2 font-semibold">Punch In</th>
                <th className="pb-3 px-2 font-semibold">Punch Out</th>
                <th className="pb-3 px-2 font-semibold">Hours</th>
                <th className="pb-3 px-2 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {history.map((record) => (
                <tr key={record.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                  <td className="py-4 px-2 text-white/80 text-sm font-medium">{record.date}</td>
                  <td className="py-4 px-2 text-emerald-400 text-sm font-semibold">{record.punchIn}</td>
                  <td className="py-4 px-2 text-rose-400 text-sm font-semibold">{record.punchOut}</td>
                  <td className="py-4 px-2 text-white/50 text-sm">{record.hours}</td>
                  <td className="py-4 px-2 text-right">
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
