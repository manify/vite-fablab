import React, { useState } from 'react';
import { useProfile } from '../hooks/useProfile';
import ProfileInfo from '../components/profile/ProfileInfo';
import ProfileForm from '../components/profile/ProfileForm';
import { supabase } from '../lib/supabase';
import { Profile } from '../types/database';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { profile, loading, error, refetch } = useProfile();
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (data: Partial<Profile>) => {
    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', profile!.id);

      if (updateError) throw updateError;
      
      toast.success('Profile updated successfully');
      refetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update profile');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!profile) return <div>No profile found</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <ProfileInfo profile={profile} onEdit={() => setShowForm(true)} />
      
      {showForm && (
        <ProfileForm
          profile={profile}
          onSubmit={handleSubmit}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}