import React from 'react';
import { Loan } from '../../types/database';
import { Package, User, BookOpen, School } from 'lucide-react';
import LoanStatus from './LoanStatus';

interface LoanCardProps {
  loan: Loan;
  onReturn?: (loan: Loan) => void;
}

export default function LoanCard({ loan, onReturn }: LoanCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <Package className="w-5 h-5 text-gray-500" />
              <h3 className="text-lg font-semibold text-gray-900">
                {loan.items?.name}
              </h3>
            </div>
            <div className="mt-1 flex items-center space-x-2 text-sm text-gray-600">
              <User className="w-4 h-4" />
              <span>borrowed by: {loan.borrower?.full_name}</span>
            </div>
          </div>
          
          <LoanStatus 
            status={loan.status}
            expectedReturnDate={loan.expected_return_date}
            actualReturnDate={loan.actual_return_date}
          />
        </div>

        {loan.project_name && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <BookOpen className="w-4 h-4" />
            <span>Project: {loan.project_name}</span>
          </div>
        )}

        {loan.course_details && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <School className="w-4 h-4" />
            <span>Course: {loan.course_details}</span>
          </div>
        )}

        {loan.status === 'active' && onReturn && (
          <button
            onClick={() => onReturn(loan)}
            className="mt-4 w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Return Item
          </button>
        )}
      </div>
    </div>
  );
}