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
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (data: Partial<Profile>) => {
    try {
      if (!profile?.id) throw new Error('Profile ID not found');

      const { error: updateError } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', profile.id);

      if (updateError) throw updateError;

      await refetch();
      toast.success('Profile updated successfully');
    } catch (err) {
      console.error('Update error:', err);
      toast.error('Failed to update profile');
    }
  };

  const handleUpload = async (file: File) => {
    try {
      if (!profile?.id) throw new Error('Profile ID not found');
      setUploading(true);

      // Simple file validation
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size must be less than 5MB');
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;

      // Upload file
      const { error: uploadError } = await supabase.storage
        .from('profile-pictures')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get URL
      const { data } = supabase.storage
        .from('profile-pictures')
        .getPublicUrl(fileName);

      if (data?.publicUrl) {
        // Update profile with new URL
        await supabase
          .from('profiles')
          .update({ avatar_url: data.publicUrl })
          .eq('id', profile.id);

        await refetch();
        toast.success('Profile picture updated successfully');
      }
    } catch (err) {
      console.error('Upload error:', err);
      toast.error('Failed to upload profile picture');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="flex justify-center p-8">Loading...</div>;
  if (error) return <div className="text-red-500 p-8">Error: {error}</div>;
  if (!profile) return <div className="text-gray-500 p-8">No profile found</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <ProfileInfo
        profile={profile}
        onEdit={() => setShowForm(true)}
        onUpload={handleUpload}
        uploading={uploading}
      />

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