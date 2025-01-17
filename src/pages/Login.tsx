import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoginForm from '../components/auth/LoginForm';
import ForgotPasswordForm from '../components/auth/ForgotPasswordForm';
import LearnMoreButton from '../components/shared/LearnMoreButton';
import ContactAdminButton from '../components/shared/ContactAdminButton';

export default function Login() {
  const { user } = useAuth();
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side with welcome text */}
      <div className="w-1/2 bg-yellow-400 p-12 flex flex-col justify-between relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center mb-16">
            <img 
              src="/images/labcesi-logo.jpg" 
              alt="Lab'CESI Logo" 
              className="w-24 h-auto"
            />
          </div>
          
          <div>
            <h1 className="text-[5rem] leading-tight font-extrabold text-white mb-4">
              Welcome to
            </h1>
            <h2 className="text-[5rem] leading-tight font-black text-black">
              FABLABs
            </h2>
            <p className="text-lg text-black/80 max-w-md mt-6">
              Manage and track CESI FABLAB's inventory in an efficient and user-friendly way. Log in to explore its features.
            </p>
          </div>
        </div>
        
        <div className="relative z-10 flex gap-4">
          <LearnMoreButton />
          <ContactAdminButton />
        </div>
      </div>

      {/* Right side with form */}
      <div className="w-1/2 bg-black p-12 flex flex-col justify-center">
        <div className="max-w-md w-full mx-auto bg-white rounded-lg p-8 shadow-lg">
          <h2 className="text-3xl font-bold text-black mb-2">Sign In</h2>
          <p className="text-gray-600 mb-8">
            Log in to access your account and manage the inventory.
          </p>
          
          {showForgotPassword ? (
            <ForgotPasswordForm onCancel={() => setShowForgotPassword(false)} />
          ) : (
            <LoginForm onForgotPassword={() => setShowForgotPassword(true)} />
          )}
          
          <p className="mt-6 text-center text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="text-yellow-400 hover:text-yellow-500">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}