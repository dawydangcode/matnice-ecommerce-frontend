import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Video, RotateCcw, Play, Pause } from 'lucide-react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import '../../styles/Config3DPreview.css';

// Declare global MediaPipe types
declare global {
  interface Window {
    FaceMesh: any;
    Camera: any;
  }
}

interface GlassesConfig {
  offsetX: number;      // Center point adjustment for X axis
  offsetY: number;      // Center point adjustment for Y axis
  positionOffsetX: number; // Fine-tuning horizontal position
  positionOffsetY: number; // Fine-tuning vertical position
  positionOffsetZ: number; // Depth adjustment
  initialScale: number;    // Initial scale when loading model
  rotationSensitivity: number;
  yawLimit: number;
  pitchLimit: number;
}

interface Config3DPreviewProps {
  config: GlassesConfig;
  modelPath?: string;
  className?: string;
}

const Config3DPreview: React.FC<Config3DPreviewProps> = ({
  config,
  modelPath = '/assets/glasses/Untitled.glb',
  className = ''
}) => {
  const [isActive, setIsActive] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const [status, setStatus] = useState('Nhấn để bắt đầu');
  const [currentLandmarks, setCurrentLandmarks] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const faceMeshRef = useRef<any>(null);
  const cameraUtilsRef = useRef<any>(null);

  // Three.js refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraThreeRef = useRef<THREE.PerspectiveCamera | null>(null);
  const glassesRef = useRef<THREE.Group | null>(null);
  const animationIdRef = useRef<number | null>(null);

  // Default configuration - optimized for stable tracking with hardcoded optimal values
  const defaultConfig = useMemo(() => ({
    offsetX: 0.5,        // Centered horizontally  
    offsetY: 0.5,       // Slightly above center for eye level
    positionOffsetX: 0.4, // No additional horizontal offset
    positionOffsetY: 0.097, // Minimal vertical adjustment
    positionOffsetZ: -0.4, // Minimal depth adjustment
    initialScale: 0.16,    // Keep current size
    // These rotation settings are hardcoded for optimal results (not user-configurable)
    rotationSensitivity: 0.8, // Hardcoded optimal: roll=0.8, yaw=1.0, pitch=1.0
    yawLimit: 0.5,       // Hardcoded optimal: ±0.5 radians (~±28.6°)
    pitchLimit: 0.3      // Hardcoded optimal: ±0.3 radians (~±17.2°)
  }), []);

  const effectiveConfig = useMemo(() => {
    return { ...defaultConfig, ...config };
  }, [config, defaultConfig]);

  // Update glasses position immediately - no smoothing for instant response
  const updateGlassesPosition = useCallback((
    targetX: number, 
    targetY: number, 
    targetZ: number, 
    targetRotationX: number,
    targetRotationY: number, 
    targetRotationZ: number,
    targetScale: number
  ) => {
    if (!glassesRef.current) return;

    // Direct assignment - no interpolation for instant tracking
    glassesRef.current.position.set(targetX, targetY, targetZ);
    glassesRef.current.rotation.set(targetRotationX, targetRotationY, targetRotationZ);
    glassesRef.current.scale.set(targetScale, targetScale, targetScale);
  }, []);

  // Initialize Three.js scene
  const initializeThreeJS = useCallback(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup - adjust for better face tracking (same as ThreeJSOverlay)
    const camera = new THREE.PerspectiveCamera(
      50, // Reduced FOV for better perspective
      1, // Square aspect ratio for preview
      0.01, // Closer near plane
      10    // Closer far plane
    );
    camera.position.set(0, 0, 2); // Move camera back a bit
    cameraThreeRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true,
      antialias: true 
    });
    renderer.setSize(300, 300);
    renderer.setClearColor(0x000000, 0); // Transparent background
    renderer.domElement.className = 'config-3d-threejs-canvas';
    renderer.domElement.style.pointerEvents = 'none';

    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, 1, 1);
    scene.add(directionalLight);

    // Load glasses model
    const loader = new GLTFLoader();
    loader.load(
      modelPath,
      (gltf: any) => {
        const object = gltf.scene;
        
        // Create a group for the glasses
        const glassesGroup = new THREE.Group();
        
        object.traverse((child: any) => {
          if (child instanceof THREE.Mesh) {
            if (!child.material) {
              child.material = new THREE.MeshPhongMaterial({
                color: 0x333333,
                shininess: 100,
                transparent: false,
                opacity: 1.0
              });
            }
            child.visible = true;
          }
        });

        // Scale and position the glasses - use config values (same as ThreeJSOverlay)
        object.scale.set(effectiveConfig.initialScale, effectiveConfig.initialScale, effectiveConfig.initialScale);
        object.position.set(0, 0, 0);
        
        // Center the object at origin
        const box = new THREE.Box3().setFromObject(object);
        const center = box.getCenter(new THREE.Vector3());
        object.position.sub(center);
        
        glassesGroup.add(object);
        scene.add(glassesGroup);
        glassesRef.current = glassesGroup;

        console.log('3D Model loaded successfully for preview');
        console.log('Initial scale applied:', effectiveConfig.initialScale);
      },
      undefined,
      (error) => {
        console.error('Error loading 3D model for preview:', error);
        setError('Không thể tải model 3D');
      }
    );

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      
      if (rendererRef.current && sceneRef.current && cameraThreeRef.current) {
        rendererRef.current.render(sceneRef.current, cameraThreeRef.current);
      }
    };
    animate();

    // Cleanup
    return () => {
      if (containerRef.current && renderer.domElement && containerRef.current.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [modelPath, effectiveConfig.initialScale]);

  // Update glasses position based on face landmarks - improved from ThreeJSOverlay
  const updateGlassesWithLandmarks = useCallback(() => {
    if (!currentLandmarks || !glassesRef.current) return;

    // Use landmarks from working ThreeJSOverlay demo
    const middleBetweenEyes = currentLandmarks[168]; // Middle between eyes (main reference)
    const leftEye = currentLandmarks[143];           // Left eye
    const rightEye = currentLandmarks[372];          // Right eye
    const bottomOfNose = currentLandmarks[2];        // Bottom of nose
    const leftEar = currentLandmarks[234];           // Left ear
    const rightEar = currentLandmarks[454];          // Right ear
    
    if (!middleBetweenEyes || !leftEye || !rightEye || !bottomOfNose || !leftEar || !rightEar) return;

    // Use middleBetweenEyes as main center, with adjustment for glasses position
    const centerX = middleBetweenEyes.x;
    const centerY = (middleBetweenEyes.y + leftEye.y + rightEye.y) / 3 + 0.04; // Lower glasses slightly
    const centerZ = middleBetweenEyes.z;

    // Convert normalized coordinates to world coordinates (flip X for camera mirror)
    // Reduced multipliers for more precise tracking
    const worldX = -(centerX - 0.5) * 4;  // Reduced from 8 to 4
    const worldY = -(centerY - 0.5) * 3;  // Reduced from 6 to 3
    const worldZ = centerZ * 2;           // Reduced from 6 to 2

    // Calculate scale based on eye distance (like in working demo)
    const eyeDistance = Math.hypot(
      (rightEye.x - leftEye.x) * 640,
      (rightEye.y - leftEye.y) * 480
    );
    const targetScale = (eyeDistance / 80) * 0.6; // From working demo

    // Calculate more comprehensive rotation based on multiple landmarks
    // HARDCODED OPTIMAL VALUES: These values are proven to work well in ThreeJSOverlay
    // Better than user configuration - provides stable, natural-looking tracking
    
    // Z rotation (roll) - based on eye alignment 
    const rollAngleRaw = Math.atan2(rightEye.y - leftEye.y, rightEye.x - leftEye.x);
    const rollAngle = rollAngleRaw * 0.8; // HARDCODED: 0.8 sensitivity for natural head tilt
    
    // Y rotation (yaw) - head turn left/right based on nose position relative to eyes
    const noseCenterX = (leftEye.x + rightEye.x) / 2;
    const noseOffsetRaw = bottomOfNose.x - noseCenterX;
    const yawAngleRaw = noseOffsetRaw * 1.0; // HARDCODED: 1.0 sensitivity for head turning
    // HARDCODED LIMIT: Prevents over-rotation for stable tracking
    const yawAngle = Math.max(-0.5, Math.min(0.5, yawAngleRaw)); // ±0.5 rad = ±28.6° limit
    
    // X rotation (pitch) - head tilt up/down based on nose position relative to eyes  
    const eyeCenterY = (leftEye.y + rightEye.y) / 2;
    const noseOffsetYRaw = bottomOfNose.y - eyeCenterY;
    const pitchAngleRaw = noseOffsetYRaw * 1.0; // HARDCODED: 1.0 sensitivity for head nodding
    // HARDCODED LIMIT: Prevents extreme up/down tilts
    const pitchAngle = Math.max(-0.3, Math.min(0.3, pitchAngleRaw)); // ±0.3 rad = ±17.2° limit

    // Apply config adjustments
    const targetX = worldX + effectiveConfig.positionOffsetX;
    const targetY = worldY + effectiveConfig.positionOffsetY;
    const targetZ = worldZ + effectiveConfig.positionOffsetZ;
    const finalScale = targetScale * (effectiveConfig.initialScale / 0.06); // Scale relative to default
    
    // Debug log for rotation values (occasional logging to avoid spam)
    if (Math.random() < 0.02) { // Log 2% of the time
      console.log('Config3DPreview Rotation Values:', {
        rollRaw: (rollAngleRaw * 180 / Math.PI).toFixed(1) + '°',
        rollFinal: (rollAngle * 180 / Math.PI).toFixed(1) + '°',
        yawRaw: (yawAngleRaw * 180 / Math.PI).toFixed(1) + '°', 
        yawFinal: (yawAngle * 180 / Math.PI).toFixed(1) + '°',
        pitchRaw: (pitchAngleRaw * 180 / Math.PI).toFixed(1) + '°',
        pitchFinal: (pitchAngle * 180 / Math.PI).toFixed(1) + '°',
        scale: finalScale.toFixed(3)
      });
    }
      
    // Update position using the callback function
    updateGlassesPosition(targetX, targetY, targetZ, pitchAngle, yawAngle, rollAngle, finalScale);
    
    // Make sure glasses are visible
    glassesRef.current.visible = true;
  }, [currentLandmarks, effectiveConfig, updateGlassesPosition]);

  // Initialize FaceMesh
  const initializeFaceMesh = useCallback(async () => {
    try {
      setStatus('Đang khởi tạo face detection...');
      
      if (!window.FaceMesh) {
        throw new Error('MediaPipe chưa được tải');
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
        if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
          const landmarks = results.multiFaceLandmarks[0];
          setFaceDetected(true);
          setCurrentLandmarks(landmarks);
          setStatus('Phát hiện khuôn mặt - Đang hiển thị model 3D');
          
          // Immediately update glasses position if glasses are loaded
          if (glassesRef.current) {
            // Use the same landmarks processing as ThreeJSOverlay
            setTimeout(() => {
              updateGlassesWithLandmarks();
            }, 0);
          }
        } else {
          setFaceDetected(false);
          setCurrentLandmarks(null);
          setStatus('Đang tìm khuôn mặt...');
        }
      });

      faceMeshRef.current = faceMesh;

      if (videoRef.current && window.Camera) {
        const camera = new window.Camera(videoRef.current, {
          onFrame: async () => {
            if (faceMeshRef.current && videoRef.current) {
              await faceMeshRef.current.send({ image: videoRef.current });
            }
          },
          width: 300,
          height: 300
        });
        cameraUtilsRef.current = camera;
        await camera.start();
      }
    } catch (error) {
      console.error('Failed to initialize face detection:', error);
      setStatus('Lỗi khởi tạo face detection');
      setError('Không thể khởi tạo face detection');
    }
  }, [updateGlassesWithLandmarks]);

  // Start camera
  const startCamera = useCallback(async () => {
    try {
      setStatus('Đang khởi động camera...');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 300 },
          height: { ideal: 300 },
          facingMode: 'user'
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        
        await videoRef.current.play();
        
        // Initialize FaceMesh after camera starts
        setTimeout(() => {
          if (window.FaceMesh && window.Camera) {
            initializeFaceMesh();
          } else {
            setStatus('Đang tải MediaPipe...');
            // Retry after a delay
            setTimeout(() => {
              if (window.FaceMesh && window.Camera) {
                initializeFaceMesh();
              } else {
                setStatus('Lỗi tải MediaPipe');
              }
            }, 2000);
          }
        }, 1000);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setError('Không thể truy cập camera');
      setStatus('Lỗi camera');
    }
  }, [initializeFaceMesh]);

  // Stop camera
  const stopCamera = useCallback(() => {
    // Stop MediaStream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    // Stop MediaPipe Camera
    if (cameraUtilsRef.current) {
      try {
        cameraUtilsRef.current.stop();
      } catch (error) {
        console.error('Error stopping camera:', error);
      }
      cameraUtilsRef.current = null;
    }
    
    // Clean up FaceMesh
    if (faceMeshRef.current) {
      try {
        faceMeshRef.current.close();
      } catch (error) {
        console.error('Error closing FaceMesh:', error);
      }
      faceMeshRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setFaceDetected(false);
    setCurrentLandmarks(null);
    setStatus('Camera đã dừng');
  }, []);

  // Toggle preview
  const togglePreview = useCallback(() => {
    if (isActive) {
      stopCamera();
      setIsActive(false);
    } else {
      setIsActive(true);
      initializeThreeJS();
      startCamera();
    }
  }, [isActive, stopCamera, initializeThreeJS, startCamera]);

  // Update glasses when config changes or landmarks change
  useEffect(() => {
    if (currentLandmarks && glassesRef.current) {
      updateGlassesWithLandmarks();
    } else if (glassesRef.current && !currentLandmarks) {
      // If no face detected, still apply config scale
      const baseScale = effectiveConfig.initialScale * 0.16; // Base scale for preview
      glassesRef.current.scale.set(baseScale, baseScale, baseScale);
      glassesRef.current.position.set(0, 0, 0);
      glassesRef.current.rotation.set(0, 0, 0);
    }
  }, [updateGlassesWithLandmarks, effectiveConfig, currentLandmarks]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, [stopCamera]);

  return (
    <div className={`relative ${className}`}>
      {/* Preview Container */}
      <div 
        ref={containerRef}
        className="config-3d-preview-container"
      >
        {isActive && (
          <>
            {/* Video Element (hidden but needed for face detection) */}
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="config-3d-preview-video"
            />
            
            {/* Canvas for face landmarks (optional, for debugging) */}
            <canvas
              ref={canvasRef}
              className="config-3d-preview-canvas"
              width={300}
              height={300}
            />
            
            {/* Status Overlay */}
            <div className="config-3d-preview-status">
              <div className={`text-xs px-2 py-1 rounded ${
                faceDetected ? 'bg-green-500 text-white' : 'bg-yellow-500 text-black'
              }`}>
                {faceDetected ? '● Phát hiện khuôn mặt' : '○ Tìm khuôn mặt...'}
              </div>
            </div>
          </>
        )}
        
        {!isActive && (
          <div className="config-3d-preview-placeholder">
            <div className="text-center">
              <Video className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm font-medium">Xem trước 3D với camera</p>
              <p className="text-xs text-gray-400 mt-1">Nhấn để bắt đầu</p>
            </div>
          </div>
        )}

        {error && (
          <div className="config-3d-preview-error">
            ⚠️ {error}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex justify-center mt-3 space-x-2">
        <button
          onClick={togglePreview}
          className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            isActive 
              ? 'bg-red-100 text-red-700 hover:bg-red-200' 
              : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
          }`}
        >
          {isActive ? (
            <>
              <Pause className="w-4 h-4 mr-1" />
              Dừng
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-1" />
              Xem trước
            </>
          )}
        </button>

        {isActive && (
          <button
            onClick={() => {
              stopCamera();
              setTimeout(() => startCamera(), 100);
            }}
            className="flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            Reset
          </button>
        )}
      </div>

      {/* Status Text */}
      <div className="text-center mt-2">
        <p className="text-xs text-gray-500">{status}</p>
      </div>
    </div>
  );
};

export default Config3DPreview;
