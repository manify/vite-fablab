import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import AdminInventory from './AdminInventory';
import StudentInventory from './StudentInventory';
import { isAdmin } from '../utils/roleUtils';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Inventory() {
  const { profile, loading } = useAuth();

  if (loading) return <LoadingSpinner />;
  
  return isAdmin(profile) ? <AdminInventory /> : <StudentInventory />;
}