export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: 'student' | 'admin' | 'super_admin';
          full_name: string | null;
          student_id: string | null;
          department: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          role?: 'student' | 'admin' | 'super_admin';
          full_name?: string | null;
          student_id?: string | null;
          department?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          role?: 'student' | 'admin' | 'super_admin';
          full_name?: string | null;
          student_id?: string | null;
          department?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}