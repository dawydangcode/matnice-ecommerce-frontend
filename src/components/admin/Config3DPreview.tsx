import React, { useState, useRef, useEffect, useCallback } from 'react';
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
  offsetX: number;
  offsetY: number;
  positionOffsetX: number;
  positionOffsetY: number;
  positionOffsetZ: number;
  initialScale: number;
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

  // Initialize Three.js scene
  const initializeThreeJS = useCallback(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(50, 1, 0.01, 10);
    camera.position.set(0, 0, 2);
    cameraThreeRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true,
      antialias: true 
    });
    renderer.setSize(300, 300);
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.className = 'config-3d-threejs-canvas';

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

        // Apply config scale
        object.scale.set(config.initialScale, config.initialScale, config.initialScale);
        object.position.set(0, 0, 0);
        
        // Center the object
        const box = new THREE.Box3().setFromObject(object);
        const center = box.getCenter(new THREE.Vector3());
        object.position.sub(center);
        
        glassesGroup.add(object);
        scene.add(glassesGroup);
        glassesRef.current = glassesGroup;

        console.log('3D Model loaded successfully for preview');
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
  }, [modelPath, config.initialScale]);

  // Update glasses position based on config and landmarks
  const updateGlassesPosition = useCallback(() => {
    if (!glassesRef.current || !currentLandmarks) return;

    // Use landmarks similar to VirtualTryOnModal
    const middleBetweenEyes = currentLandmarks[168];
    const leftEye = currentLandmarks[143];
    const rightEye = currentLandmarks[372];
    const bottomOfNose = currentLandmarks[2];
    
    if (!middleBetweenEyes || !leftEye || !rightEye || !bottomOfNose) return;

    // Calculate position with config offsets
    const centerX = middleBetweenEyes.x;
    const centerY = (middleBetweenEyes.y + leftEye.y + rightEye.y) / 3 + 0.04;
    const centerZ = middleBetweenEyes.z;

    // Apply config offsets
    const worldX = -(centerX - config.offsetX) * 4 + config.positionOffsetX;
    const worldY = -(centerY - config.offsetY) * 3 + config.positionOffsetY;
    const worldZ = centerZ * 2 + config.positionOffsetZ;

    // Calculate scale
    const eyeDistance = Math.hypot(
      (rightEye.x - leftEye.x) * 640,
      (rightEye.y - leftEye.y) * 480
    );
    const targetScale = (eyeDistance / 80) * 0.6 * config.initialScale;

    // Calculate rotation with sensitivity
    const rollAngle = Math.atan2(rightEye.y - leftEye.y, rightEye.x - leftEye.x) * config.rotationSensitivity;
    const noseCenterX = (leftEye.x + rightEye.x) / 2;
    const noseOffset = bottomOfNose.x - noseCenterX;
    const yawAngle = Math.max(-config.yawLimit, Math.min(config.yawLimit, noseOffset * config.rotationSensitivity));
    
    const eyeCenterY = (leftEye.y + rightEye.y) / 2;
    const noseOffsetY = bottomOfNose.y - eyeCenterY;
    const pitchAngle = Math.max(-config.pitchLimit, Math.min(config.pitchLimit, noseOffsetY * config.rotationSensitivity));

    // Apply transformations
    glassesRef.current.position.set(worldX, worldY, worldZ);
    glassesRef.current.rotation.set(pitchAngle, yawAngle, rollAngle);
    glassesRef.current.scale.set(targetScale, targetScale, targetScale);
    glassesRef.current.visible = true;
  }, [currentLandmarks, config]);

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
          setFaceDetected(true);
          setCurrentLandmarks(results.multiFaceLandmarks[0]);
          setStatus('Phát hiện khuôn mặt - Đang hiển thị model 3D');
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
  }, []);

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

  // Update glasses when config changes
  useEffect(() => {
    updateGlassesPosition();
  }, [updateGlassesPosition, config]);

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
