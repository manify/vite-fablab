import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import AdminDashboard from './AdminDashboard';
import StudentDashboard from './StudentDashboard';
import SuperAdminDashboard from './SuperAdminDashboard';
import { isAdmin, isSuperAdmin } from '../utils/roleUtils';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Dashboard() {
  const { profile, loading } = useAuth();

  if (loading) return <LoadingSpinner />;
  
  if (isSuperAdmin(profile)) {
    return <SuperAdminDashboard />;
  }
  
  return isAdmin(profile) ? <AdminDashboard /> : <StudentDashboard />;
}