import React from 'react';
import { Mail } from 'lucide-react';

export default function ContactAdminButton() {
  const handleContact = () => {
    // Outlook-specific mailto protocol
    const outlookUrl = 'ms-outlook://compose?to=jbazzi@cesi.fr';
    
    // Try to open Outlook first
    window.location.href = outlookUrl;
    
    // Fallback to regular mailto after a short delay
    setTimeout(() => {
      window.location.href = 'mailto:jbazzi@cesi.fr';
    }, 100);
  };

  return (
    <button
      onClick={handleContact}
      className="inline-flex items-center px-6 py-3 bg-black hover:bg-yellow-400 text-yellow-400 hover:text-black rounded-lg font-medium transition-colors"
    >
      <Mail className="w-5 h-5 mr-2" />
      Contact Admin
    </button>
  );
}