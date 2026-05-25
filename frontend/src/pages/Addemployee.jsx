import React, { useState } from "react";

const AddEmployee = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    department: "",
    role: "",
    joiningDate: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Employee Data Submitted:", formData);
    alert("Employee added successfully!");
    // Clear form after submission
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      department: "",
      role: "",
      joiningDate: "",
    });
  };

  return (
    <div className="relative min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-10 font-sans z-0">
      {/* Subtle background decoration */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-teal-500/10 to-transparent -z-10 pointer-events-none"></div>

      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden flex flex-col md:flex-row relative z-10">
        
        {/* Left Side: Graphic / Info Panel */}
        <div className="bg-teal-600 p-10 text-white flex flex-col justify-between md:w-2/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-400 rounded-full filter blur-3xl opacity-30 transform translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-800 rounded-full filter blur-3xl opacity-40 transform -translate-x-1/2 translate-y-1/2 pointer-events-none"></div>
          
          <div className="relative z-10">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-sm border border-white/20 shadow-sm">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
            <h2 className="text-3xl font-extrabold mb-4 tracking-tight">Employee<br/>Onboarding</h2>
            <p className="text-teal-50 font-medium leading-relaxed opacity-90">
              Add a new member to the team. Fill in all the required personal and professional details below.
            </p>
          </div>
        </div>

        {/* Right Side: Registration Form */}
        <div className="p-8 md:p-12 md:w-3/5 bg-white">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2" htmlFor="firstName">First Name</label>
                <input type="text" id="firstName" value={formData.firstName} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all duration-300" placeholder="John" required />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2" htmlFor="lastName">Last Name</label>
                <input type="text" id="lastName" value={formData.lastName} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all duration-300" placeholder="Doe" required />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2" htmlFor="email">Email Address</label>
                <input type="email" id="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all duration-300" placeholder="john.doe@company.com" required />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2" htmlFor="phone">Phone Number</label>
                <input type="tel" id="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all duration-300" placeholder="+1 (555) 000-0000" required />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2" htmlFor="joiningDate">Joining Date</label>
                <input type="date" id="joiningDate" value={formData.joiningDate} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all duration-300" required />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2" htmlFor="department">Department</label>
                <select id="department" value={formData.department} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all duration-300" required>
                  <option value="" disabled>Select Department</option>
                  <option value="Java">Java</option>
                  <option value="Python">Python</option>
                  <option value="MERN">MERN</option>
                  <option value=".NET">.NET</option>
                  <option value="DevOps">DevOps</option>
                  <option value="Tester">Tester</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2" htmlFor="role">Role / Designation</label>
                <input type="text" id="role" value={formData.role} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all duration-300" placeholder="Software Engineer" required />
              </div>
            </div>

            <div className="pt-6">
              <button type="submit" className="w-full py-3.5 px-6 !rounded-xl font-bold text-white bg-teal-600 hover:bg-teal-700 shadow-[0_4px_14px_rgba(20,184,166,0.3)] hover:shadow-[0_6px_20px_rgba(20,184,166,0.4)] transform hover:-translate-y-0.5 transition-all duration-300 ease-in-out">
                Register Employee
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEmployee;
