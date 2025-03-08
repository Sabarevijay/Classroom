import React from 'react'
import {useSelector} from 'react-redux'
import { Outlet, useNavigate } from 'react-router-dom'
import Navbar from '../Components/Navbar'
import Sidebar from '../Components/Sidebar'

const AdminLayout = () => {
    const user =useSelector((state)=>state.auth.user)
    const navigate =useNavigate()
    useEffect(()=>{
        if (!user) {
          navigate('/')
        }
        else if(user.role !=='admin'){
            navigate('/')
        }
      })
  return (
    <div>
        <Navbar />
        <div className="flex">
            <Sidebar />
            <div className="flex-grow p-4">
                <Outlet />
            </div>
        </div>
      
    </div>
  )
}

export default AdminLayout
