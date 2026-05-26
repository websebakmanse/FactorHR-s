import React, { useState } from 'react';

const RequestToHr = () => {
  // State management for different forms
  const [leaveForm, setLeaveForm] = useState({ type: '', from: '', to: '', reason: '' });
  const [punchForm, setPunchForm] = useState({ date: '', punchIn: '', punchOut: '', reason: '' });
  const [profileForm, setProfileForm] = useState({ phone: '+1 234 567 890', address: '123 Tech Street, NY' });
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Submit Handlers
  const handleLeaveSubmit = (e) => {
    e.preventDefault();
    alert('Leave request submitted successfully!');
    setLeaveForm({ type: '', from: '', to: '', reason: '' });
  };

  const handlePunchSubmit = (e) => {
    e.preventDefault();
    alert('Punch correction requested!');
    setPunchForm({ date: '', punchIn: '', punchOut: '', reason: '' });
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    alert('Profile updated successfully!');
    setIsEditingProfile(false);
  };

  return (
    <div className="relative min-h-screen bg-slate-950 overflow-x-hidden overflow-y-auto p-4 md:p-10 flex flex-col items-center">
      {/* Background Glowing Blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-500 rounded-full mix-blend-screen filter blur-[128px] opacity-30 pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-600 rounded-full mix-blend-screen filter blur-[128px] opacity-30 pointer-events-none"></div>

      <h2 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500 text-center mb-10 relative z-10">
        Employee Actions Panel
      </h2>

      {/* Main Flex/Grid Container for 3 Sections */}
      <div className="flex lg:grid flex-nowrap lg:grid-cols-3 gap-6 lg:gap-8 w-full max-w-7xl relative z-10 overflow-x-auto pb-8 snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        
        {/* 1. Apply Leave Section */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 lg:p-8 rounded-3xl shadow-2xl flex flex-col w-[85vw] sm:w-[400px] lg:w-auto flex-shrink-0 snap-center">
          <h3 className="text-2xl font-bold text-white mb-4">Apply for Leave</h3>
          
          {/* Leave Balances */}
          <div className="flex justify-between bg-black/20 p-4 rounded-xl border border-white/10 mb-6 text-sm text-white/80">
            <div className="text-center">
              <p className="font-semibold text-yellow-400 text-lg">10</p>
              <p>Casual</p>
            </div>
            <div className="text-center">
              <p className="font-semibold text-rose-400 text-lg">4</p>
              <p>Sick</p>
            </div>
            <div className="text-center">
              <p className="font-semibold text-green-400 text-lg">15</p>
              <p>Privilege</p>
            </div>
          </div>

          {/* Leave Form */}
          <form onSubmit={handleLeaveSubmit} className="flex flex-col gap-4 flex-1">
            <select value={leaveForm.type} onChange={(e) => setLeaveForm({...leaveForm, type: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white focus:border-yellow-400 outline-none [&>option]:bg-slate-900" required>
              <option value="" disabled>Select Leave Type</option>
              <option value="casual">Casual Leave</option>
              <option value="sick">Sick Leave</option>
              <option value="privilege">Privilege Leave</option>
            </select>
            <div className="grid grid-cols-2 gap-4">
              <input type="date" value={leaveForm.from} onChange={(e) => setLeaveForm({...leaveForm, from: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white focus:border-yellow-400 outline-none [color-scheme:dark]" required title="From Date" />
              <input type="date" value={leaveForm.to} onChange={(e) => setLeaveForm({...leaveForm, to: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white focus:border-yellow-400 outline-none [color-scheme:dark]" required title="To Date" />
            </div>
            <textarea value={leaveForm.reason} onChange={(e) => setLeaveForm({...leaveForm, reason: e.target.value})} placeholder="Reason for leave..." className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white focus:border-yellow-400 outline-none resize-none flex-1 min-h-[100px]" required></textarea>
            <button type="submit" className="mt-auto w-full py-3 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 transition-all">Submit Leave</button>
          </form>
        </div>

        {/* 2. Correct Punch Section */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 lg:p-8 rounded-3xl shadow-2xl flex flex-col w-[85vw] sm:w-[400px] lg:w-auto flex-shrink-0 snap-center">
          <h3 className="text-2xl font-bold text-white mb-4">Correct Punch In/Out</h3>
          
          {/* Missing Punch Alert */}
          <div className="bg-rose-500/20 border border-rose-500/30 p-4 rounded-xl mb-6 text-sm text-rose-200">
            <p className="font-semibold flex items-center gap-2">⚠️ Missing Punch Out detected</p>
            <p className="text-rose-200/70 mt-1">Date: 25 May 2026</p>
          </div>

          {/* Correct Punch Form */}
          <form onSubmit={handlePunchSubmit} className="flex flex-col gap-4 flex-1">
            <input type="date" value={punchForm.date} onChange={(e) => setPunchForm({...punchForm, date: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white focus:border-yellow-400 outline-none [color-scheme:dark]" required title="Date of Missing Punch" />
            <div className="grid grid-cols-2 gap-4">
              <input type="time" value={punchForm.punchIn} onChange={(e) => setPunchForm({...punchForm, punchIn: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white focus:border-yellow-400 outline-none [color-scheme:dark]" required title="Actual In Time" />
              <input type="time" value={punchForm.punchOut} onChange={(e) => setPunchForm({...punchForm, punchOut: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white focus:border-yellow-400 outline-none [color-scheme:dark]" required title="Actual Out Time" />
            </div>
            <textarea value={punchForm.reason} onChange={(e) => setPunchForm({...punchForm, reason: e.target.value})} placeholder="Reason for correction..." className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white focus:border-yellow-400 outline-none resize-none flex-1 min-h-[100px]" required></textarea>
            <button type="submit" className="mt-auto w-full py-3 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 transition-all">Request Correction</button>
          </form>
        </div>

        {/* 3. Edit Profile Section */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 lg:p-8 rounded-3xl shadow-2xl flex flex-col w-[85vw] sm:w-[400px] lg:w-auto flex-shrink-0 snap-center">
          <h3 className="text-2xl font-bold text-white mb-4">My Profile</h3>

          {!isEditingProfile ? (
            <div className="flex flex-col flex-1">
              <div className="bg-black/20 p-4 rounded-xl border border-white/10 mb-6 text-white/80 space-y-4 flex-1">
                <div>
                  <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Phone Number</p>
                  <p className="text-lg font-medium text-white">{profileForm.phone || "Not provided"}</p>
                </div>
                <div>
                  <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Address</p>
                  <p className="text-base text-white break-words">{profileForm.address || "Not provided"}</p>
                </div>
              </div>
              <button onClick={() => setIsEditingProfile(true)} className="mt-auto w-full py-3 rounded-xl font-bold text-white bg-slate-800 hover:bg-slate-700 border border-white/20 shadow-lg transform hover:-translate-y-0.5 transition-all duration-300">
                Edit Profile
              </button>
            </div>
          ) : (
            <form onSubmit={handleProfileSubmit} className="flex flex-col gap-4 flex-1 mt-2">
              <input type="tel" value={profileForm.phone} onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})} placeholder="Phone Number (+1 234 567 890)" className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white focus:border-yellow-400 outline-none" required />
              <textarea value={profileForm.address} onChange={(e) => setProfileForm({...profileForm, address: e.target.value})} placeholder="Your current address..." className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white focus:border-yellow-400 outline-none resize-none flex-1 min-h-[100px]" required></textarea>
              <div className="flex gap-4 mt-auto">
                <button type="button" onClick={() => setIsEditingProfile(false)} className="w-full py-3 rounded-xl font-bold text-white bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 transition-all">Cancel</button>
                <button type="submit" className="w-full py-3 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 transition-all">Save</button>
              </div>
            </form>
          )}
          
        </div>

      </div>
    </div>
  );
};

export default RequestToHr;
