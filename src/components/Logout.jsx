import React from 'react'
import { useAuth } from '../security/AuthContext';

const Logout = () => {


  const authContext = useAuth()

  const handleLogout = async (event) => {
    event.preventDefault();
    authContext.logout();
  };


  return (
    <div>
        <button onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default Logout