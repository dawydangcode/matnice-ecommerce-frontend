import React, { useRef, useEffect, useMemo, useCallback } from 'react';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import '../styles/ThreeJSOverlay.css';

interface GlassesConfig {
  offsetX: number;      // Center point adjustment for X axis
  offsetY: number;      // Center point adjustment for Y axis
  positionOffsetX: number; // Fine-tuning horizontal position
  positionOffsetY: number; // Fine-tuning vertical position
  positionOffsetZ: number; // Depth adjustment
  scaleMultiplier: number; // Scale multiplier for this specific model
  initialScale: number;    // Initial scale when loading model
}

interface ThreeJSOverlayProps {
  faceLandmarks: any[] | null;
  canvasWidth: number;
  canvasHeight: number;
  videoElement: HTMLVideoElement | null;
  modelPath?: string;
  glassesConfig?: GlassesConfig;
}

const ThreeJSOverlay: React.FC<ThreeJSOverlayProps> = ({
  faceLandmarks,
  canvasWidth,
  canvasHeight,
  videoElement,
  modelPath = '/assets/glasses/base.obj',
  glassesConfig
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const glassesRef = useRef<THREE.Group | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  
  // For smooth interpolation
  const lastPositionRef = useRef({ x: 0, y: 0, z: 0 });
  const lastRotationRef = useRef(0);
  const lastScaleRef = useRef(1);

  // Default configuration - can be overridden by glassesConfig prop
  const config = useMemo(() => {
    const defaultConfig: GlassesConfig = {
      offsetX: 0.65,
      offsetY: 0.45, 
      positionOffsetX: 0.0,
      positionOffsetY: -0.02,
      positionOffsetZ: -0.1,
      scaleMultiplier: 50,
      initialScale: 0.06
    };
    return { ...defaultConfig, ...glassesConfig };
  }, [glassesConfig]);

  // Smooth interpolation function
  const lerp = (start: number, end: number, factor: number) => {
    return start + (end - start) * factor;
  };

  // Update glasses position smoothly
  const updateGlassesPosition = useCallback((targetX: number, targetY: number, targetZ: number, targetRotation: number, targetScale: number) => {
    if (!glassesRef.current) return;

    const smoothingFactor = 0.9; // Increased for faster response

    // Smooth interpolation
    const currentX = lerp(lastPositionRef.current.x, targetX, smoothingFactor);
    const currentY = lerp(lastPositionRef.current.y, targetY, smoothingFactor);
    const currentZ = lerp(lastPositionRef.current.z, targetZ, smoothingFactor);
    const currentRotation = lerp(lastRotationRef.current, targetRotation, smoothingFactor);
    const currentScale = lerp(lastScaleRef.current, targetScale, smoothingFactor);

    // Update position and rotation
    glassesRef.current.position.set(currentX, currentY, currentZ);
    glassesRef.current.rotation.z = currentRotation;
    glassesRef.current.scale.set(currentScale, currentScale, currentScale);

    // Store current values for next frame
    lastPositionRef.current = { x: currentX, y: currentY, z: currentZ };
    lastRotationRef.current = currentRotation;
    lastScaleRef.current = currentScale;
  }, []);

  useEffect(() => {
    if (!mountRef.current) return;

    const currentMount = mountRef.current; // Capture ref value at start

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup - adjust for better face tracking
    const camera = new THREE.PerspectiveCamera(
      50, // Reduced FOV for better perspective
      canvasWidth / canvasHeight, 
      0.01, // Closer near plane
      10    // Closer far plane
    );
    camera.position.set(0, 0, 2); // Move camera back a bit
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true,
      antialias: true 
    });
    renderer.setSize(canvasWidth, canvasHeight);
    renderer.setClearColor(0x000000, 0); // Transparent background
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.pointerEvents = 'none';
    // Remove CSS mirror transform, handle mirroring in positioning logic
    
    // Also remove scene mirroring since we handle it in positioning
    // scene.scale.x = -1;
    
    currentMount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, 1, 1);
    scene.add(directionalLight);

    // Load glasses model
    const loader = new OBJLoader();
    console.log('Starting to load glasses model from:', modelPath);
    
    loader.load(
      modelPath,
      (object) => {
        console.log('Glasses model loaded successfully:', object);
        console.log('Object children:', object.children);
        console.log('Object scale:', object.scale);
        console.log('Object position:', object.position);
        
        // Create a group for the glasses
        const glassesGroup = new THREE.Group();
        
        // Add materials to the loaded geometry
        object.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            console.log('Found mesh child:', child);
            console.log('Mesh geometry:', child.geometry);
            console.log('Mesh vertices count:', child.geometry.attributes.position?.count);
            
            // Create a nice material for the glasses
            child.material = new THREE.MeshPhongMaterial({
              color: 0x333333,
              shininess: 100,
              transparent: false, // Make it opaque first
              opacity: 1.0
            });
            
            // Make sure the mesh is visible
            child.visible = true;
          }
        });

        // Scale and position the glasses - use config values
        object.scale.set(config.initialScale, config.initialScale, config.initialScale);
        object.position.set(0, 0, 0);
        
        // Center the object at origin
        const box = new THREE.Box3().setFromObject(object);
        const center = box.getCenter(new THREE.Vector3());
        object.position.sub(center);
        
        glassesGroup.add(object);
        
        scene.add(glassesGroup);
        glassesRef.current = glassesGroup;
        
        console.log('Glasses added to scene successfully');
        console.log('Scene children after adding glasses:', scene.children.length);
        console.log('Glasses group children:', glassesGroup.children.length);
        console.log('Glasses group position:', glassesGroup.position);
        console.log('Glasses group scale:', glassesGroup.scale);
      },
      (progress) => {
        console.log('Loading progress:', progress);
      },
      (error) => {
        console.error('Error loading glasses model:', error);
        alert('Không thể tải model kính 3D. Vui lòng kiểm tra lại file base.obj');
      }
    );

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    animate();

    // Cleanup
    return () => {
      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [canvasWidth, canvasHeight, modelPath, config]);

  // Update glasses position based on face landmarks
  useEffect(() => {
    if (!faceLandmarks || !glassesRef.current || !videoElement) return;

    // Get key landmarks for glasses positioning
    const leftEye = faceLandmarks[33];   // Left eye outer corner
    const rightEye = faceLandmarks[362]; // Right eye outer corner
    const noseBridge = faceLandmarks[168]; // Nose bridge
    const leftEyeCenter = faceLandmarks[159]; // Left eye center
    const rightEyeCenter = faceLandmarks[386]; // Right eye center
    
    if (leftEye && rightEye && noseBridge && leftEyeCenter && rightEyeCenter) {
      // Use eye centers and nose bridge for more accurate positioning
      const eyeDistance = Math.abs(leftEyeCenter.x - rightEyeCenter.x);
      
      // Use nose bridge as the main reference point for better accuracy
      const centerX = noseBridge.x; // Use nose bridge X for center alignment
      const centerY = (leftEyeCenter.y + rightEyeCenter.y) / 2; // Use average eye Y position
      
      // Convert from normalized coords (0-1) to Three.js coords (-1 to 1)
      // Flip X axis for proper mirroring (when you move left, glasses move left)
      const glassesX = -((centerX - config.offsetX) * 2); // Use config offset
      const glassesY = -(centerY - config.offsetY) * 2; // Use config offset
      
      // Calculate target values
      const targetX = glassesX + config.positionOffsetX;
      const targetY = glassesY + config.positionOffsetY;
      const targetZ = config.positionOffsetZ;
      
      // Rotation based on eye alignment - flip angle for mirroring
      const angle = Math.atan2(rightEyeCenter.y - leftEyeCenter.y, rightEyeCenter.x - leftEyeCenter.x);
      const targetRotation = angle; // Keep original rotation
      
      // Scale based on eye distance - use config multiplier
      const targetScale = eyeDistance * config.scaleMultiplier;
      
      // Use requestAnimationFrame for smooth updates
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      animationFrameRef.current = requestAnimationFrame(() => {
        updateGlassesPosition(targetX, targetY, targetZ, targetRotation, targetScale);
      });
      
      // Make sure glasses are visible
      glassesRef.current.visible = true;
    }

    // Cleanup animation frame on unmount
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [faceLandmarks, videoElement, config, updateGlassesPosition]);

  return (
    <div 
      ref={mountRef} 
      className="threejs-overlay"
    />
  );
};

export default ThreeJSOverlay;
