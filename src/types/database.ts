export type UserRole = 'student' | 'admin' | 'super_admin';
export type ItemStatus = 'available' | 'borrowed' | 'maintenance' | 'lost' | 'unavailable';
export type NotificationType = 'borrow_request' | 'overdue' | 'return_reminder' | 'system';



export interface Profile {
  id: string;
  role: UserRole;
  full_name: string | null;
  student_id: string | null;
  department: string | null;
  created_at: string;
  updated_at: string;
}

export interface Item {
  id: string;
  name: string;
  description: string | null;
  category_id: string;
  qr_code: string;
  status: ItemStatus;
  condition: string | null;
  location: string | null;
  quantity: number;
  created_at: string;
  updated_at: string;
  categories?: {
    name: string;
  };
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

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  loan_id?: string;
  loan?: Loan;
}

