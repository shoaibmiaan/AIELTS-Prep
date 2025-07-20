// src/components/ui/overlays/FullscreenOverlay.tsx

import React from 'react';

interface FullscreenOverlayProps {
  isVisible: boolean;
  onClose: () => void;
}

const FullscreenOverlay: React.FC<FullscreenOverlayProps> = ({ isVisible, onClose }) => {
  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div className="bg-white p-8 rounded-xl">
        <h2 className="text-2xl font-semibold">Fullscreen Overlay</h2>
        <p>This is a fullscreen overlay. Click outside to close it.</p>
        <button
          className="mt-4 p-2 bg-blue-500 text-white rounded"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export { FullscreenOverlay };
