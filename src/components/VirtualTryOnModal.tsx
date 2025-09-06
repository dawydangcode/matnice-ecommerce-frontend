import React, { useState, useRef, useEffect } from 'react';
import '../styles/VirtualTryOnModal.css';
import ThreeJSOverlay from './ThreeJSOverlay';

// Declare global MediaPipe types
declare global {
  interface Window {
    FaceMesh: any;
    Camera: any;
  }
}

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
  const [faceDetected, setFaceDetected] = useState(false);
  const [status, setStatus] = useState('Initializing...');
  const [currentLandmarks, setCurrentLandmarks] = useState<any[] | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const faceMeshRef = useRef<any>(null);
  const cameraUtilsRef = useRef<any>(null);

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

  // Initialize FaceMesh when camera is active
  useEffect(() => {
    if (cameraActive && videoRef.current) {
      const waitForMediaPipeAndInitialize = async () => {
        let attempts = 0;
        const maxAttempts = 10; // Try for 10 seconds
        
        const checkAndInit = async () => {
          if (window.FaceMesh && window.Camera) {
            await initializeFaceMesh();
            return;
          }
          
          attempts++;
          if (attempts < maxAttempts) {
            setStatus(`Loading MediaPipe... (${attempts}/${maxAttempts})`);
            setTimeout(checkAndInit, 1000);
          } else {
            setStatus('MediaPipe failed to load. Please refresh the page.');
          }
        };
        
        await checkAndInit();
      };

      const timer = setTimeout(() => {
        waitForMediaPipeAndInitialize();
      }, 1000); // Delay to ensure camera stream is stable

      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cameraActive]);

  // Cleanup function to stop camera and FaceMesh
  useEffect(() => {
    return () => {
      if (cameraUtilsRef.current) {
        try {
          cameraUtilsRef.current.stop();
        } catch (error) {
          console.error('Error stopping camera:', error);
        }
      }
    };
  }, []);

  // Update canvas size when video loads or resizes
  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (!video || !canvas) return;

    const updateCanvasSize = () => {
      const rect = video.getBoundingClientRect();
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
    };

    // Update on video load
    video.addEventListener('loadedmetadata', updateCanvasSize);
    video.addEventListener('resize', updateCanvasSize);
    
    // Update on window resize
    window.addEventListener('resize', updateCanvasSize);
    
    // Initial update
    if (video.videoWidth && video.videoHeight) {
      updateCanvasSize();
    }

    return () => {
      video.removeEventListener('loadedmetadata', updateCanvasSize);
      video.removeEventListener('resize', updateCanvasSize);
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, [cameraActive]);  // Initialize MediaPipe FaceMesh
  const initializeFaceMesh = async () => {
    try {
      setStatus('Loading face detection...');
      
      // Check if MediaPipe is loaded
      if (!window.FaceMesh) {
        throw new Error('MediaPipe not loaded. Please refresh the page.');
      }
      
      const faceMesh = new window.FaceMesh({
        locateFile: (file: string) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
        }
      });

      faceMesh.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      });

      faceMesh.onResults((results: any) => {
        onFaceMeshResults(results);
      });

      faceMeshRef.current = faceMesh;

      // Setup camera utils
      if (videoRef.current && window.Camera) {
        const camera = new window.Camera(videoRef.current, {
          onFrame: async () => {
            if (faceMeshRef.current && videoRef.current) {
              await faceMeshRef.current.send({ image: videoRef.current });
            }
          },
          width: 640,
          height: 480
        });
        cameraUtilsRef.current = camera;

        await camera.start();
        setStatus('Face detection active');
      } else {
        throw new Error('Camera utils not available');
      }

    } catch (error) {
      console.error('Failed to initialize face detection:', error);
      setStatus('Face detection failed');
    }
  };

  // Handle FaceMesh results
  const onFaceMeshResults = (results: any) => {
    if (!canvasRef.current || !videoRef.current) return;

    const canvasCtx = canvasRef.current.getContext('2d');
    if (!canvasCtx) return;

    // Get actual video display dimensions
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Set canvas size to match video's actual displayed size
    const rect = video.getBoundingClientRect();
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    
    // Set canvas CSS size to match video display size
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    // Clear canvas
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

    if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
      setFaceDetected(true);
      setStatus('Face detected');
      
      const landmarks = results.multiFaceLandmarks[0];
      setCurrentLandmarks(landmarks); // Store landmarks for 3D overlay
      drawFaceMesh(canvasCtx, landmarks);
    } else {
      setFaceDetected(false);
      setCurrentLandmarks(null);
      setStatus('Looking for face...');
    }
  };

  // Draw face mesh
  const drawFaceMesh = (canvasCtx: CanvasRenderingContext2D, landmarks: any[]) => {
    if (!landmarks || landmarks.length === 0) return;

    const width = canvasCtx.canvas.width;
    const height = canvasCtx.canvas.height;

    // Draw all landmarks as small dots
    canvasCtx.fillStyle = 'rgba(255, 0, 0, 0.4)';
    landmarks.forEach((landmark) => {
      const x = landmark.x * width;
      const y = landmark.y * height;
      
      canvasCtx.beginPath();
      canvasCtx.arc(x, y, 0.5, 0, 2 * Math.PI);
      canvasCtx.fill();
    });

    // Highlight important landmarks for glasses
    const importantLandmarks = {
      leftEye: 33,      // Left eye outer corner
      rightEye: 362,    // Right eye outer corner
      noseTip: 1,       // Nose tip
      upperLip: 13,     // Upper lip center
      lowerLip: 14,     // Lower lip center
      leftMouth: 61,    // Left mouth corner
      rightMouth: 291,  // Right mouth corner
    };

    Object.entries(importantLandmarks).forEach(([name, index]) => {
      if (landmarks[index]) {
        const landmark = landmarks[index];
        const x = landmark.x * width;
        const y = landmark.y * height;
        
        if (name.includes('Eye')) {
          canvasCtx.fillStyle = '#00ff00';
        } else if (name.includes('Lip') || name.includes('Mouth')) {
          canvasCtx.fillStyle = '#ff00ff'; // Magenta for lips
        } else {
          canvasCtx.fillStyle = '#0000ff';
        }
        
        canvasCtx.beginPath();
        canvasCtx.arc(x, y, 3, 0, 2 * Math.PI);
        canvasCtx.fill();
        
        // Add label for important points
        canvasCtx.fillStyle = '#ffffff';
        canvasCtx.font = '10px Arial';
        canvasCtx.strokeStyle = '#000000';
        canvasCtx.lineWidth = 1;
        canvasCtx.strokeText(`${name}`, x + 5, y - 5);
        canvasCtx.fillText(`${name}`, x + 5, y - 5);
      }
    });

    // Draw mouth contour for better alignment checking
    const mouthIndices = [61, 84, 17, 314, 405, 320, 307, 375, 321, 308, 324, 318, 402, 317, 14, 87, 178, 88, 95, 78, 191, 80, 81, 82, 13, 312, 311, 310, 415, 308, 324, 318];
    
    canvasCtx.strokeStyle = 'rgba(255, 0, 255, 0.8)';
    canvasCtx.lineWidth = 1;
    canvasCtx.beginPath();
    
    mouthIndices.forEach((index, i) => {
      if (landmarks[index]) {
        const x = landmarks[index].x * width;
        const y = landmarks[index].y * height;
        
        if (i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }
      }
    });
    canvasCtx.stroke();

    // Draw connection lines between eyes for glasses reference
    if (landmarks[33] && landmarks[362]) {
      const leftEye = landmarks[33];
      const rightEye = landmarks[362];
      
      canvasCtx.strokeStyle = '#ffff00';
      canvasCtx.lineWidth = 2;
      canvasCtx.beginPath();
      canvasCtx.moveTo(leftEye.x * width, leftEye.y * height);
      canvasCtx.lineTo(rightEye.x * width, rightEye.y * height);
      canvasCtx.stroke();
    }

    // Draw face contour
    const faceOval = [10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109];
    
    canvasCtx.strokeStyle = 'rgba(0, 255, 255, 0.6)';
    canvasCtx.lineWidth = 1;
    canvasCtx.beginPath();
    
    faceOval.forEach((index, i) => {
      if (landmarks[index]) {
        const x = landmarks[index].x * width;
        const y = landmarks[index].y * height;
        
        if (i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }
      }
    });
    canvasCtx.closePath();
    canvasCtx.stroke();
  };

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
        <div className="modal-content-full">
          {/* Camera Section - Full Width */}
          <div className="camera-section-full">
            <div className="camera-container-large">
                      <div className="camera-container">
          <video 
            ref={videoRef} 
            autoPlay 
            muted
            playsInline
            className="video"
          />
          <canvas 
            ref={canvasRef}
            className="overlay"
          />
          <ThreeJSOverlay
            faceLandmarks={currentLandmarks}
            canvasWidth={canvasRef.current?.width || 640}
            canvasHeight={canvasRef.current?.height || 480}
            videoElement={videoRef.current}
          />
          <div className="status-panel">
            <div className={`status-indicator ${faceDetected ? 'detected' : ''}`}>
              {faceDetected ? '● Face Detected' : '○ Looking for face...'}
            </div>
            <div className="status-text">{status}</div>
          </div>
        </div>
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
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <div className="tech-badge">
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
