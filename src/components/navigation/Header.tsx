import React from 'react';
import { LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import ThemeToggle from '../shared/ThemeToggle';

export default function Header() {
  const { signOut, profile } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login', { replace: true });
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  return (
    <header className="bg-black dark:bg-black border-b border-yellow-400">
      <div className="flex justify-between items-center px-6 py-3">
        <div className="flex items-center space-x-2">
        
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <span className="text-white">Welcome, {profile?.full_name || 'User'}</span>
          <button
            onClick={handleSignOut}
            className="inline-flex items-center px-4 py-2 bg-yellow-400 text-black text-sm font-medium rounded-md hover:bg-yellow-500"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}