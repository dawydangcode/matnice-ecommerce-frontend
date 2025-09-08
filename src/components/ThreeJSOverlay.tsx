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

  // Default configuration - can be overridden by glassesConfig prop
  const config = useMemo(() => {
    const defaultConfig: GlassesConfig = {
      offsetX: 0.65,
      offsetY: 0.45, 
      positionOffsetX: 0.55,
      positionOffsetY: 0.1,
      positionOffsetZ: -0.2,
      scaleMultiplier: 50,
      initialScale: 0.14  // Increased from 0.06 to 0.1 for larger model
    };
    return { ...defaultConfig, ...glassesConfig };
  }, [glassesConfig]);

  // Update glasses position smoothly - improved from face-tracking demo
  const updateGlassesPosition = useCallback((targetX: number, targetY: number, targetZ: number, targetRotation: number, targetScale: number) => {
    if (!glassesRef.current) return;

    const smoothFactor = 0.8; // From working face-tracking demo

    // Get current values
    const currentPos = glassesRef.current.position;
    const currentRot = glassesRef.current.rotation;
    const currentScale = glassesRef.current.scale;

    // Smooth interpolation directly to position/rotation like in the working demo
    glassesRef.current.position.set(
      currentPos.x + (targetX - currentPos.x) * smoothFactor,
      currentPos.y + (targetY - currentPos.y) * smoothFactor,
      currentPos.z + (targetZ - currentPos.z) * smoothFactor
    );

    // Smooth rotation
    glassesRef.current.rotation.set(
      currentRot.x + (0 - currentRot.x) * smoothFactor, // No X rotation
      currentRot.y + (0 - currentRot.y) * smoothFactor, // No Y rotation  
      currentRot.z + (targetRotation - currentRot.z) * smoothFactor
    );

    // Smooth scale
    const newScale = currentScale.x + (targetScale - currentScale.x) * smoothFactor;
    glassesRef.current.scale.set(newScale, newScale, newScale);
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

  // Update glasses position based on face landmarks - improved from working demo
  useEffect(() => {
    if (!faceLandmarks || !glassesRef.current || !videoElement) return;

    // Use landmarks from working face-tracking demo
    const middleBetweenEyes = faceLandmarks[168]; // Middle between eyes (main reference)
    const leftEye = faceLandmarks[143];           // Left eye
    const rightEye = faceLandmarks[372];          // Right eye
    const bottomOfNose = faceLandmarks[2];        // Bottom of nose
    const leftEar = faceLandmarks[234];           // Left ear
    const rightEar = faceLandmarks[454];          // Right ear
    
    if (!middleBetweenEyes || !leftEye || !rightEye || !bottomOfNose || !leftEar || !rightEar) return;

    // Use middleBetweenEyes as main center, with adjustment for glasses position
    const centerX = middleBetweenEyes.x;
    const centerY = (middleBetweenEyes.y + leftEye.y + rightEye.y) / 3 + 0.04; // Lower glasses slightly
    const centerZ = middleBetweenEyes.z;

    // Convert normalized coordinates to world coordinates (flip X for camera mirror)
    const worldX = -(centerX - 0.5) * 8;
    const worldY = -(centerY - 0.5) * 6;
    const worldZ = centerZ * 6;

    // Calculate scale based on eye distance (like in working demo)
    const eyeDistance = Math.hypot(
      (rightEye.x - leftEye.x) * 640,
      (rightEye.y - leftEye.y) * 480
    );
    const targetScale = (eyeDistance / 80) * 0.6; // From working demo

    // Calculate rotation based on eye alignment (flip for camera mirror)
    const angle = Math.atan2(rightEye.y - leftEye.y, rightEye.x - leftEye.x) * 1.2;

    // Apply config adjustments
    const targetX = worldX + config.positionOffsetX;
    const targetY = worldY + config.positionOffsetY;
    const targetZ = worldZ + config.positionOffsetZ;
    const finalScale = targetScale * (config.initialScale / 0.06); // Scale relative to default
      
    // Use requestAnimationFrame for smooth updates
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    animationFrameRef.current = requestAnimationFrame(() => {
      updateGlassesPosition(targetX, targetY, targetZ, angle, finalScale);
    });
    
    // Make sure glasses are visible
    glassesRef.current.visible = true;

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
