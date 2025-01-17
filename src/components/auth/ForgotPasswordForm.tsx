import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '../../lib/supabase';
import { Clock } from 'lucide-react';

export default function ForgotPasswordForm({ onCancel }: { onCancel: () => void }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Please enter your email');
      return;
    }

    // Validate email domain
    const domain = email.split('@')[1]?.toLowerCase();
    if (!domain || !['viacesi.fr', 'cesi.fr'].includes(domain)) {
      toast.error('Please use your @viacesi.fr or @cesi.fr email address');
      return;
    }

    if (cooldown) {
      toast.error(`Please wait ${cooldownTime} seconds before requesting another reset email`);
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.toLowerCase(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        if (error.status === 429) {
          // Extract wait time from error message
          const waitTime = parseInt(error.message.match(/\d+/)?.[0] || '60');
          setCooldownTime(waitTime);
          setCooldown(true);
          
          // Start countdown
          const interval = setInterval(() => {
            setCooldownTime((prev) => {
              if (prev <= 1) {
                clearInterval(interval);
                setCooldown(false);
                return 0;
              }
              return prev - 1;
            });
          }, 1000);

          throw new Error(`Please wait ${waitTime} seconds before requesting another reset email`);
        }
        throw error;
      }
      
      toast.success('Password reset instructions have been sent to your email');
      onCancel(); // Return to login
    } catch (error) {
      console.error('Password reset error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to send reset instructions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value.toLowerCase())}
          className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
          placeholder="your.name@viacesi.fr"
          disabled={cooldown}
        />
        <p className="mt-1 text-sm text-gray-500">
          Enter your @viacesi.fr or @cesi.fr email address
        </p>
      </div>

      {cooldown && (
        <div className="flex items-center gap-2 text-sm text-yellow-600 bg-yellow-50 p-3 rounded-md">
          <Clock className="w-4 h-4" />
          <span>Please wait {cooldownTime} seconds before trying again</span>
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading || cooldown}
          className="flex-1 bg-yellow-400 text-black py-2 px-4 rounded-md hover:bg-black hover:text-yellow-400 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Sending...' : cooldown ? `Wait ${cooldownTime}s` : 'Reset Password'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Back to Login
        </button>
      </div>
    </form>
  );
}