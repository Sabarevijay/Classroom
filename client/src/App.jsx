import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import Login from './Pages/Login';
import Home from './Pages/Home';
import Register from './Pages/Register';
import { Toaster } from 'react-hot-toast';
import ClassStudents from './Pages/ClassStudents';
import UserLayout from './Layout/UserLayout';
import ClassAdmin from './Pages/ClassAdmin';
import ProtectedRoute from './Components/ProtectedRoute';
import AdminLayout from './Layout/AdminLayout';
import Addstudents from './Components/Addstudents';
import ArchivedClass from './Pages/ArchivedClass';
import Classwork from './Pages/Classwork';
import ClassworkUs from './Pages/ClassworkUs';
import BootIntro from './Components/BootIntro';
import { useSelector } from 'react-redux';
import { BootIntroProvider, useBootIntro } from './context/BootIntroContext';
import { GoogleOAuthProvider } from '@react-oauth/google';

// Replace with your actual Google Client ID from your .env file
const GOOGLE_CLIENT_ID = import.meta.env.REACT_APP_GOOGLE_CLIENT_ID || "your-google-client-id-here";

const AppContent = () => {
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);
  const { showBootIntro, setShowBootIntro } = useBootIntro();
  const [hasBootIntroShown, setHasBootIntroShown] = useState(
    localStorage.getItem('hasBootIntroShown') === 'true'
  );

  useEffect(() => {
    const previousPath = sessionStorage.getItem('previousPath');
    const currentPath = location.pathname;

    sessionStorage.setItem('previousPath', currentPath);

    if (
      user &&
      previousPath === '/' &&
      !hasBootIntroShown &&
      currentPath !== '/' &&
      currentPath !== '/register'
    ) {
      console.log('Showing BootIntro'); // Debugging
      setShowBootIntro(true);
      document.body.style.overflow = 'hidden';
    }
  }, [location, user, hasBootIntroShown, setShowBootIntro]);

  const handleBootIntroComplete = () => {
    console.log('BootIntro Complete'); // Debugging
    setShowBootIntro(false);
    setHasBootIntroShown(true);
    localStorage.setItem('hasBootIntroShown', 'true');
  };

  useEffect(() => {
    if (location.pathname === '/') {
      setHasBootIntroShown(false);
      localStorage.removeItem('hasBootIntroShown');
    }
  }, [location]);

  return (
    <>
      {showBootIntro && <BootIntro onComplete={handleBootIntroComplete} />}
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/register' element={<Register />} />

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
          <Route 
            path='archived' 
            element={ 
              <ProtectedRoute allowedRoles={['admin']}>
                <ArchivedClass />
              </ProtectedRoute>
            } 
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
    </>
  );
};

const App = () => {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <BootIntroProvider>
          <Toaster />
          <AppContent />
        </BootIntroProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
};

export default App