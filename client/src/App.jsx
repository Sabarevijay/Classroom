import React from 'react'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import Login from './Pages/Login'
import Home from './Pages/Home'
import Register from './Pages/Register'
import {Toaster} from 'react-hot-toast'
import ClassStudents from './Pages/ClassStudents'
import UserLayout from './Layout/UserLayout'
import ClassAdmin from './Pages/ClassAdmin'
import ProtectedRoute from './Components/ProtectedRoute'
import AdminLayout from './Layout/AdminLayout'
import Addstudents from './Components/Addstudents'
import ArchivedClass from './Pages/ArchivedClass'
import Classwork from './Pages/Classwork'
import ClassworkUs from './Pages/ClassworkUs'

const App = () => {
  return (
    <BrowserRouter>
      <Toaster />
        <Routes>

        <Route path='/' element={<Login />} />
        <Route path='/register' element={<Register />} ></Route>
        

        {/* <Route path='/home' element={<UserLayout />} >
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
        </Route> */}

      <Route 
          path='/home' 
          element={
            <ProtectedRoute allowedRoles={['user', 'admin']}>
              <UserLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Home />} />
          <Route
            path='classstudents/:id'
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <ClassStudents />
              </ProtectedRoute>
            }
          />
           <Route path="classstudents/:id/classwork" element={<ClassworkUs />} /> 
        </Route>

         {/* Protect Admin Pages */}
         <Route 
          path='/admin' 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
         <Route path='archived' element={ 
          <ProtectedRoute allowedRoles={['admin']}>
                <ArchivedClass />
              </ProtectedRoute>}
               /> 

          <Route
            path='classadmin/:id'
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ClassAdmin />
              </ProtectedRoute>
            }
          />
          <Route path="classadmin/:id/addStudents" element={<Addstudents />} /> 
          <Route path="classadmin/:id/classwork" element={<Classwork />} /> 
        </Route>




        
        
           
        </Routes>    
    </BrowserRouter>
  )
}

export default App