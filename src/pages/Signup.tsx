import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import SignupForm from '../components/auth/SignupForm';
import LearnMoreButton from '../components/shared/LearnMoreButton';
import ContactAdminButton from '../components/shared/ContactAdminButton';

export default function Signup() {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side with yellow background */}
      <div className="w-1/2 bg-yellow-400 p-12 flex flex-col justify-between">
        <div>
          <div className="flex items-center mb-16">
            <img 
              src="/images/labcesi-logo.jpg" 
              alt="Lab'CESI Logo" 
              className="w-24 h-auto"
            />
          </div>
          
          <div>
            <h1 className="text-4xl font-bold mb-4">Join FABLAB Inventory</h1>
            <p className="text-lg text-black/80 max-w-md">
              Create an account to start managing and tracking equipment at CESI FABLAB.
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <LearnMoreButton />
          <ContactAdminButton />
        </div>
      </div>

      {/* Right side with signup form */}
      <div className="w-1/2 bg-black p-12 flex flex-col justify-center">
        <div className="max-w-md w-full mx-auto bg-white rounded-lg p-8 shadow-lg">
          <h2 className="text-3xl font-bold text-black mb-2">Create Account</h2>
          <p className="text-gray-600 mb-8">
            Sign up to access the inventory system
          </p>
          
          <SignupForm />
          
          <p className="mt-6 text-center text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-yellow-400 hover:text-yellow-500">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}