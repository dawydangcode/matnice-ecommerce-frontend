import React, { useState, useRef, useEffect } from 'react';
import '../styles/VirtualTryOnModal.css';

interface VirtualTryOnModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  model3dUrl?: string;
}

const VirtualTryOnModal: React.FC<VirtualTryOnModalProps> = ({
  isOpen,
  onClose,
  productName,
  model3dUrl
}) => {
  const [cameraActive, setCameraActive] = useState(false);
  const [selectedTint, setSelectedTint] = useState('Transparent');
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Lens tint options
  const tintOptions = [
    { name: 'Transparent', className: 'transparent' },
    { name: 'Grey', className: 'grey' },
    { name: 'Brown', className: 'brown' },
    { name: 'Green', className: 'green' },
    { name: 'Blue', className: 'blue' },
    { name: 'Pink', className: 'pink' }
  ];

  // Start camera when modal opens
  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const startCamera = async () => {
    try {
      console.log('Starting camera...');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        }
      });
      
      console.log('Camera stream obtained:', stream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setCameraActive(true);
        console.log('Camera active set to true');
        
        // Ensure video plays
        try {
          await videoRef.current.play();
          console.log('Video started playing');
        } catch (playError) {
          console.log('Auto-play prevented:', playError);
        }
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      // Show user-friendly error message
      alert('Cannot access camera. Please check your camera permissions and try again.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="virtual-tryon-modal-overlay">
      <div className="virtual-tryon-modal">
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">{productName}</h2>
          <button className="close-button" onClick={handleClose}>
            ×
          </button>
        </div>

        {/* Main Content */}
        <div className="modal-content">
          {/* Camera Section */}
          <div className="camera-section">
            <div className="camera-container">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`camera-video ${cameraActive ? 'active' : 'inactive'}`}
              />
              {!cameraActive && (
                <div className="camera-placeholder">
                  <div className="camera-icon">📷</div>
                  <p>Starting camera...</p>
                  <button onClick={startCamera} className="retry-camera-btn">
                    Retry Camera
                  </button>
                </div>
              )}
              
              {/* 3D Model Overlay - This would be where the 3D glasses model appears */}
              <div className="model-overlay">
                {/* Virtual glasses will be rendered here using Three.js or similar */}
              </div>

              {/* Camera Controls */}
              <div className="camera-controls">
                <button className="control-btn camera-btn" title="Take Photo">
                  📸
                </button>
                <button className="control-btn" title="Switch Camera">
                  🔄
                </button>
              </div>
            </div>
          </div>

          {/* Lens Tint Selection */}
          <div className="tint-section">
            <h3 className="section-title">SUNGLASSES TINT</h3>
            <div className="tint-options">
              {tintOptions.map((tint) => (
                <button
                  key={tint.name}
                  className={`tint-option ${tint.className} ${selectedTint === tint.name ? 'selected' : ''}`}
                  onClick={() => setSelectedTint(tint.name)}
                  title={tint.name}
                >
                  {tint.name === 'Transparent' && (
                    <span className="transparent-indicator">👓</span>
                  )}
                </button>
              ))}
            </div>
            <div className="tint-labels">
              <span>PHOTOCHROMIC LENS</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <div className="tech-badge">
            <span className="badge-icon">🤖</span>
            <span>3D</span>
            <span className="new-badge">NEW</span>
          </div>
          <p className="tech-description">
            Advanced AR technology for realistic virtual try-on experience
          </p>
        </div>
      </div>
    </div>
  );
};

export default VirtualTryOnModal;
