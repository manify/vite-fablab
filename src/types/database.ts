export type UserRole = 'student' | 'admin' | 'super_admin';
export type ItemStatus = 'available' | 'borrowed' | 'maintenance' | 'lost';
export type NotificationType = 'due_date' | 'overdue' | 'return_reminder' | 'system';

export interface SecurityQuestions {
  id: string;
  user_id: string;
  first_car: string;
  first_country: string;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  role: UserRole;
  full_name: string | null;
  student_id: string | null;
  department: string | null;
  created_at: string;
  updated_at: string;
  avatar_url: string | null;
}

export interface Item {
  total_quantity: number;
  id: string;
  name: string;
  description: string | null;
  category_id: string;
  qr_code: string;
  barcode: string; 
  status: ItemStatus;
  condition: string | null;
  location: string | null;
  created_at: string;
  updated_at: string;
  categories?: {
    id(id: any): boolean;
    name: string;
  };
  quantity: number;
}

export interface Loan {
  [x: string]: any;
  id: string;
  item_id: string;
  borrower_id: string;
  approved_by: string | null;
  borrow_date: string;
  expected_return_date: string;
  actual_return_date: string | null;
  project_name: string | null;
  course_details: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  items?: {
    name: string;
  };
  borrower?: {
    full_name: string;
  };
  approver?: {
    full_name: string;
  };
}