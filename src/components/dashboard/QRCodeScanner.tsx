import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { X } from 'lucide-react';

interface QRCodeScannerProps {
  onScan: (qrCode: string) => void;
  onClose: () => void;
}

export default function QRCodeScanner({ onScan, onClose }: QRCodeScannerProps) {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Create scanner instance
    const scanner = new Html5QrcodeScanner('qr-reader', {
      qrbox: {
        width: 250,
        height: 250,
      },
      fps: 5,
    }, false);

    // Start scanning
    scanner.render(
      (decodedText) => {
        scanner.clear();
        onScan(decodedText);
      },
      (errorMessage) => {
        setError(errorMessage);
      }
    );

    // Cleanup
    return () => {
      scanner.clear();
    };
  }, [onScan]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Scan QR Code</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div id="qr-reader" className="w-full"></div>

        {error && (
          <p className="mt-4 text-red-600 text-sm">{error}</p>
        )}

        <p className="mt-4 text-sm text-gray-500">
          Position the QR code within the frame to scan
        </p>
      </div>
    </div>
  );
}