import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';

interface NavLinkProps {
  to: string;
  icon: LucideIcon;
  label: string;
}

export default function NavLink({ to, icon: Icon, label }: NavLinkProps) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
        isActive
          ? 'bg-yellow-400 text-black'
          : 'text-gray-300 hover:bg-yellow-400 hover:text-black'
      }`}
    >
      <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-black' : 'text-gray-300'}`} />
      {label}
    </Link>
  );
}