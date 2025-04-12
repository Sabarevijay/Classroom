import React, { useEffect, useState, Component } from 'react';
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
import QuizAdmin from './Pages/QuizAdmin';
import QuizUser from './Pages/QuizUser';
import { useSelector } from 'react-redux';
import { BootIntroProvider, useBootIntro } from './context/BootIntroContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { SidebarProvider } from './context/SidebarContext';
import StreamAdmin from './Pages/StreamAdmin';
import Students from './Pages/Students';
import Faculty from './Pages/Faculty';
import Mentor from './Pages/Mentor';
import Setting from './Pages/Setting';
import FacultyClass from './Pages/FacultyClass';

const GOOGLE_CLIENT_ID = import.meta.env.REACT_APP_GOOGLE_CLIENT_ID || "your-google-client-id-here";

// Error Boundary Component
class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h1>Something went wrong.</h1>
          <p>{this.state.error.message}</p>
          <button onClick={() => window.location.reload()}>Reload Page</button>
        </div>
      );
    }
    return this.props.children;
  }
}

const AppContent = () => {
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);
  const { showBootIntro, setShowBootIntro } = useBootIntro();
  const [hasBootIntroShown, setHasBootIntroShown] = useState(
    localStorage.getItem('hasBootIntroShown') === 'true'
  );

  useEffect(() => {
    console.log('Current path:', location.pathname, 'User:', user); // Debug
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
      console.log('Showing BootIntro');
      setShowBootIntro(true);
      document.body.style.overflow = 'hidden';
    }
  }, [location, user, hasBootIntroShown, setShowBootIntro]);

  const handleBootIntroComplete = () => {
    console.log('BootIntro Complete');
    setShowBootIntro(false);
    setHasBootIntroShown(true);
    localStorage.setItem('hasBootIntroShown', 'true');
    document.body.style.overflow = 'auto';
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
          <Route 
            path="classstudents/:id/quiz" 
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <QuizUser />
              </ProtectedRoute>
            } 
          />
        </Route>

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
            path='students' 
            element={ 
              <ProtectedRoute allowedRoles={['admin']}>
                <Students />
              </ProtectedRoute>
            } 
          />
          <Route 
            path='faculty' 
            element={ 
              <ProtectedRoute allowedRoles={['admin']}>
                <Faculty />
              </ProtectedRoute>
            } 
          />
          <Route 
            path='mentor' 
            element={ 
              <ProtectedRoute allowedRoles={['admin']}>
                <Mentor />
              </ProtectedRoute>
            } 
          />
          <Route 
            path='setting' 
            element={ 
              <ProtectedRoute allowedRoles={['admin']}>
                <Setting />
              </ProtectedRoute>
            } 
          />
          <Route 
            path='faculty/class/:classId' 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <FacultyClass />
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
          <Route path="classadmin/:id/stream" element={<StreamAdmin />} />
          <Route 
            path="classadmin/:id/quiz" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <QuizAdmin />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <SidebarProvider>
          <BootIntroProvider>
            <Toaster />
            <ErrorBoundary>
              <AppContent />
            </ErrorBoundary>
          </BootIntroProvider>
        </SidebarProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
};

export default App;