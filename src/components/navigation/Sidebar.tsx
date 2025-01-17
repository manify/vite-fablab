import React from 'react';
import { LayoutDashboard, Package, BookOpen, User } from 'lucide-react';
import NavLink from './NavLink';
import { useAuth } from '../../contexts/AuthContext';

export default function Sidebar() {
  const { profile } = useAuth();

  const navigation = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/inventory', icon: Package, label: 'Inventory' },
    { to: '/loans', icon: BookOpen, label: 'Loans' },
    { to: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto bg-black dark:bg-gray-900">
          <div className="flex items-center flex-shrink-0 px-4">
            <img 
              src="/images/labcesi-logo.jpg" 
              alt="Lab'CESI Logo" 
              className="w-18 h-auto"
            />
          </div>
          
          <div className="flex flex-col flex-grow mt-5">
            <nav className="flex-1 px-2 space-y-1">
              {navigation.map((item) => (
                <NavLink key={item.to} {...item} />
              ))}
            </nav>
            
            {profile && (
              <div className="flex-shrink-0 flex border-t border-yellow-400 p-4">
                <div className="flex items-center">
                  <div className="ml-3">
                    <p className="text-sm font-medium text-white">{profile.full_name}</p>
                    <p className="text-xs font-medium text-yellow-400 capitalize">{profile.role}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}