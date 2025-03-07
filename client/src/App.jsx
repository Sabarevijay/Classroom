import React from 'react'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import AdminOTP from './Pages/AdminOTP'
import UserOTP from './Pages/UserOTP'
import Login from './Pages/Login'
import Home from './Pages/Home'
import Register from './Pages/Register'
import {Toaster} from 'react-hot-toast'
import ClassStudents from './Pages/ClassStudents'
import UserLayout from './Layout/UserLayout'
import ClassAdmin from './Pages/ClassAdmin'
import ProtectedRoute from './Components/ProtectedRoute'
import AdminLayout from './Layout/AdminLayout'

const App = () => {
  return (
    <BrowserRouter>
      <Toaster />
        <Routes>

        <Route path='/' element={<Login />} />
        <Route path='/register' element={<Register />} ></Route>

        <Route path='/home' element={<UserLayout />} >
        <Route index element={<Home />} />
        <Route
            path='classstudents/:id'
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <ClassStudents /> 
              </ProtectedRoute>
            }
          />
        </Route>
        
        <Route path='/admin' element={<AdminLayout />}>
          <Route
            path='classadmin/:id'
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ClassAdmin /> 
              </ProtectedRoute>
            }
          />
        </Route>
        
        
           
        </Routes>    
    </BrowserRouter>
  )
}

export default App
