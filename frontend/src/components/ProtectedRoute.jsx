import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
<<<<<<< HEAD
          <span className="text-sm text-slate-500 font-medium">Loading SkillSwap...</span>
=======
          <span className="text-sm text-slate-500 font-medium">Нэвтрэлт шалгаж байна…</span>
>>>>>>> 2a62fa6b7a13aa05662930812d05cb32d53c64e0
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
