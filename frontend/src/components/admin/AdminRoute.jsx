import React from 'react'
import { useAuthStore } from '../../store/useAuthStore'
import { Outlet } from 'react-router-dom'
import { Navigate } from 'react-router-dom'
import { Loader } from 'lucide-react'

const AdminRoute = () => {
    const {authUser, isCheckingAuth} = useAuthStore()

    if(isCheckingAuth){
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    )
  }

  if(!authUser || authUser.role !== "ADMIN"){
    return <Navigate to="/" />
  }

 return <Outlet />
}

export default AdminRoute