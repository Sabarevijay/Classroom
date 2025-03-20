import React from 'react'
import Navbar from '../Components/Navbar'
import { Outlet, useNavigate } from 'react-router-dom'
import Sidebar from '../Components/Sidebar'

const UserLayout = () => {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);
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

export default UserLayout
