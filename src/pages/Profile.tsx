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
        .eq('id', profile.id)
        .single();

      if (updateError) throw new Error(`Failed to update profile: ${updateError.message}`);
      await refetch();
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update profile');
    }
  };

  const handleUpload = async (file: File) => {
    try {
      if (!profile?.id) throw new Error('Profile ID not found');
      setUploading(true);

      if (!file.type.match(/^image\/(jpeg|png|gif|webp)$/) || file.size > 5 * 1024 * 1024) {
        toast.error('Invalid file. Use JPEG, PNG, GIF, or WebP under 5MB.');
        setUploading(false);
        return;
      }

      const fileExt = file.type.split('/')[1];
      const cleanFileName = `${profile.id.replace(/-/g, '')}_${Date.now()}.${fileExt}`;
      const fileBlob = new Blob([await file.arrayBuffer()], { type: file.type });

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('profile-pictures')
        .upload(cleanFileName, fileBlob, { cacheControl: '3600', upsert: true });

      if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);
      const { data: urlData } = supabase.storage
        .from('profile-pictures')
        .getPublicUrl(uploadData.path);

      if (!urlData?.publicUrl) throw new Error('Failed to get public URL');
      await handleSubmit({ avatar_url: urlData.publicUrl });
      toast.success('Profile picture updated successfully');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to upload profile picture');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="flex justify-center p-8">Loading...</div>;
  if (error) return <div className="text-red-600 p-8">Error: {error}</div>;
  if (!profile) return <div className="text-gray-500 p-8">No profile found</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4 mb-6">
        
        <h1 className="text-2xl font-bold text-yellow-400">Profile Management</h1>
      </div>

      <div className="bg-black text-white rounded-lg shadow-md p-6">
        <ProfileInfo
          profile={profile}
          onEdit={() => setShowForm(true)}
          onUpload={handleUpload}
          uploading={uploading}
        />
      </div>

      {showForm && (
        <div className="bg-gray-800 text-white rounded-lg shadow-md p-6 mt-6">
          <ProfileForm
            profile={profile}
            onSubmit={handleSubmit}
            onClose={() => setShowForm(false)}
          />
        </div>
      )}
    </div>
  );
}
