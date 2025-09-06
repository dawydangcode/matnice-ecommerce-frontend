import React, { useRef, useEffect, useMemo } from 'react';
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
      console.log('Updating glasses position with landmarks:', {
        leftEye: { x: leftEye.x, y: leftEye.y },
        rightEye: { x: rightEye.x, y: rightEye.y },
        leftEyeCenter: { x: leftEyeCenter.x, y: leftEyeCenter.y },
        rightEyeCenter: { x: rightEyeCenter.x, y: rightEyeCenter.y },
        noseBridge: { x: noseBridge.x, y: noseBridge.y }
      });
      
      // Use eye centers and nose bridge for more accurate positioning
      const eyeDistance = Math.abs(leftEyeCenter.x - rightEyeCenter.x);
      
      // Use nose bridge as the main reference point for better accuracy
      const centerX = noseBridge.x; // Use nose bridge X for center alignment
      const centerY = (leftEyeCenter.y + rightEyeCenter.y) / 2; // Use average eye Y position
      
      // Convert from normalized coords (0-1) to Three.js coords (-1 to 1)
      // Flip X axis for proper mirroring (when you move left, glasses move left)
      const glassesX = -((centerX - config.offsetX) * 2); // Use config offset
      const glassesY = -(centerY - config.offsetY) * 2; // Use config offset
      
      console.log('Calculated glasses position:', { 
        x: glassesX + config.positionOffsetX, 
        y: glassesY + config.positionOffsetY, 
        z: config.positionOffsetZ 
      });
      
      // Position glasses with fine-tuned offsets from config
      glassesRef.current.position.set(
        glassesX + config.positionOffsetX, 
        glassesY + config.positionOffsetY, 
        config.positionOffsetZ
      );
      
      // Scale based on eye distance - use config multiplier
      const scale = eyeDistance * config.scaleMultiplier;
      console.log('Calculated scale:', scale);
      glassesRef.current.scale.set(scale, scale, scale);
      
      // Rotation based on eye alignment - flip angle for mirroring
      const angle = Math.atan2(rightEyeCenter.y - leftEyeCenter.y, rightEyeCenter.x - leftEyeCenter.x);
      console.log('Calculated rotation angle:', angle);
      glassesRef.current.rotation.z = angle; // Flip rotation for mirroring
      
      // Make sure glasses are visible and check bounds
      glassesRef.current.visible = true;
      
      // Debug: Log glasses world position and visibility
      console.log('Glasses world position:', glassesRef.current.position);
      console.log('Glasses scale:', glassesRef.current.scale);
      console.log('Glasses visible:', glassesRef.current.visible);
      console.log('Scene children count:', sceneRef.current?.children.length);
    }
  }, [faceLandmarks, videoElement, config]);

  return (
    <div 
      ref={mountRef} 
      className="threejs-overlay"
    />
  );
};

export default ThreeJSOverlay;
