import React from 'react';
import { supabase } from '../../lib/supabase';
import { Profile } from '../../types/database';
import toast from 'react-hot-toast';

interface RoleManagerProps {
  profile: Profile;
  onRoleUpdate: () => void;
}

export default function RoleManager({ profile, onRoleUpdate }: RoleManagerProps) {
  const handleRoleChange = async (newRole: 'student' | 'admin' | 'super_admin') => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', profile.id);

      if (error) throw error;
      
      toast.success('Role updated successfully');
      onRoleUpdate();
    } catch (err) {
      toast.error('Failed to update role');
      console.error('Error updating role:', err);
    }
  };

  return (
    <div className="mt-4">
      <label className="block text-sm font-medium text-gray-700">User Role</label>
      <select
        value={profile.role}
        onChange={(e) => handleRoleChange(e.target.value as 'student' | 'admin' | 'super_admin')}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      >
        <option value="student">Student</option>
        <option value="admin">Admin</option>
        <option value="super_admin">Super Admin</option>
      </select>
    </div>
  );
}