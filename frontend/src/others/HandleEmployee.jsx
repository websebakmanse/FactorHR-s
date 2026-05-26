import React, { useState } from "react";

const HandleEmployee = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    department: "",
    role: "",
  });

  // Mock data for employee requests
  const [requests, setRequests] = useState([
    { id: 1, name: "John Doe", type: "Leave", details: "Sick Leave", date: "Oct 10 - Oct 12", status: "Pending" },
    { id: 2, name: "Alice Smith", type: "Punch", details: "Missed Punch In", date: "Oct 09", status: "Pending" },
    { id: 3, name: "David Johnson", type: "Leave", details: "Casual Leave", date: "Oct 15", status: "Pending" },
    { id: 4, name: "Sarah Williams", type: "Punch", details: "Wrong Punch Out time", date: "Oct 08", status: "Pending" },
  ]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Employee Data Submitted:", formData);
    alert("Employee registered successfully!");
    // Clear form after submission
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      department: "",
      role: "",
    });
  };

  // Handlers for the actions
  const handleApproveLeave = (id) => {
    alert(`Leave Approved for request #${id}`);
    setRequests(requests.filter((req) => req.id !== id));
  };

  const handleRejectLeave = (id) => {
    alert(`Leave Rejected for request #${id}`);
    setRequests(requests.filter((req) => req.id !== id));
  };

  const handleCorrectPunchIn = (id) => {
    alert(`Punch In time corrected for request #${id}`);
    setRequests(requests.filter((req) => req.id !== id));
  };

  const handleCorrectPunchOut = (id) => {
    alert(`Punch Out time corrected for request #${id}`);
    setRequests(requests.filter((req) => req.id !== id));
  };

  return (
    <div className="relative min-h-screen flex flex-col xl:flex-row items-center xl:items-stretch justify-center bg-slate-950 overflow-x-hidden overflow-y-auto p-4 md:p-10 gap-10 xl:gap-8">
      {/* Background Glowing Blobs */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-yellow-500 rounded-full mix-blend-screen filter blur-[128px] opacity-40 animate-pulse pointer-events-none"></div>
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-amber-600 rounded-full mix-blend-screen filter blur-[128px] opacity-40 animate-pulse delay-1000 pointer-events-none"></div>

      {/* Enhanced Glassmorphism Card (Registration Form) */}
      <div className="relative w-full flex-1 max-w-3xl xl:max-w-none bg-white/10 backdrop-blur-2xl border-t border-l border-white/30 border-r border-b border-white/10 p-8 md:p-12 rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-10 rounded-3xl pointer-events-none"></div>

        <h2 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500 text-center mb-10 relative z-10">
          Register New Employee
        </h2>

        <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-white/80 mb-2" htmlFor="fullName">Full Name</label>
              <input type="text" id="fullName" value={formData.fullName} onChange={handleChange} className="w-full px-5 py-3 rounded-xl bg-black/20 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-yellow-400 focus:bg-black/40 focus:ring-1 focus:ring-yellow-400 transition-all duration-300 backdrop-blur-sm" placeholder="John Doe" required />
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2" htmlFor="email">Email Address</label>
              <input type="email" id="email" value={formData.email} onChange={handleChange} className="w-full px-5 py-3 rounded-xl bg-black/20 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-yellow-400 focus:bg-black/40 focus:ring-1 focus:ring-yellow-400 transition-all duration-300 backdrop-blur-sm" placeholder="john.doe@company.com" required />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2" htmlFor="phone">Phone Number</label>
              <input type="tel" id="phone" value={formData.phone} onChange={handleChange} className="w-full px-5 py-3 rounded-xl bg-black/20 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-yellow-400 focus:bg-black/40 focus:ring-1 focus:ring-yellow-400 transition-all duration-300 backdrop-blur-sm" placeholder="+1 (555) 000-0000" required />
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2" htmlFor="department">Department</label>
              <select id="department" value={formData.department} onChange={handleChange} className="w-full px-5 py-3 rounded-xl bg-black/20 border border-white/10 text-white focus:outline-none focus:border-yellow-400 focus:bg-black/40 focus:ring-1 focus:ring-yellow-400 transition-all duration-300 backdrop-blur-sm [&>option]:bg-slate-900" required>
                <option value="" disabled className="text-white/40">Select Department</option>
                <option value="Java">Java</option>
                <option value="Python">Python</option>
                <option value="MERN">MERN</option>
                <option value=".NET">.NET</option>
                <option value="DevOps">DevOps</option>
                <option value="Tester">Tester</option>
              </select>
            </div>

            {/* Role / Designation */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2" htmlFor="role">Role / Designation</label>
              <input type="text" id="role" value={formData.role} onChange={handleChange} className="w-full px-5 py-3 rounded-xl bg-black/20 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-yellow-400 focus:bg-black/40 focus:ring-1 focus:ring-yellow-400 transition-all duration-300 backdrop-blur-sm" placeholder="Software Engineer" required />
            </div>
          </div>

          <div className="pt-6">
            <button
              type="submit"
              className="w-full py-4 px-4 !rounded-xl font-extrabold text-slate-950 text-lg tracking-wide bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 border border-white/10 shadow-[0_0_20px_rgba(234,179,8,0.3)] transform hover:-translate-y-1 transition-all duration-300 ease-in-out"
            >
              Create Employee
            </button>
          </div>
        </form>
      </div>

      {/* Employee Requests Management Card */}
      <div className="relative w-full flex-1 max-w-4xl xl:max-w-none z-10">
        <div className="xl:absolute xl:inset-0 w-full h-full flex flex-col bg-white/10 backdrop-blur-2xl border-t border-l border-white/30 border-r border-b border-white/10 p-8 md:p-12 rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.5)]">
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-10 rounded-3xl pointer-events-none"></div>

        <h2 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500 text-center mb-10 relative z-10">
          Manage Employee Requests
        </h2>

        <div className="space-y-6 relative z-10 flex-1 max-h-[500px] sm:max-h-[600px] xl:max-h-none overflow-y-auto pr-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {requests.length === 0 ? (
            <p className="text-center text-white/60 text-lg font-medium bg-black/20 py-10 rounded-2xl border border-white/10">
              No pending requests at the moment. 🎉
            </p>
          ) : (
            requests.map((req) => (
              <div
                key={req.id}
                className="bg-black/20 border border-white/10 p-6 rounded-2xl flex flex-col 2xl:flex-row justify-between items-center gap-6 transition-all duration-300 hover:bg-black/30 hover:border-yellow-500/30 backdrop-blur-sm group"
              >
                {/* Request Info */}
                <div className="flex-1 w-full text-center 2xl:text-left">
                  <div className="flex flex-col 2xl:flex-row items-center justify-center 2xl:justify-start gap-3 mb-2">
                    <h3 className="text-xl font-bold text-white tracking-wide">{req.name}</h3>
                    <span
                      className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${
                        req.type === "Leave"
                          ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                          : "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
                      }`}
                    >
                      {req.type}
                    </span>
                  </div>
                  <p className="text-white/70 text-sm">
                    {req.details} &bull; <span className="text-yellow-400/80 font-medium">{req.date}</span>
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center justify-center gap-3 w-full 2xl:w-auto">
                  {req.type === "Leave" ? (
                    <>
                      <button
                        onClick={() => handleApproveLeave(req.id)}
                        className="px-6 py-2.5 !rounded-xl font-bold text-green-400 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.1)] hover:shadow-[0_0_20px_rgba(34,197,94,0.2)] transform hover:-translate-y-0.5 transition-all duration-300"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleRejectLeave(req.id)}
                        className="px-6 py-2.5 !rounded-xl font-bold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.1)] hover:shadow-[0_0_20px_rgba(244,63,94,0.2)] transform hover:-translate-y-0.5 transition-all duration-300"
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleCorrectPunchIn(req.id)}
                        className="px-5 py-2.5 !rounded-xl font-bold text-slate-950 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 shadow-[0_0_15px_rgba(234,179,8,0.3)] transform hover:-translate-y-0.5 transition-all duration-300 border border-white/10"
                      >
                        Correct Punch In
                      </button>
                      <button
                        onClick={() => handleCorrectPunchOut(req.id)}
                        className="px-5 py-2.5 !rounded-xl font-bold text-white bg-slate-800 hover:bg-slate-700 border border-white/20 shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
                      >
                        Correct Punch Out
                      </button>
                    </>
                  )}
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
