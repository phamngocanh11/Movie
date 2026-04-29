import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated, getUserSingleInfo } from "../../utils/auth";

const ProtectedRoute = () => {
  const authenticated = isAuthenticated();
  
  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }
  
  const userRole = getUserSingleInfo("role");
  
  if (userRole !== "admin") {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return <Outlet />;
};

export default ProtectedRoute; 