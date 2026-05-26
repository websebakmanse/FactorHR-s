import React, { useState, useEffect } from 'react';

const PunchinViewProfile = () => {
  const [isPunchedIn, setIsPunchedIn] = useState(false);
  const [time, setTime] = useState(new Date());

  // Mock initial punch history
  const [history, setHistory] = useState([
    { id: 1, date: '25 May 2026', punchIn: '09:00 AM', punchOut: '06:00 PM', status: 'Present' },
    { id: 2, date: '24 May 2026', punchIn: '09:15 AM', punchOut: '06:10 PM', status: 'Late' },
    { id: 3, date: '23 May 2026', punchIn: '08:50 AM', punchOut: '05:30 PM', status: 'Half Day' },
  ]);

  // Update clock every second
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const handlePunch = () => {
    const timeString = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateString = time.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    if (!isPunchedIn) {
      // Punch In Action
      const newRecord = { id: Date.now(), date: dateString, punchIn: timeString, punchOut: '--:--', status: 'Working...' };
      setHistory([newRecord, ...history]);
    } else {
      // Punch Out Action
      setHistory(history.map((record, index) => {
        if (index === 0 && record.punchOut === '--:--') {
          return { ...record, punchOut: timeString, status: 'Present' };
        }
        return record;
      }));
    }
    setIsPunchedIn(!isPunchedIn);
  };

  return (
    <div className="relative w-full flex flex-col items-center justify-center p-4 md:p-10 z-10 pt-8">
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full max-w-7xl">
        
        {/* Left Card: Punch In/Out Action */}
        <div className="lg:col-span-1 bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl flex flex-col items-center justify-center text-center">
          <h3 className="text-2xl font-bold text-white mb-2">Time & Attendance</h3>
          <p className="text-white/60 mb-8">{time.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          
          <div className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500 mb-8 drop-shadow-md tracking-wider">
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </div>

          <button 
            onClick={handlePunch}
            className={`w-full py-4 rounded-2xl font-extrabold text-xl tracking-wide transition-all duration-300 transform hover:-translate-y-1 shadow-lg ${
              isPunchedIn 
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/50 hover:bg-rose-500/30 hover:shadow-[0_0_20px_rgba(244,63,94,0.3)]' 
                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 hover:bg-emerald-500/30 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]'
            }`}
          >
            {isPunchedIn ? 'PUNCH OUT' : 'PUNCH IN'}
          </button>
          <p className="mt-5 text-sm font-medium text-white/50">
            {isPunchedIn ? "🟢 You are currently clocked in" : "🔴 You are currently clocked out"}
          </p>
        </div>

        {/* Right Card: Punch History Data */}
        <div className="lg:col-span-2 bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl flex flex-col">
          <h3 className="text-2xl font-bold text-white mb-6">Recent Punch History</h3>
          
          <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="border-b border-white/10 text-white/50 text-sm uppercase tracking-wider">
                  <th className="py-4 px-4 font-semibold">Date</th>
                  <th className="py-4 px-4 font-semibold">Punch In</th>
                  <th className="py-4 px-4 font-semibold">Punch Out</th>
                  <th className="py-4 px-4 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {history.map((record) => (
                  <tr key={record.id} className="border-b border-white/5 hover:bg-white/5 transition-colors duration-200">
                    <td className="py-5 px-4 text-white font-medium">{record.date}</td>
                    <td className="py-5 px-4 text-emerald-400 font-medium">{record.punchIn}</td>
                    <td className="py-5 px-4 text-rose-400 font-medium">{record.punchOut}</td>
                    <td className="py-5 px-4 text-right">
                      <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                        record.status === 'Working...' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse' :
                        record.status === 'Present' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                        record.status === 'Half Day' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                        'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      }`}>
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
    </div>
  );
};

export default PunchinViewProfile;
