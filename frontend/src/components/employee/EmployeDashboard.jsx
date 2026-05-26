import React from 'react'
import Navbar from '../../others/Navbar'
import RequestToHr from '../../others/RequestToHr'
import PunchinViewProfile from '../../others/PunchinViewProfile'

const EmployeDashboard = () => {
  return (
    <div className="bg-slate-950 min-h-screen">
      <Navbar/>
      
      {/* Punch In and History Component */}
      <PunchinViewProfile/>
      
      {/* Leaves & Requests Component */}
      <RequestToHr/>
    </div>
  )
}

export default EmployeDashboard
