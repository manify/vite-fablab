import React, { useState } from 'react'; // For React components and hooks
import Webcam from 'react-webcam'; // For webcam functionality
import { Camera, X } from 'lucide-react'; // Icons for camera and close button

interface ReturnModalProps {
    itemId: string; // The ID of the item being returned
    onClose: () => void; // Function to close the modal
    onCapture: (photo: string) => void; // Function to handle the captured photo
    isOpen: boolean; // To control the visibility of the modal
    onReturn: (photo: string) => void; // Function to handle the return action
}

export const ReturnModal: React.FC<ReturnModalProps> = ({
    isOpen,
    onClose,
    onReturn,
    onCapture,
    itemId,
}) => {
    const [returnPhoto, setReturnPhoto] = useState<string | null>(null);
    const webcamRef = React.useRef<Webcam>(null);

    const capturePhoto = () => {
        if (webcamRef.current) {
            const screenshot = webcamRef.current.getScreenshot();
            if (screenshot) {
                setReturnPhoto(screenshot);
                onCapture(screenshot);
            }
        }
    };

    const handleReturn = () => {
        if (returnPhoto) {
            onReturn(returnPhoto); // Pass the photo to the parent handler
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Return Item</h2>
                    <button onClick={onClose}>
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="space-y-4">
                    {!returnPhoto ? (
                        <div className="relative">
                            <Webcam
                                audio={false}
                                ref={webcamRef}
                                screenshotFormat="image/jpeg"
                                className="w-full rounded-lg"
                            />
                            <button
                                onClick={capturePhoto}
                                className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-2 rounded-full flex items-center space-x-2"
                            >
                                <Camera className="w-5 h-5" />
                                <span>Take Photo</span>
                            </button>
                        </div>
                    ) : (
                        <div className="relative">
                            <img src={returnPhoto} alt="Return" className="w-full rounded-lg" />
                            <button
                                onClick={() => setReturnPhoto(null)}
                                className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-2 rounded-full"
                            >
                                Retake Photo
                            </button>
                        </div>
                    )}

                    <div className="flex justify-end space-x-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-lg"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleReturn}
                            disabled={!returnPhoto}
                            className={`px-4 py-2 rounded-lg ${
                                returnPhoto
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                        >
                            Confirm Return
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};