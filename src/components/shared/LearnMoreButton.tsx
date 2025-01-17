import React from 'react';
import { generateLabCesiChartePDF } from '../../utils/pdfGenerator';
import { FileText } from 'lucide-react';

export default function LearnMoreButton() {
  const handleDownload = async () => {
    const doc = await generateLabCesiChartePDF();
    doc.save('charte-utilisation-labcesi.pdf');
  };

  return (
    <button
      onClick={handleDownload}
      className="inline-flex items-center px-6 py-3 bg-black hover:bg-yellow-400 text-yellow-400 hover:text-black rounded-lg font-medium transition-colors"
    >
      <FileText className="w-5 h-5 mr-2" />
      Learn More
    </button>
  );
}