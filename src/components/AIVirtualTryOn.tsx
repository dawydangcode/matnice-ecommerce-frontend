import React, { useState, useRef, useEffect } from 'react';
import ThreeJSOverlay from './ThreeJSOverlay';
import { X } from 'lucide-react';

// Declare global MediaPipe types
declare global {
  interface Window {
    FaceMesh: any;
    Camera: any;
  }
}

interface GlassesConfig {
  offsetX: number;
  offsetY: number;
  positionOffsetX: number;
  positionOffsetY: number;
  positionOffsetZ: number;
  initialScale: number;
}

interface AIVirtualTryOnProps {
  productName: string;
  model3dUrl: string;
  glassesConfig?: GlassesConfig;
  videoElement: HTMLVideoElement | null;
  isActive: boolean;
  onClose: () => void;
}

const AIVirtualTryOn: React.FC<AIVirtualTryOnProps> = ({
  productName,
  model3dUrl,
  glassesConfig,
  videoElement,
  isActive,
  onClose,
}) => {
  const [faceDetected, setFaceDetected] = useState(false);
  const [status, setStatus] = useState('Initializing...');
  const [currentLandmarks, setCurrentLandmarks] = useState<any[] | null>(null);
  const [model3dReady, setModel3dReady] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const faceMeshRef = useRef<any>(null);
  const cameraUtilsRef = useRef<any>(null);

  // Handle FaceMesh results
  const onFaceMeshResults = React.useCallback((results: any) => {
    if (!canvasRef.current || !videoElement) return;

    const canvasCtx = canvasRef.current.getContext('2d');
    if (!canvasCtx) return;

    const canvas = canvasRef.current;

    // Set canvas size to match video
    canvas.width = videoElement.videoWidth || 640;
    canvas.height = videoElement.videoHeight || 480;

    // Clear canvas
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

    // Update face detection status
    if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
      setFaceDetected(true);
      setCurrentLandmarks(results.multiFaceLandmarks[0]);
    } else {
      setFaceDetected(false);
      setCurrentLandmarks(null);
    }
  }, [videoElement]);

  // Initialize MediaPipe FaceMesh
  useEffect(() => {
    if (!isActive || !videoElement) return;

    const initializeFaceMesh = async () => {
      try {
        // Wait for MediaPipe to load
        let attempts = 0;
        const maxAttempts = 10;

        const checkAndInit = async () => {
          if (window.FaceMesh && window.Camera) {
            await setupFaceMesh();
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
      } catch (error) {
        console.error('Error initializing face mesh:', error);
        setStatus('Failed to initialize face tracking');
      }
    };

    const setupFaceMesh = async () => {
      try {
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
        if (videoElement && window.Camera) {
          const camera = new window.Camera(videoElement, {
            onFrame: async () => {
              if (faceMeshRef.current && videoElement) {
                await faceMeshRef.current.send({ image: videoElement });
              }
            },
            width: 640,
            height: 480
          });
          cameraUtilsRef.current = camera;

          await camera.start();
          setStatus('Face detection active');
          setModel3dReady(true);
        } else {
          throw new Error('Camera utils not available');
        }
      } catch (error) {
        console.error('Failed to setup face mesh:', error);
        setStatus('Face detection failed');
      }
    };

    initializeFaceMesh();

    // Cleanup
    return () => {
      if (cameraUtilsRef.current) {
        try {
          cameraUtilsRef.current.stop();
        } catch (error) {
          console.error('Error stopping camera utils:', error);
        }
      }
      faceMeshRef.current = null;
      cameraUtilsRef.current = null;
      setModel3dReady(false);
    };
  }, [isActive, videoElement, onFaceMeshResults]);

  if (!isActive) return null;

  return (
    <>
      {/* Product Info Header - Positioned above camera */}
      <div className="absolute top-0 left-0 right-0 z-30 bg-gradient-to-r from-blue-500 to-purple-600 p-3 flex items-center justify-between">
        <h3 className="text-white font-semibold text-sm sm:text-base">
          🥽 Virtual Try-On: {productName}
        </h3>
        <button
          onClick={onClose}
          className="text-white hover:bg-white/20 rounded-full p-1 transition-colors"
          aria-label="Close Virtual Try-On"
        >
          <X size={20} />
        </button>
      </div>

      {/* Canvas for landmarks - positioned over video */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
        style={{ transform: 'scaleX(-1)' }}
      />

      {/* 3D Overlay - positioned over video */}
      {model3dReady && faceDetected && (
        <ThreeJSOverlay
          faceLandmarks={currentLandmarks}
          canvasWidth={canvasRef.current?.width || 640}
          canvasHeight={canvasRef.current?.height || 480}
          videoElement={videoElement}
          modelPath={model3dUrl}
          glassesConfig={glassesConfig}
        />
      )}

      {/* Status Overlay */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30 bg-black/70 text-white px-4 py-2 rounded-full text-sm">
        {!faceDetected ? (
          <span className="text-yellow-300">⚠️ Position your face in frame</span>
        ) : (
          <span className="text-green-300">✓ Face detected - Try-On active</span>
        )}
      </div>

      {/* Loading Overlay */}
      {!model3dReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 z-30">
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p>{status}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default AIVirtualTryOn;
