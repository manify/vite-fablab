import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function SignupForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    studentId: '',
    department: '',
    firstCar: '',
    firstCountry: ''
  });

  const validateEmail = (email: string) => {
    const allowedDomains = ['viacesi.fr', 'cesi.fr'];
    const domain = email.split('@')[1];
    return allowedDomains.includes(domain);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (!validateEmail(formData.email)) {
        throw new Error('Only @viacesi.fr and @cesi.fr email addresses are allowed');
      }

      if (formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            student_id: formData.studentId || null,
            department: formData.department || null,
          },
        },
      });

      if (signUpError) throw signUpError;
      if (!data.user) throw new Error('No user data returned');

      // Store security questions
      const { error: securityError } = await supabase
        .from('security_questions')
        .insert([{
          user_id: data.user.id,
          first_car: formData.firstCar,
          first_country: formData.firstCountry
        }]);

      if (securityError) throw securityError;

      toast.success('Account created successfully! Please sign in.');
      navigate('/login');
    } catch (error) {
      console.error('Signup error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Full Name</label>
        <input
          type="text"
          required
          value={formData.fullName}
          onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
          className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-black focus:border-black"
          placeholder="John Doe"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          required
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-black focus:border-black"
          placeholder="you@viacesi.fr"
        />
        <p className="mt-1 text-sm text-gray-500">
          Only @viacesi.fr and @cesi.fr email addresses are allowed
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          required
          value={formData.password}
          onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
          className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-black focus:border-black"
          placeholder="••••••••"
          minLength={6}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
        <input
          type="password"
          required
          value={formData.confirmPassword}
          onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
          className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-black focus:border-black"
          placeholder="••••••••"
          minLength={6}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Student ID</label>
        <input
          type="text"
          required
          value={formData.studentId}
          onChange={(e) => setFormData(prev => ({ ...prev, studentId: e.target.value }))}
          className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-black focus:border-black"
          placeholder="e.g., STU123"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Department</label>
        <input
          type="text"
          required
          value={formData.department}
          onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
          className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-black focus:border-black"
          placeholder="e.g., Engineering"
        />
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Security Questions</h3>
        <p className="text-sm text-gray-500 mb-4">
          Please answer these security questions. You'll need these answers if you ever need to reset your password.
        </p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">What was your first car?</label>
            <input
              type="text"
              required
              value={formData.firstCar}
              onChange={(e) => setFormData(prev => ({ ...prev, firstCar: e.target.value }))}
              className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-black focus:border-black"
              placeholder="e.g., Toyota Corolla"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">What was the first country you traveled to?</label>
            <input
              type="text"
              required
              value={formData.firstCountry}
              onChange={(e) => setFormData(prev => ({ ...prev, firstCountry: e.target.value }))}
              className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-black focus:border-black"
              placeholder="e.g., Spain"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50"
      >
        {loading ? 'Creating account...' : 'Create account'}
      </button>
    </form>
  );
}