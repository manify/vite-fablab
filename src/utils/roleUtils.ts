import { Profile } from '../types/database';

export const isAdmin = (profile: Profile | null): boolean => {
  return profile?.role === 'admin' || profile?.role === 'super_admin';
};

export const isSuperAdmin = (profile: Profile | null): boolean => {
  return profile?.role === 'super_admin';
};

export const isStudent = (profile: Profile | null): boolean => {
  return profile?.role === 'student';
};