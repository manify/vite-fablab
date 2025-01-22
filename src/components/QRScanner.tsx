import { useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import toast from 'react-hot-toast';

export default function QRScanner() {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: { width: 250, height: 250 },
      fps: 5,
    }, false);

    scanner.render(async (decodedText) => {
      try {
        const response = await fetch(decodedText);
        if (!response.ok) throw new Error('Failed to borrow item');
        
        const data = await response.json();
        if (data.success) {
          toast.success('Item borrowed successfully');
          scanner.clear();
        } else {
          toast.error(data.message || 'Failed to borrow item');
        }
      } catch (error) {
        toast.error('Could not connect to server');
      }
    }, console.error);

    return () => {
      scanner.clear();
    };
  }, []);

  return <div id="reader" />;
}