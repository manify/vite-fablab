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

      if (updateError) {
        console.error('Update error:', updateError);
        throw new Error(`Failed to update profile: ${updateError.message}`);
      }

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

      console.log('Starting upload process for file:', {
        name: file.name,
        type: file.type,
        size: file.size,
      });

      // File validation
      if (!file.type.match(/^image\/(jpeg|png|gif|webp)$/)) {
        toast.error('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
        setUploading(false);
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        setUploading(false);
        return;
      }

      const fileExt = file.type.split('/')[1];
      const cleanFileName = `${profile.id.replace(/-/g, '')}_${Date.now()}.${fileExt}`;

      const fileBlob = new Blob([await file.arrayBuffer()], { type: file.type });

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('profile-pictures')
        .upload(cleanFileName, fileBlob, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) {
        console.error('Upload error details:', uploadError);
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      if (!uploadData?.path) {
        throw new Error('Upload succeeded but no path returned');
      }

      const { data: urlData } = supabase.storage
        .from('profile-pictures')
        .getPublicUrl(uploadData.path);

      if (!urlData?.publicUrl) {
        throw new Error('Failed to get public URL');
      }

      await handleSubmit({ avatar_url: urlData.publicUrl });
      toast.success('Profile picture updated successfully');
    } catch (err) {
      console.error('Upload error:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to upload profile picture');
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
