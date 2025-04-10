import { useEffect, useRef, useState } from 'react';
import Quagga from 'quagga';

interface BarcodeScannerProps {
  onDetected: (code: string) => void;
}

export default function BarcodeScanner({ onDetected }: BarcodeScannerProps) {
  const scannerRef = useRef<HTMLDivElement>(null);
  const [scanning, setScanning] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const [manualEntry, setManualEntry] = useState(false);
  const [manualCode, setManualCode] = useState('');

  useEffect(() => {
    return () => {
      if (scanning) {
        Quagga.stop();
      }
    };
  }, [scanning]);

  const startScanner = () => {
    if (scannerRef.current) {
      setCameraError(false);
      setScanning(true);
      
      Quagga.init({
        inputStream: {
          name: "Live",
          type: "LiveStream",
          target: scannerRef.current,
          constraints: {
            facingMode: "environment",
          },
        },
        decoder: {
          readers: [
            "ean_reader",
            "code_128_reader",
            "code_39_reader",
            "code_93_reader",
            "upc_reader",
            "upc_e_reader",
          ],
        },
      }, (err) => {
        if (err) {
          console.error("Error starting Quagga:", err);
          setCameraError(true);
          setScanning(false);
          return;
        }
        
        Quagga.start();
        
        Quagga.onDetected((result) => {
          if (result && result.codeResult) {
            Quagga.stop();
            setScanning(false);
            onDetected(result.codeResult.code!);
          }
        });
      });
    }
  };

  const stopScanner = () => {
    if (scanning) {
      Quagga.stop();
      setScanning(false);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualCode.trim()) {
      onDetected(manualCode.trim());
      setManualCode('');
      setManualEntry(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-4 py-3 bg-primary-800 text-white border-b border-primary-900">
        <h3 className="font-semibold">Barcode Scanner</h3>
      </div>
      <div className="p-4 flex flex-col items-center">
        {!manualEntry ? (
          <>
            <div className="mb-4 w-full max-w-lg aspect-video bg-gray-100 rounded relative overflow-hidden">
              {scanning ? (
                <div ref={scannerRef} className="absolute inset-0">
                  {/* Quagga will insert the video here */}
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-900">
                  {cameraError ? (
                    <div className="text-center p-4 text-white">
                      <p className="mb-2"><i className="ri-error-warning-line text-2xl text-red-500"></i></p>
                      <p>Camera access is required to scan barcodes</p>
                      <p className="text-sm mt-2">Please check your camera permissions</p>
                    </div>
                  ) : (
                    <div className="text-center p-4 text-white">
                      <p><i className="ri-barcode-line text-5xl mb-2"></i></p>
                      <p>Camera preview will appear here</p>
                    </div>
                  )}
                </div>
              )}
              
              {/* Scan overlay */}
              {scanning && (
                <>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-3/4 h-1/3 border-2 border-primary-500 rounded-lg"></div>
                  </div>
                  <div className="absolute inset-x-0 top-0 h-1 bg-primary-500 animate-pulse"></div>
                </>
              )}
            </div>
            <p className="text-gray-500 mb-6">
              {scanning 
                ? "Position barcode within the frame to scan" 
                : "Start scanner to scan a barcode"}
            </p>
            <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
              <button 
                className="flex items-center justify-center py-3 bg-primary-700 text-white rounded-md hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                onClick={scanning ? stopScanner : startScanner}
              >
                <i className={`${scanning ? "ri-stop-line" : "ri-barcode-line"} mr-2`}></i> 
                {scanning ? "Stop Scanner" : "Start Scanner"}
              </button>
              <button 
                className="flex items-center justify-center py-3 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                onClick={() => setManualEntry(true)}
              >
                <i className="ri-keyboard-box-line mr-2"></i> Enter Manually
              </button>
            </div>
          </>
        ) : (
          <div className="w-full max-w-lg">
            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Enter Barcode / SKU
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g. 123456789012"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="submit"
                  className="py-3 bg-primary-700 text-white rounded-md hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <i className="ri-check-line mr-2"></i> Submit
                </button>
                <button
                  type="button"
                  className="py-3 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  onClick={() => setManualEntry(false)}
                >
                  <i className="ri-arrow-left-line mr-2"></i> Back to Scanner
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
