import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles, children }) => {
  const user = useSelector((state) => state.auth.user);

  if (!user) {
    return <Navigate to='/' />; // Redirect to login if user is not authenticated
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to='/' />; // Redirect if user role is not allowed
  }

  return children ? children : <Outlet />; // Render the component if allowed
};

export default ProtectedRoute;