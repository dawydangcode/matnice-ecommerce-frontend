import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Camera, Upload, User, Palette, Sparkles, Brain, Eye, Zap, RotateCcw, X, UserCircle2 } from 'lucide-react';
import Header from '../components/Header';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import ProductRecommendations from '../components/ProductRecommendations';
import AIVirtualTryOn from '../components/AIVirtualTryOn';
import { useFaceDetection } from '../hooks/useFaceDetection';
import { product3DModelService, Product3DModel, Model3DConfig } from '../services/product3dModel.service';
import '../styles/AIAnalysisPage.css';

interface AnalysisResult {
  analysisId: number;
  sessionId: string;
  analysis: {
    gender: {
      detected: string;
      confidence: number;
    };
    SkinColor: {
      detected: string;
      confidence: number;
    };
    faceShape: {
      detected: string;
      confidence: number;
    };
    overall: {
      confidence: number;
      processingTime: number;
    };
  };
  status: 'pending' | 'processing' | 'completed' | 'failed';
  s3Url?: string;
  analyzedAt: string;
}

const AIAnalysisPage: React.FC = () => {
  // States for analysis flow
  const [showCameraAndResults, setShowCameraAndResults] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  
  // Face detection states
  const [faceQualityWarning, setFaceQualityWarning] = useState(false);
  const [showManualCaptureHint, setShowManualCaptureHint] = useState(false);
  const [countdownCancelled, setCountdownCancelled] = useState(false);
  const [autoCapture, setAutoCapture] = useState({
    isEnabled: true,
    countdown: 3,
    isCountingDown: false,
    showGuide: true
  });

  // Virtual Try-On states
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [product3DModel, setProduct3DModel] = useState<Product3DModel | null>(null);
  const [model3DConfig, setModel3DConfig] = useState<Model3DConfig | null>(null);
  const [model3DLoading, setModel3DLoading] = useState(false);
  const [showVirtualTryOn, setShowVirtualTryOn] = useState(false);

  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const liveAnalysisRef = useRef<HTMLDivElement>(null);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);
  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const faceDetectionTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isCountingDownRef = useRef(false);
  const missedDetectionsRef = useRef(0);

  const { initializeFaceAPI, detectFace, isFaceInFrame, resetDetection } = useFaceDetection();

  // Helper functions to translate analysis results to Vietnamese
  const translateSkinColor = (color: string): string => {
    const skinColorMap: { [key: string]: string } = {
      'dark': 'Dark',
      'medium': 'Medium',
      'light': 'Light'
    };
    return skinColorMap[color.toLowerCase()] || color;
  };

  const translateFaceShape = (shape: string): string => {
    const faceShapeMap: { [key: string]: string } = {
      'oval': 'Oval',
      'round': 'Round',
      'square': 'Square',
      'heart': 'Heart',
      'long': 'Long',
      'oblong': 'Oblong'
    };
    return faceShapeMap[shape.toLowerCase()] || shape;
  };

  // Helper function to create backend proxy URL for 3D model
  const getModelProxyUrl = (productId: number): string => {
    const backendUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';
    return `${backendUrl}/api/v1/product-3d-model/serve/${productId}`;
  };

  // Load 3D model and config for selected product
  const load3DModelForProduct = async (productId: number) => {
    try {
      setModel3DLoading(true);
      console.log('Loading 3D model for product ID:', productId);
      
      // Get active 3D model for this product
      const activeModels = await product3DModelService.getActiveByProductId(productId);
      console.log('Active 3D models:', activeModels);
      
      if (activeModels && activeModels.length > 0) {
        const model = activeModels[0];
        setProduct3DModel(model);
        console.log('✅ 3D Model loaded:', model);
        
        // Load config for this model
        const config = await product3DModelService.getConfigByModelId(model.id);
        if (config) {
          setModel3DConfig(config);
          console.log('✅ Model config loaded:', config);
        } else {
          console.log('⚠️ No config found for model');
          setModel3DConfig(null);
        }
        
        return true;
      } else {
        console.log('⚠️ No 3D model found for product');
        setProduct3DModel(null);
        setModel3DConfig(null);
        return false;
      }
    } catch (error) {
      console.error('Error loading 3D model:', error);
      setProduct3DModel(null);
      setModel3DConfig(null);
      return false;
    } finally {
      setModel3DLoading(false);
    }
  };

  // Handle product selection for Virtual Try-On
  const handleProductSelect = async (product: any) => {
    console.log('Product selected for Virtual Try-On:', product);
    setSelectedProduct(product);
    
    const hasModel = await load3DModelForProduct(product.id);
    if (hasModel) {
      setShowVirtualTryOn(true);
      // Camera is already active after analysis, just enable virtual try-on
    } else {
      setError('This product does not have a 3D model available');
    }
  };

  // Start camera
  const startCamera = useCallback(async () => {
    try {
      // Reset detection state when starting camera
      resetDetection();
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280, max: 1920 }, // Reduced from 1920 for better performance
          height: { ideal: 720, max: 1080 }, // Reduced from 1080 for better performance
          facingMode: 'user'
        }
      });

      setCameraActive(true);
      setError(null);
      streamRef.current = stream;

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 50);
    } catch (error) {
      console.error('Error accessing camera:', error);
      setError(`Cannot access camera: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setCameraActive(false);
    }
  }, [resetDetection]);

  // Monitor face during countdown
  const startFaceMonitoringDuringCountdown = useCallback(() => {
    console.log('🔍 Starting face monitoring during countdown...');
    
    // Clear any existing timer first
    if (faceDetectionTimerRef.current) {
      clearTimeout(faceDetectionTimerRef.current);
      faceDetectionTimerRef.current = null;
    }
    
    // Recursive face monitoring function
    const monitorFace = async () => {
      console.log('🔍 ===== MONITOR FACE TICK =====');
      console.log('🔍 isCountingDownRef.current:', isCountingDownRef.current);
      console.log('🔍 cameraActive:', cameraActive);
      
      // Check current state
      if (!isCountingDownRef.current || !cameraActive) {
        console.log('🔍 Stopping face monitoring - countdown ended or camera inactive');
        faceDetectionTimerRef.current = null;
        return;
      }

        try {
          if (!videoRef.current || !videoRef.current.srcObject || videoRef.current.readyState < 2) {
            console.log('🔍 Video not ready, skipping...');
            // Schedule next check
            faceDetectionTimerRef.current = setTimeout(monitorFace, 400); // Increased from 200ms to 400ms
            return;
          }        console.log('🔍 Video element found, initializing face-api...');
        // Initialize face-api if needed
        await initializeFaceAPI();
        
        console.log('🔍 Detecting face...');
        let detection = null;
        try {
          detection = await detectFace(videoRef.current, 0.3); // Lower threshold for stability
        } catch (detectionError) {
          console.error('🔍 Face detection error:', detectionError);
          // Treat detection error as no face detected but don't crash
        }
        
        if (!detection) {
          missedDetectionsRef.current += 1;
          console.log('🚨 No face detected during countdown. Missed count:', missedDetectionsRef.current);
          
          // Only cancel after 2 consecutive misses for stability
          if (missedDetectionsRef.current >= 2) {
            console.log('🚨 Too many missed detections, cancelling capture...');
            
            // Cancel all timers
            if (countdownTimerRef.current) {
              clearInterval(countdownTimerRef.current);
              countdownTimerRef.current = null;
            }
            
            if (faceDetectionTimerRef.current) {
              clearTimeout(faceDetectionTimerRef.current);
              faceDetectionTimerRef.current = null;
            }

            // Update ref first
            isCountingDownRef.current = false;
            missedDetectionsRef.current = 0; // Reset missed count

            // Reset state
            setAutoCapture(prev => ({ ...prev, isCountingDown: false, countdown: 3 }));
            
            // Show cancellation notification
            setCountdownCancelled(true);
            setTimeout(() => {
              setCountdownCancelled(false);
            }, 1500);
            
            return; // Don't schedule next check
          } else {
            // Continue monitoring without cancelling
            if (isCountingDownRef.current && cameraActive) {
              faceDetectionTimerRef.current = setTimeout(monitorFace, 400); // Increased from 200ms to 400ms
            }
            return;
          }
        } else {
          // Reset missed count when detection is successful
          if (missedDetectionsRef.current > 0) {
            console.log('✅ Face detected again, resetting missed count from', missedDetectionsRef.current, 'to 0');
            missedDetectionsRef.current = 0;
          }
        }
        
        // Check if face is in frame
        const videoRect = videoRef.current.getBoundingClientRect();
        const frameArea = {
          x: videoRect.width * 0.25,
          y: videoRect.height * 0.25,
          width: videoRect.width * 0.5,
          height: videoRect.height * 0.5
        };

        const faceInFrame = isFaceInFrame(detection, videoRef.current, frameArea);
        console.log('🔍 Face monitoring check - Face in frame:', faceInFrame, 'Detection:', !!detection);
        
        if (!faceInFrame) {
          console.log('🔥 Face moved out of frame during countdown, cancelling capture...');
          
          // Cancel all timers
          if (countdownTimerRef.current) {
            clearInterval(countdownTimerRef.current);
            countdownTimerRef.current = null;
          }
          
          if (faceDetectionTimerRef.current) {
            clearTimeout(faceDetectionTimerRef.current);
            faceDetectionTimerRef.current = null;
          }

          // Update ref first
          isCountingDownRef.current = false;

          // Reset state
          setAutoCapture(prev => ({ ...prev, isCountingDown: false, countdown: 3 }));
          
          // Show cancellation notification
          setCountdownCancelled(true);
          setTimeout(() => {
            setCountdownCancelled(false);
          }, 1500);
          
          return; // Don't schedule next check
        } else {
          console.log('✅ Face still in frame, continuing countdown...');
        }
        
        // Schedule next check if still counting down
        if (isCountingDownRef.current && cameraActive) {
          faceDetectionTimerRef.current = setTimeout(monitorFace, 400); // Increased from 200ms to 400ms
        }
        
      } catch (error) {
        console.error('🔍 Face monitoring error during countdown:', error);
        // Schedule next check even if error occurred
        if (isCountingDownRef.current && cameraActive) {
          faceDetectionTimerRef.current = setTimeout(monitorFace, 400); // Increased from 200ms to 400ms
        }
      }
    };

    // Start the monitoring with a delay to avoid immediate cancellation
    setTimeout(() => {
      if (isCountingDownRef.current && cameraActive) {
        console.log('🔍 Starting monitoring after delay...');
        monitorFace();
      } else {
        console.log('🔍 Countdown already ended, skipping monitoring');
      }
    }, 300); // Delay 300ms
  }, [cameraActive, initializeFaceAPI, detectFace, isFaceInFrame]);

  // Start auto capture countdown
  const startAutoCapture = useCallback(() => {
    if (isCountingDownRef.current) return;

    console.log('Starting auto-capture countdown...');
    
    // Clear any existing timers first to prevent multiple countdowns
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }

    // Update both state and ref
    isCountingDownRef.current = true;
    missedDetectionsRef.current = 0; // Reset missed count at start
    setAutoCapture(prev => ({ ...prev, isCountingDown: true, countdown: 3 }));

    let countdown = 3;
    countdownTimerRef.current = setInterval(() => {
      // Check if countdown was cancelled
      if (!isCountingDownRef.current) {
        console.log('⏹️ Countdown was cancelled, stopping interval. Current count:', countdown);
        if (countdownTimerRef.current) {
          clearInterval(countdownTimerRef.current);
          countdownTimerRef.current = null;
        }
        // Ensure countdown is reset to 3
        setAutoCapture(prev => ({ ...prev, countdown: 3 }));
        return;
      }

      countdown--;
      console.log('⏰ Countdown timer tick:', countdown);
      setAutoCapture(prev => ({ ...prev, countdown }));

      if (countdown <= 0) {
        if (countdownTimerRef.current) {
          clearInterval(countdownTimerRef.current);
        }
        isCountingDownRef.current = false;
        setAutoCapture(prev => ({ ...prev, isCountingDown: false }));
        // Auto capture and analyze
        if (videoRef.current && canvasRef.current) {
          const canvas = canvasRef.current;
          const video = videoRef.current;
          const ctx = canvas.getContext('2d');

          if (ctx) {
            // Zoom in more to focus on face area (crop center 70% of the frame)
            const zoomFactor = 0.7;
            const sourceSize = Math.min(video.videoWidth, video.videoHeight) * zoomFactor;
            const sourceX = (video.videoWidth - sourceSize) / 2;
            const sourceY = (video.videoHeight - sourceSize) / 2;

            canvas.width = 640;
            canvas.height = 640;
            
            ctx.save();
            ctx.scale(-1, 1);
            ctx.translate(-640, 0);
            
            ctx.drawImage(
              video, 
              sourceX, sourceY, sourceSize, sourceSize,
              0, 0, 640, 640
            );
            
            ctx.restore();

            const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
            setCapturedImage(dataUrl);
            
            // Stop camera and face detection
            if (streamRef.current) {
              streamRef.current.getTracks().forEach(track => track.stop());
              streamRef.current = null;
            }
            if (videoRef.current) {
              videoRef.current.srcObject = null;
            }
            setCameraActive(false);
            
            // Stop face detection
            if (detectionIntervalRef.current) {
              clearInterval(detectionIntervalRef.current);
              detectionIntervalRef.current = null;
            }
            if (countdownTimerRef.current) {
              clearInterval(countdownTimerRef.current);
              countdownTimerRef.current = null;
            }
            if (faceDetectionTimerRef.current) {
              clearTimeout(faceDetectionTimerRef.current);
              faceDetectionTimerRef.current = null;
            }
            isCountingDownRef.current = false;
            setAutoCapture(prev => ({ ...prev, isCountingDown: false }));

            // Start analysis automatically
            setTimeout(() => {
              setIsAnalyzing(true);
              setError(null);

              const file = dataURLtoFile(dataUrl, 'face-analysis.jpg');
              
              const formData = new FormData();
              formData.append('image', file);

              // AI endpoints don't require authentication - use direct fetch
              fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3000'}/api/v1/ai/analyze-face`, {
                method: 'POST',
                body: formData,
              })
              .then(response => {
                if (!response.ok) {
                  throw new Error(`Analysis failed: ${response.status}`);
                }
                return response.json();
              })
              .then(data => {
                if (data.success) {
                  // Start polling for results
                  const pollResults = async (sessionId: string) => {
                    const maxAttempts = 30;
                    let attempts = 0;

                    const poll = async () => {
                      try {
                        // AI endpoints don't require authentication - use direct fetch
                        const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3000'}/api/v1/ai/analysis/${sessionId}/result/`);
                        
                        if (!response.ok) {
                          throw new Error(`Failed to get results: ${response.status}`);
                        }

                        const resultData = await response.json();
                        
                        if (resultData.success && resultData.data) {
                          if (resultData.data.status === 'completed') {
                            setAnalysisResult(resultData.data);
                            setIsAnalyzing(false);
                            // Reset face detection states when analysis is complete
                            setFaceQualityWarning(false);
                            setShowManualCaptureHint(false);
                            setAutoCapture(prev => ({ ...prev, isCountingDown: false, showGuide: false }));
                            missedDetectionsRef.current = 0;
                            // Stop face detection
                            if (detectionIntervalRef.current) {
                              clearInterval(detectionIntervalRef.current);
                              detectionIntervalRef.current = null;
                            }
                            
                            return;
                          } else if (resultData.data.status === 'failed') {
                            setError('Analysis failed. Please try again.');
                            setIsAnalyzing(false);
                            return;
                          }
                        }

                        attempts++;
                        if (attempts < maxAttempts) {
                          setTimeout(poll, 2000);
                        } else {
                          setError('Analysis timeout. Please try again.');
                          setIsAnalyzing(false);
                        }
                      } catch (error) {
                        console.error('Polling error:', error);
                        setError('Failed to get analysis results');
                        setIsAnalyzing(false);
                      }
                    };

                    poll();
                  };

                  pollResults(data.sessionId);
                } else {
                  throw new Error(data.message || 'Analysis failed');
                }
              })
              .catch(error => {
                console.error('Analysis error:', error);
                setError(error instanceof Error ? error.message : 'Analysis failed');
                setIsAnalyzing(false);
              });
            }, 500);
          }
        }
      }
    }, 1000);

    // Start face monitoring during countdown
    console.log('🚀 About to call startFaceMonitoringDuringCountdown...');
    startFaceMonitoringDuringCountdown();
  }, [startFaceMonitoringDuringCountdown]);

  // Start face detection
  const startFaceDetection = useCallback(() => {
    if (!videoRef.current) return;
    
    // Don't start face detection if analysis is already completed
    if (analysisResult && analysisResult.status === 'completed') {
      return;
    }

    // Clear any existing intervals
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
    }

    detectionIntervalRef.current = setInterval(async () => {
      if (videoRef.current && cameraActive && !isCountingDownRef.current && (!analysisResult || analysisResult.status !== 'completed')) {
        try {
          const detection = await detectFace(videoRef.current);
          
          // Define the frame area for face detection (center area of video)
          const videoRect = videoRef.current.getBoundingClientRect();
          
          // Face detection area settings - Customize these values:
          const DETECTION_AREA = {
            // Option 1: Compact (40% area) - Stricter detection
            // x: videoRect.width * 0.3, y: videoRect.height * 0.3, 
            // width: videoRect.width * 0.4, height: videoRect.height * 0.4
            
            // Option 2: Standard (50% area) - Balanced detection [CURRENT]
            x: videoRect.width * 0.25, y: videoRect.height * 0.25,
            width: videoRect.width * 0.5, height: videoRect.height * 0.5
            
            // Option 3: Generous (60% area) - More forgiving detection
            // x: videoRect.width * 0.2, y: videoRect.height * 0.2,
            // width: videoRect.width * 0.6, height: videoRect.height * 0.6
            
            // Option 4: Full frame (80% area) - Very loose detection
            // x: videoRect.width * 0.1, y: videoRect.height * 0.1,
            // width: videoRect.width * 0.8, height: videoRect.height * 0.8
          };
          
          const frameArea = DETECTION_AREA;
          
          const faceDetected = isFaceInFrame(detection, videoRef.current, frameArea);

          if (faceDetected) {
            setFaceQualityWarning(false);
            setShowManualCaptureHint(false);
            missedDetectionsRef.current = 0;

            if (autoCapture.isEnabled && !isCountingDownRef.current) {
              startAutoCapture();
            }
          } else {
            missedDetectionsRef.current++;
            if (missedDetectionsRef.current > 5) {
              setFaceQualityWarning(true);
              if (missedDetectionsRef.current > 15) {
                setShowManualCaptureHint(true);
              }
            }
          }
        } catch (error) {
          console.error('Face detection error:', error);
        }
      }
    }, 800); // Increased from 500ms to 800ms for better performance on low-end devices
  }, [cameraActive, autoCapture.isEnabled, detectFace, isFaceInFrame, startAutoCapture, analysisResult]);

  // Initialize face detection when camera becomes active (only if analysis not completed)
  useEffect(() => {
    if (cameraActive && videoRef.current && (!analysisResult || analysisResult.status !== 'completed')) {
      const initFaceDetection = async () => {
        await initializeFaceAPI();
        // Small delay to ensure video is fully loaded
        setTimeout(() => {
          startFaceDetection();
        }, 1000);
      };
      initFaceDetection();
    }
  }, [cameraActive, initializeFaceAPI, startFaceDetection, analysisResult]);

  // Auto start camera when analysis is completed
  useEffect(() => {
    if (analysisResult && analysisResult.status === 'completed' && !cameraActive) {
      // Small delay to ensure UI is updated
      setTimeout(() => {
        startCamera();
      }, 500);
    }
  }, [analysisResult, cameraActive, startCamera]);

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      // Clean up when component unmounts
      console.log('🧹 AIAnalysisPage unmounting, cleaning up camera and timers...');
      
      // Stop all timers
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current);
        countdownTimerRef.current = null;
      }
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
        detectionIntervalRef.current = null;
      }
      if (faceDetectionTimerRef.current) {
        clearTimeout(faceDetectionTimerRef.current);
        faceDetectionTimerRef.current = null;
      }
      
      // Stop camera stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => {
          console.log('🧹 Stopping camera track:', track.kind);
          track.stop();
        });
        streamRef.current = null;
      }
      
      // Reset refs and states
      isCountingDownRef.current = false;
      missedDetectionsRef.current = 0;
    };
  }, []); // Empty dependency array means this runs only on unmount





  const features = [
    {
      icon: User,
      title: "Gender Detection",
      description: "Advanced AI algorithms analyze facial features to accurately determine gender, helping suggest suitable eyewear styles.",
      color: "text-blue-600"
    },
    {
      icon: Palette,
      title: "Skin Tone Analysis",
      description: "Cutting-edge computer vision technology precisely identifies your skin tone, ensuring recommended glasses enhance your natural beauty.",
      color: "text-purple-600"
    },
    {
      icon: Eye,
      title: "Real-Time Processing",
      description: "Results delivered in seconds, saving you time and providing a seamless experience.",
      color: "text-green-600"
    },
    {
      icon: Zap,
      title: "High Accuracy",
      description: "Using advanced machine learning models, we deliver reliable recommendations tailored to each individual.",
      color: "text-orange-600"
    }
  ];

  // Stop face detection
  const stopFaceDetection = useCallback(() => {
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
    if (faceDetectionTimerRef.current) {
      clearTimeout(faceDetectionTimerRef.current);
      faceDetectionTimerRef.current = null;
    }
    isCountingDownRef.current = false;
    setAutoCapture(prev => ({ ...prev, isCountingDown: false }));
  }, []);

  // Stop camera
  const stopCamera = useCallback(() => {
    stopFaceDetection(); // Stop face detection first
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  }, [stopFaceDetection]);

  // Convert data URL to File
  const dataURLtoFile = (dataurl: string, filename: string): File => {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  // Poll for analysis results
  const pollForResults = useCallback(async (sessionId: string) => {
    const maxAttempts = 30;
    let attempts = 0;

    const poll = async () => {
      try {
        console.log('🔍 Polling for results, attempt:', attempts + 1);
        
        // AI endpoints don't require authentication - use direct fetch
        const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3000'}/api/v1/ai/analysis/${sessionId}/result/`);
        
        if (!response.ok) {
          throw new Error(`Failed to get results: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.success && data.data) {
          if (data.data.status === 'completed') {
            setAnalysisResult(data.data);
            setIsAnalyzing(false);
            // Reset face detection states when analysis is complete
            setFaceQualityWarning(false);
            setShowManualCaptureHint(false);
            setAutoCapture(prev => ({ ...prev, isCountingDown: false, showGuide: false }));
            missedDetectionsRef.current = 0;
            // Stop face detection
            if (detectionIntervalRef.current) {
              clearInterval(detectionIntervalRef.current);
              detectionIntervalRef.current = null;
            }
            return;
          } else if (data.data.status === 'failed') {
            setError('Analysis failed. Please try again.');
            setIsAnalyzing(false);
            return;
          }
        }

        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 2000);
        } else {
          setError('Analysis timeout. Please try again.');
          setIsAnalyzing(false);
        }
      } catch (error) {
        console.error('Polling error:', error);
        setError('Failed to get analysis results');
        setIsAnalyzing(false);
      }
    };

    poll();
  }, []);

  // Analyze image
  const analyzeImage = useCallback(async (imageData: string) => {
    setIsAnalyzing(true);
    setError(null);

    try {
      const file = dataURLtoFile(imageData, 'face-analysis.jpg');
      
      const formData = new FormData();
      formData.append('image', file);

      // AI endpoints don't require authentication - use direct fetch
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3000'}/api/v1/ai/analyze-face`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        pollForResults(data.sessionId);
      } else {
        throw new Error(data.message || 'Analysis failed');
      }
    } catch (error) {
      console.error('Analysis error:', error);
      setError(error instanceof Error ? error.message : 'Analysis failed');
      setIsAnalyzing(false);
    }
  }, [pollForResults]);

  // Scroll to Live Analysis section
  const scrollToLiveAnalysis = useCallback(() => {
    setTimeout(() => {
      if (liveAnalysisRef.current) {
        liveAnalysisRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 100); // Small delay to ensure the section is rendered
  }, []);

  // Capture photo (manual capture button)
  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    // Zoom in more to focus on face area (crop center 70% of the frame)
    const zoomFactor = 0.7;
    const sourceSize = Math.min(video.videoWidth, video.videoHeight) * zoomFactor;
    const sourceX = (video.videoWidth - sourceSize) / 2;
    const sourceY = (video.videoHeight - sourceSize) / 2;

    canvas.width = 640;
    canvas.height = 640;
    
    ctx.save();
    ctx.scale(-1, 1);
    ctx.translate(-640, 0);
    
    ctx.drawImage(
      video, 
      sourceX, sourceY, sourceSize, sourceSize,
      0, 0, 640, 640
    );
    
    ctx.restore();

    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedImage(dataUrl);
    stopCamera();
    stopFaceDetection(); // Stop face detection after capture
    
    // Start analysis automatically after manual capture
    setTimeout(() => {
      analyzeImage(dataUrl);
    }, 300);
  }, [stopCamera, stopFaceDetection, analyzeImage]);

  // Handle file upload
  const handleFileSelect = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        const imageData = e.target.result as string;
        setCapturedImage(imageData);
        setShowCameraAndResults(true);
        scrollToLiveAnalysis();
        analyzeImage(imageData);
      }
    };
    reader.readAsDataURL(file);
  }, [analyzeImage, scrollToLiveAnalysis]);

  // Handle file upload from input
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  // Reset analysis
  const resetAnalysis = useCallback(() => {
    setCapturedImage(null);
    setAnalysisResult(null);
    setShowCameraAndResults(true); // Keep camera section visible
    setError(null);
    setIsAnalyzing(false);
    // Reset face detection states
    setFaceQualityWarning(false);
    setShowManualCaptureHint(false);
    setAutoCapture({
      isEnabled: true,
      countdown: 3,
      isCountingDown: false,
      showGuide: true
    });
    missedDetectionsRef.current = 0;
    // Stop current camera first, then restart it
    stopCamera();
    // Restart camera after a short delay
    setTimeout(() => {
      startCamera();
    }, 300);
  }, [stopCamera, startCamera]);

  // Render Features Section
  const renderFeaturesSection = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
      {/* Section Title */}
      <div className="text-center mb-8 sm:mb-12 lg:mb-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Key Features</h2>
        <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto px-4">
          Discover unique features that help you find the perfect eyewear
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12 lg:mb-16">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className={`inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gray-50 ${feature.color} mb-3 sm:mb-4`}>
              <feature.icon className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* How It Works */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 text-center mb-6 sm:mb-8">How It Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-blue-100 text-blue-600 mb-3 sm:mb-4">
              <Camera className="h-6 w-6 sm:h-8 sm:w-8" />
            </div>
            <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">1. Capture or Upload Photo</h4>
            <p className="text-sm sm:text-base text-gray-600">Use webcam to take a live photo or upload an existing image.</p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-purple-100 text-purple-600 mb-3 sm:mb-4">
              <Brain className="h-6 w-6 sm:h-8 sm:w-8" />
            </div>
            <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">2. AI Analysis</h4>
            <p className="text-sm sm:text-base text-gray-600">Our AI system analyzes face shape, skin tone, and distinctive features.</p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-green-100 text-green-600 mb-3 sm:mb-4">
              <Sparkles className="h-6 w-6 sm:h-8 sm:w-8" />
            </div>
            <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">3. Get Personalized Recommendations</h4>
            <p className="text-sm sm:text-base text-gray-600">Discover eyewear and sunglasses tailored for you, from styles to colors.</p>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 mt-8 sm:mt-12 lg:mt-16">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 text-center mb-6 sm:mb-8">Why Choose Us?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-blue-100 text-blue-600 mb-3 sm:mb-4">
              <User className="h-6 w-6 sm:h-8 sm:w-8" />
            </div>
            <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Personalized</h4>
            <p className="text-sm sm:text-base text-gray-600">Every recommendation is created based on your unique features.</p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-purple-100 text-purple-600 mb-3 sm:mb-4">
              <Eye className="h-6 w-6 sm:h-8 sm:w-8" />
            </div>
            <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Virtual Try-On Experience</h4>
            <p className="text-sm sm:text-base text-gray-600">Preview glasses on your face with 3D AR technology.</p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-green-100 text-green-600 mb-3 sm:mb-4">
              <Sparkles className="h-6 w-6 sm:h-8 sm:w-8" />
            </div>
            <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Diverse Products</h4>
            <p className="text-sm sm:text-base text-gray-600">Hundreds of eyewear styles from leading brands, suitable for every style.</p>
          </div>
        </div>
        
        {/* Call to Action */}
        <div className="text-center mt-6 sm:mt-8 p-4 sm:p-6 bg-white rounded-xl">
          <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Start Today!</h4>
          <p className="text-sm sm:text-base text-gray-600 mb-4">Capture or upload a photo to get perfect eyewear recommendations in seconds!</p>
        </div>
      </div>
    </div>
  );

  // Render different steps
  const renderIntroStep = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="text-center mb-8 sm:mb-12 lg:mb-16">
        <div className="flex flex-col sm:flex-row items-center justify-center mb-4 sm:mb-6">
          <Brain className="h-10 w-10 sm:h-12 sm:w-12 text-blue-600 mb-3 sm:mb-0 sm:mr-4" />
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 text-center sm:text-left">
            Discover Eyewear That Fits Your Face
          </h1>
        </div>
        <p className="text-sm sm:text-base lg:text-xl text-gray-600 mb-6 sm:mb-8 max-w-4xl mx-auto px-2 leading-relaxed">
          Welcome to our advanced AI Face Analysis technology! With just one photo, our AI system will analyze your facial features to provide perfect eyewear and sunglasses recommendations that match your unique style and personality.
        </p>
        {!showCameraAndResults && (
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <button
              onClick={() => {
                setShowCameraAndResults(true);
                startCamera();
                scrollToLiveAnalysis();
              }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 inline-flex items-center justify-center w-full sm:w-auto"
            >
              <Camera className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6" />
              Try Now
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-white text-blue-600 border-2 border-blue-600 px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 inline-flex items-center justify-center w-full sm:w-auto"
            >
              <Upload className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6" />
              Upload Photo
            </button>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            handleFileSelect(file);
          }
        }}
        className="hidden"
      />
    </div>
  );

  const renderCameraStep = () => (
    <div ref={liveAnalysisRef} className="w-full max-w-[1600px] mx-auto px-0 sm:px-4 lg:px-8 py-0 sm:py-6 lg:py-8">
      {/* Header with close button */}
      <div className="flex justify-between items-center mb-4 sm:mb-6 px-4 sm:px-0">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
          {analysisResult?.status === 'completed' ? 'Analysis Results' : 'Face Analysis'}
        </h2>
        <button
          onClick={resetAnalysis}
          className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-full transition-colors"
          title="Close"
        >
          <X size={20} className="sm:w-6 sm:h-6" />
        </button>
      </div>

      {error && (
        <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg mx-4 sm:mx-0">
          <p className="text-sm sm:text-base text-red-700">{error}</p>
        </div>
      )}

      {/* Main Content - Unified card with camera and results */}
      <div className="bg-white rounded-xl shadow-xl mx-4 sm:mx-0 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left: Camera Section */}
          <div className="bg-gray-50 p-4 sm:p-6 lg:p-8 border-b lg:border-b-0 lg:border-r border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Camera</h3>
            
            <div className="relative mb-4">
              {analysisResult && analysisResult.status === 'completed' ? (
                // After analysis: show video with Virtual Try-On overlay
                <div className="relative">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="camera-video mirror-video rounded-lg"
                  />
                  
                  {/* Virtual Try-On Overlay */}
                  {showVirtualTryOn && selectedProduct && product3DModel && (
                    <AIVirtualTryOn
                      productName={selectedProduct.productName}
                      model3dUrl={getModelProxyUrl(selectedProduct.id)}
                      glassesConfig={model3DConfig ? {
                        offsetX: model3DConfig.offsetX,
                        offsetY: model3DConfig.offsetY,
                        positionOffsetX: model3DConfig.positionOffsetX,
                        positionOffsetY: model3DConfig.positionOffsetY,
                        positionOffsetZ: model3DConfig.positionOffsetZ,
                        initialScale: model3DConfig.initialScale
                      } : undefined}
                      videoElement={videoRef.current}
                      isActive={showVirtualTryOn}
                      onClose={() => {
                        setShowVirtualTryOn(false);
                        setSelectedProduct(null);
                        setProduct3DModel(null);
                        setModel3DConfig(null);
                      }}
                    />
                  )}
                </div>
              ) : capturedImage && !cameraActive ? (
                // Captured image
                <img
                  src={capturedImage}
                  alt="Captured"
                  className="w-full rounded-lg shadow-lg"
                />
              ) : cameraActive ? (
                // Active camera with detection
                <div className="relative">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="camera-video mirror-video rounded-lg"
                  />
                  
                  {/* Face detection guide overlay */}
                  {autoCapture.showGuide && (
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="face-detection-guide"></div>
                      <div className="absolute top-4 left-4 right-4 bg-black bg-opacity-70 text-white text-sm p-3 rounded-lg text-center">
                        <span>📸 Position your face in the circle • System will auto-capture</span>
                      </div>
                    </div>
                  )}

                  {/* Auto capture countdown */}
                  {autoCapture.isCountingDown && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-6xl font-bold rounded-full w-24 h-24 flex items-center justify-center shadow-2xl animate-pulse">
                        {autoCapture.countdown}
                      </div>
                    </div>
                  )}

                  {/* Countdown cancelled notification */}
                  {countdownCancelled && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-4">
                      <div className="bg-red-600 text-white text-lg font-semibold px-6 py-4 rounded-xl text-center shadow-xl">
                        <X size={24} className="inline mr-2" />
                        Cancelled! Keep face in frame
                      </div>
                    </div>
                  )}

                  {/* Face quality warning */}
                  {faceQualityWarning && !autoCapture.isCountingDown && (
                    <div className="absolute top-4 left-4 right-4 bg-yellow-500 text-white text-sm p-3 rounded-lg text-center shadow-lg z-20">
                      <Eye size={18} className="inline mr-2" />
                      Look straight at camera
                    </div>
                  )}

                  {/* Manual capture hint */}
                  {showManualCaptureHint && !autoCapture.isCountingDown && (
                    <div className="absolute bottom-20 left-4 right-4 bg-blue-600 text-white text-sm p-3 rounded-lg text-center shadow-lg">
                      <Camera size={18} className="inline mr-2" />
                      Having trouble? Press camera button to capture manually
                    </div>
                  )}

                  {/* Capture button */}
                  <button
                    onClick={capturePhoto}
                    aria-label="Capture photo"
                    className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white text-blue-600 p-4 rounded-full shadow-2xl hover:bg-gray-50 transition-all hover:scale-110 active:scale-95 z-30"
                  >
                    <Camera size={24} />
                  </button>
                </div>
              ) : (
                // Camera not active
                <div className="text-center py-12 bg-gray-100 rounded-lg">
                  <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Camera not active</p>
                  <button
                    onClick={startCamera}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Start Camera
                  </button>
                </div>
              )}
              <canvas ref={canvasRef} className="hidden" />
            </div>

            {/* Action buttons below camera - only show when analysis is complete */}
            {analysisResult && analysisResult.status === 'completed' && (
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={resetAnalysis}
                  className="flex-1 bg-gray-900 text-white px-6 py-3 rounded-lg text-base font-semibold hover:bg-gray-800 transition-colors shadow-sm hover:shadow-md inline-flex items-center justify-center"
                >
                  <RotateCcw size={18} className="mr-2" />
                  Analyze Again
                </button>
              </div>
            )}
          </div>

          {/* Right: Results Section */}
          <div className="p-4 sm:p-6 lg:p-8">
            {isAnalyzing ? (
              // Analyzing state
              <div className="text-center py-12">
                <div className="relative mb-6">
                  <div className="animate-spin rounded-full h-24 w-24 border-4 border-gray-200 border-t-blue-600 mx-auto"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Brain className="h-12 w-12 text-blue-600 animate-pulse" />
                  </div>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">Analyzing</h4>
                <p className="text-gray-600">AI is processing...</p>
              </div>
            ) : analysisResult && analysisResult.status === 'completed' ? (
              // Results display
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Analysis Results</h3>
                  
                  {/* Results Grid - Horizontal with Icons and Colors */}
                  <div className="grid grid-cols-3 gap-4">
                    {/* Gender */}
                    <div className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:shadow-md transition-all hover:border-blue-300">
                      <div className="flex items-center justify-center mb-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          analysisResult.analysis.gender.detected.toLowerCase() === 'male' 
                            ? 'bg-blue-100' 
                            : 'bg-pink-100'
                        }`}>
                          <User className={`w-5 h-5 ${
                            analysisResult.analysis.gender.detected.toLowerCase() === 'male' 
                              ? 'text-blue-600' 
                              : 'text-pink-600'
                          }`} />
                        </div>
                      </div>
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Gender</div>
                      <div className={`text-2xl font-bold ${
                        analysisResult.analysis.gender.detected.toLowerCase() === 'male' 
                          ? 'text-blue-600' 
                          : 'text-pink-600'
                      }`}>
                        {analysisResult.analysis.gender.detected.toLowerCase() === 'male' ? 'Male' : 'Female'}
                      </div>
                    </div>

                    {/* Skin Tone with Color Badge */}
                    <div className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:shadow-md transition-all hover:border-orange-300">
                      <div className="flex items-center justify-center mb-3">
                        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                          <Palette className="w-5 h-5 text-orange-600" />
                        </div>
                      </div>
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Skin Tone</div>
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <div 
                          className="w-5 h-5 rounded-full border-2 border-gray-300 shadow-sm"
                          style={{ 
                            backgroundColor: 
                              analysisResult.analysis.SkinColor.detected.toLowerCase() === 'dark' ? '#8B4513' :
                              analysisResult.analysis.SkinColor.detected.toLowerCase() === 'medium' ? '#D2B48C' :
                              '#F5E6D3'
                          }}
                        />
                        <div className="text-2xl font-bold text-orange-600">
                          {translateSkinColor(analysisResult.analysis.SkinColor.detected)}
                        </div>
                      </div>
                    </div>

                    {/* Face Shape */}
                    <div className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:shadow-md transition-all hover:border-purple-300">
                      <div className="flex items-center justify-center mb-3">
                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                          <Sparkles className="w-5 h-5 text-purple-600" />
                        </div>
                      </div>
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Face Shape</div>
                      <div className="text-2xl font-bold text-purple-600">
                        {translateFaceShape(analysisResult.analysis.faceShape.detected)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recommended Products Section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommended products based on analysis results</h3>
                  <ProductRecommendations 
                    analysisResult={analysisResult.analysis}
                    onProductTryOn={handleProductSelect}
                  />
                </div>
              </div>
            ) : (
              // Waiting state
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                  <Camera className="h-8 w-8 text-gray-400" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Ready to analyze</h4>
                <p className="text-sm text-gray-600">Capture photo to start</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Upload Section */}
      <div className="mt-6 text-center mx-4 sm:mx-0 max-w-[1600px] mx-auto">
        <p className="text-sm text-gray-600 mb-3">Or upload photo from device</p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isAnalyzing}
          className="inline-flex items-center bg-white border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 hover:border-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Upload size={20} className="mr-2" />
          Upload Photo
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      <Navigation />

      {/* Always show intro section */}
      {renderIntroStep()}
      
      {/* Show camera and results when needed - positioned above features */}
      {showCameraAndResults && renderCameraStep()}

      {/* Features section - below Live Analysis */}
      {renderFeaturesSection()}

      <Footer />
    </div>
  );
};

export default AIAnalysisPage;
