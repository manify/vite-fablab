import React from 'react';
import { Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { format, isPast } from 'date-fns';

interface LoanStatusProps {
  status: string;
  expectedReturnDate: string;
  actualReturnDate?: string | null;
}

export default function LoanStatus({ status, expectedReturnDate, actualReturnDate }: LoanStatusProps) {
  const isOverdue = status === 'active' && isPast(new Date(expectedReturnDate));
  
  return (
    <div className="flex items-center space-x-2">
      {status === 'active' ? (
        isOverdue ? (
          <AlertCircle className="w-4 h-4 text-red-500" />
        ) : (
          <Clock className="w-4 h-4 text-blue-500" />
        )
      ) : (
        <CheckCircle className="w-4 h-4 text-green-500" />
      )}
      
      <span className={`text-sm font-medium ${
        status === 'active' 
          ? isOverdue 
            ? 'text-red-700'
            : 'text-blue-700'
          : 'text-green-700'
      }`}>
        {status === 'active' 
          ? isOverdue 
            ? 'Overdue'
            : 'Active'
          : 'Returned'}
      </span>
      
      <span className="text-sm text-gray-500">
        {status === 'active' 
          ? `Due: ${format(new Date(expectedReturnDate), 'MMM d, yyyy')}`
          : `Returned: ${format(new Date(actualReturnDate!), 'MMM d, yyyy')}`}
      </span>
    </div>
  );
}