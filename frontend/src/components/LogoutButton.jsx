import React from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { useNavigate } from 'react-router-dom'

const LogoutButton = ({children}) => {
  const navigate = useNavigate();
    const {logout} = useAuthStore();
    const onLogout = async() => {
        await logout();
      navigate('/');
    }

  return (
    <button className="btn btn-primary" onClick={onLogout}>{children}</button>
  )
}

export default LogoutButton