import React, { useState } from 'react'
import Login from './components/auth/Login'
import EmployeDashboard from './components/employee/EmployeDashboard'
import HrDashBoard from './components/hr/HrDashBoard'



const App = () => {
  const [user, setUser] = useState(null)

  const handleLogin = (email,password) => {
    if(email ==="admin@me.com" && password === "123"){
      setUser("admin")
    }else if(email === "user@us.com" && password === "123"){
      setUser("user")
    }
    else{
      alert("Invalid credentials")
    }
  }

  return (
    <div>
    {!user ? <Login handleLogin={handleLogin} /> : (user === "admin" ? <HrDashBoard/> : <EmployeDashboard/>)}
    </div>
  )
}

export default App
