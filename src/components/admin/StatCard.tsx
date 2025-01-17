import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  description?: string;
}

export default function StatCard({ title, value, icon: Icon, description }: StatCardProps) {
  return (
    <div className="bg-black text-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-white">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-yellow-400">{value}</p>
          {description && (
            <p className="mt-1 text-sm text-white">{description}</p>
          )}
        </div>
        <div className="p-3 bg-yellow-400 rounded-full">
          <Icon className="w-6 h-6 text-black" />
        </div>
      </div>
    </div>
  );
}