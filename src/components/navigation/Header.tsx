import React, { useState } from 'react';
import { LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import ThemeToggle from '../shared/ThemeToggle';

export default function Header() {
  const { signOut, profile } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login', { replace: true });
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-black dark:bg-black border-b border-yellow-400">
      <div className="flex justify-between items-center px-6 py-3">
        {/* Hamburger Menu */}
        <button
          onClick={toggleMenu}
          className="text-white focus:outline-none md:hidden"
          aria-label="Toggle Menu"
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        <div className="flex items-center space-x-2">
          {/* Placeholder for Logo or Left-Aligned Content */}
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

      {/* Dropdown menu for mobile view */}
      {isMenuOpen && (
        <nav className="md:hidden bg-black text-white border-t border-yellow-400">
          <ul className="flex flex-col p-4 space-y-2">
            <li>
              <a href="/" className="block px-4 py-2 rounded-md hover:bg-yellow-400">
                Dashboard
              </a>
            </li>
            <li>
              <a href="/inventory" className="block px-4 py-2 rounded-md hover:bg-yellow-400">
                Inventory
              </a>
            </li>
            <li>
              <a href="/loans" className="block px-4 py-2 rounded-md hover:bg-yellow-400">
                Loans
              </a>
            </li>
            <li>
              <a href="/profile" className="block px-4 py-2 rounded-md hover:bg-yellow-400">
                Profile
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
