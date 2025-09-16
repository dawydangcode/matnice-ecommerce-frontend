import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Camera, Upload, X, RotateCcw, Sparkles } from 'lucide-react';
import { useFaceDetection } from '../hooks/useFaceDetection';
import AnalysisResultsModal from './AnalysisResultsModal';
import '../styles/VirtualTryOnModal.css';

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
    overall: {
      confidence: number;
      processingTime: number;
    };
  };
  status: 'pending' | 'processing' | 'completed' | 'failed';
  s3Url?: string;
  analyzedAt: string;
}

interface AIFaceAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

const AIFaceAnalysisModal: React.FC<AIFaceAnalysisModalProps> = ({
  isOpen,
  onClose,
  title = "AI Face Analysis"
}) => {
  // States
  const [cameraActive, setCameraActive] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraResolution, setCameraResolution] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [countdownCancelled, setCountdownCancelled] = useState(false);
  const [faceQualityWarning, setFaceQualityWarning] = useState(false); // Cảnh báo chất lượng mặt thấp
  const [showManualCaptureHint, setShowManualCaptureHint] = useState(false); // Hiện gợi ý chụp thủ công
  const [autoCapture, setAutoCapture] = useState<{
    isEnabled: boolean;
    countdown: number;
    isCountingDown: boolean;
    showGuide: boolean; // Thêm state để điều khiển hiển thị face guide
  }>({
    isEnabled: true,
    countdown: 3,
    isCountingDown: false,
    showGuide: true // Mặc định hiển thị guide
  });

  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);
  const faceDetectionTimerRef = useRef<NodeJS.Timeout | null>(null);
  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isCountingDownRef = useRef(false); // Thêm ref để track countdown state
  const { initializeFaceAPI, detectFace, isFaceInFrame } = useFaceDetection();



  // API base URL
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

  // Check camera permissions
  const checkCameraPermissions = async () => {
    try {
      const permission = await navigator.permissions.query({ name: 'camera' as PermissionName });
      console.log('Camera permission:', permission.state);
      return permission.state;
    } catch (error) {
      console.log('Cannot check camera permissions:', error);
      return 'unknown';
    }
  };



  // Start camera
  const startCamera = useCallback(async () => {
    try {
      console.log('Starting camera...');
      
      // Check permissions first
      const permissionState = await checkCameraPermissions();
      console.log('Camera permission state:', permissionState);
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1920, max: 1920 }, // Yêu cầu độ phân giải cao nhất
          height: { ideal: 1080, max: 1080 },
          facingMode: 'user'
        }
      });
      
      console.log('Camera stream obtained:', stream);
      console.log('Stream tracks:', stream.getTracks());
      
      // Set camera active first to render video element
      setCameraActive(true);
      setError(null);
      
      // Reset face detection states
      setFaceQualityWarning(false);
      setShowManualCaptureHint(false);
      
      streamRef.current = stream;
      
      // Wait for next render cycle to ensure video element exists
      setTimeout(async () => {
        if (videoRef.current) {
          console.log('Assigning stream to video element...');
          videoRef.current.srcObject = stream;
          
          // Add event listeners for debugging
          videoRef.current.onloadedmetadata = () => {
            console.log('Video metadata loaded');
            const actualWidth = videoRef.current?.videoWidth || 0;
            const actualHeight = videoRef.current?.videoHeight || 0;
            console.log('Video dimensions:', actualWidth, 'x', actualHeight);
            
            // Lưu độ phân giải thực tế của camera
            setCameraResolution({
              width: actualWidth,
              height: actualHeight
            });
            
            // Áp dụng kích thước thực tế cho video element
            if (videoRef.current) {
              // Tính toán kích thước hiển thị dựa trên viewport
              const maxWidth = Math.min(window.innerWidth * 0.9, actualWidth);
              const maxHeight = Math.min(window.innerHeight * 0.7, actualHeight);
              
              // Giữ nguyên tỷ lệ khung hình
              const aspectRatio = actualWidth / actualHeight;
              let displayWidth = maxWidth;
              let displayHeight = maxWidth / aspectRatio;
              
              if (displayHeight > maxHeight) {
                displayHeight = maxHeight;
                displayWidth = maxHeight * aspectRatio;
              }
              
              // Áp dụng kích thước tính toán
              videoRef.current.style.width = `${displayWidth}px`;
              videoRef.current.style.height = `${displayHeight}px`;
              
              console.log(`Applied video dimensions: ${displayWidth}x${displayHeight}`);
              console.log('Video element style:', videoRef.current?.style.cssText);
              console.log('Video element classes:', videoRef.current?.className);
            }
          };
          
          videoRef.current.onplay = () => {
            console.log('Video started playing');
          };
          
          videoRef.current.onerror = (e) => {
            console.error('Video error:', e);
          };

          videoRef.current.oncanplay = () => {
            console.log('Video can play');
          };

          videoRef.current.onplaying = () => {
            console.log('Video is playing');
          };
          
          console.log('About to call video.play()');
          try {
            await videoRef.current.play();
            console.log('Video play() succeeded');
          } catch (playError) {
            console.error('Video play() failed:', playError);
          }
          
          // Force a re-render to ensure video appears
          console.log('Video srcObject assigned:', videoRef.current.srcObject);
        } else {
          console.error('Video element not found after setCameraActive!');
        }
      }, 50);
    } catch (error) {
      console.error('Error accessing camera:', error);
      setError(`Cannot access camera: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setCameraActive(false);
    }
  }, []);

  // Stop camera
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
      // Reset video element style
      videoRef.current.style.width = '';
      videoRef.current.style.height = '';
    }
    setCameraActive(false);
    setCameraResolution(null);
  }, []);

  // Stop auto-capture countdown
  const stopAutoCapture = useCallback(() => {
    // Clear countdown timer
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
    // Clear detection interval
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }
    // Clear face monitoring timer
    if (faceDetectionTimerRef.current) {
      clearTimeout(faceDetectionTimerRef.current);
      faceDetectionTimerRef.current = null;
    }
    
    // Reset refs and state
    isCountingDownRef.current = false;
    setAutoCapture(prev => ({ ...prev, isCountingDown: false, countdown: 3 }));
    console.log('All auto-capture timers stopped');
  }, []);

  // Capture photo from camera
  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    // Tính toán để crop ảnh 640x640 từ center của video
    const sourceSize = Math.min(video.videoWidth, video.videoHeight);
    const sourceX = (video.videoWidth - sourceSize) / 2;
    const sourceY = (video.videoHeight - sourceSize) / 2;

    // Set canvas size thành 640x640
    canvas.width = 640;
    canvas.height = 640;
    
    // Lật canvas theo chiều ngang để match với video (mirror effect)
    ctx.save();
    ctx.scale(-1, 1);
    ctx.translate(-640, 0);
    
    // Crop và scale ảnh từ center của video
    ctx.drawImage(
      video, 
      sourceX, sourceY, sourceSize, sourceSize, // Source (square crop from center)
      0, 0, 640, 640 // Destination (640x640)
    );
    
    // Restore canvas context
    ctx.restore();

    // Convert to data URL
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedImage(dataUrl);
    
    // Ẩn face guide sau khi capture
    setAutoCapture(prev => ({ ...prev, showGuide: false }));
    stopCamera();
    
    // Stop auto-capture when photo is taken
    stopAutoCapture();
  }, [stopCamera, stopAutoCapture]);

  // Giám sát khuôn mặt trong lúc đếm ngược - Using recursive setTimeout
  const startFaceMonitoringDuringCountdown = useCallback(() => {
    console.log('🔍 Starting face monitoring during countdown...');
    console.log('🔍 isCountingDownRef.current:', isCountingDownRef.current);
    console.log('🔍 cameraActive:', cameraActive);
    console.log('🔍 videoRef.current:', !!videoRef.current);
    
    // Clear any existing timer first
    if (faceDetectionTimerRef.current) {
      clearTimeout(faceDetectionTimerRef.current);
      faceDetectionTimerRef.current = null;
    }
    
    console.log('🔍 About to start recursive monitoring...');
    
    // Recursive face monitoring function
    const monitorFace = async () => {
      console.log('🔍 ===== MONITOR FACE TICK =====');
      console.log('🔍 isCountingDownRef.current:', isCountingDownRef.current);
      console.log('🔍 cameraActive:', cameraActive);
      
      // Kiểm tra trạng thái hiện tại
      if (!isCountingDownRef.current || !cameraActive) {
        console.log('🔍 Stopping face monitoring - countdown ended or camera inactive');
        faceDetectionTimerRef.current = null;
        return;
      }

      try {
        if (!videoRef.current) {
          console.log('🔍 No video element, skipping...');
          // Schedule next check
          faceDetectionTimerRef.current = setTimeout(monitorFace, 100);
          return;
        }

        console.log('🔍 Video element found, initializing face-api...');
        // Initialize face-api if needed
        await initializeFaceAPI();
        
        console.log('🔍 Video readyState:', videoRef.current.readyState);
        console.log('🔍 Video playing:', !videoRef.current.paused);
        console.log('🔍 Video dimensions:', videoRef.current.videoWidth, 'x', videoRef.current.videoHeight);
        
        console.log('🔍 Detecting face...');
        const detection = await detectFace(videoRef.current, 0.5); // Thử threshold thấp hơn
        console.log('🔍 Detection result:', !!detection);
        
        if (detection) {
          console.log('🔍 Detection details:', {
            confidence: detection.score,
            box: detection.box,
            size: detection.box.width + 'x' + detection.box.height
          });
        }
        
        if (!detection) {
          console.log('🚨 No face detected during countdown, cancelling capture...');
          console.log('🚨 Current countdown value before cancel:', autoCapture.countdown);
          
          // Hủy tất cả timers
          if (countdownTimerRef.current) {
            clearInterval(countdownTimerRef.current);
            countdownTimerRef.current = null;
            console.log('🚨 Countdown timer cleared');
          }
          
          if (faceDetectionTimerRef.current) {
            clearTimeout(faceDetectionTimerRef.current);
            faceDetectionTimerRef.current = null;
            console.log('🚨 Face detection timer cleared');
          }

          // Update ref trước
          isCountingDownRef.current = false;

          // Reset state
          setAutoCapture(prev => ({ ...prev, isCountingDown: false, countdown: 3 }));
          console.log('🚨 Countdown reset to 3 after no face cancellation');
          
          // Hiển thị thông báo hủy
          setCountdownCancelled(true);
          console.log('🚨 Countdown cancelled, showing UI feedback');
          setTimeout(() => {
            setCountdownCancelled(false);
            console.log('🚨 Countdown cancelled UI hidden');
          }, 1500);
          
          return; // Don't schedule next check
        }
        
        // Kiểm tra xem face có trong frame không
        const videoRect = videoRef.current.getBoundingClientRect();
        const frameArea = {
          x: videoRect.width * 0.37,
          y: videoRect.height * 0.37,
          width: videoRect.width * 0.26,
          height: videoRect.height * 0.26
        };

        console.log('🔍 Video rect:', videoRect.width, 'x', videoRect.height);
        console.log('🔍 Frame area:', frameArea);
        console.log('🔍 Detection box:', detection.box);

        const faceInFrame = isFaceInFrame(detection, videoRef.current, frameArea);
        console.log('🔍 Face monitoring check - Face in frame:', faceInFrame, 'Detection:', !!detection);
        
        if (!faceInFrame) {
          console.log('🔥 Face moved out of frame during countdown, cancelling capture...');
          console.log('🔥 Current countdown value before cancel:', autoCapture.countdown);
          
          // Hủy tất cả timers
          if (countdownTimerRef.current) {
            clearInterval(countdownTimerRef.current);
            countdownTimerRef.current = null;
            console.log('🔥 Countdown timer cleared');
          }
          
          if (faceDetectionTimerRef.current) {
            clearTimeout(faceDetectionTimerRef.current);
            faceDetectionTimerRef.current = null;
            console.log('🔥 Face detection timer cleared');
          }

          // Update ref trước
          isCountingDownRef.current = false;

          // Reset state
          setAutoCapture(prev => ({ ...prev, isCountingDown: false, countdown: 3 }));
          console.log('🔥 Countdown reset to 3 after out-of-frame cancellation');
          
          // Hiển thị thông báo hủy
          setCountdownCancelled(true);
          console.log('🔥 Countdown cancelled, showing UI feedback');
          setTimeout(() => {
            setCountdownCancelled(false);
            console.log('🔥 Countdown cancelled UI hidden');
          }, 1500);
          
          return; // Don't schedule next check
        } else {
          console.log('✅ Face still in frame, continuing countdown...');
        }
        
        // Schedule next check if still counting down
        if (isCountingDownRef.current && cameraActive) {
          faceDetectionTimerRef.current = setTimeout(monitorFace, 100);
        }
        
      } catch (error) {
        console.error('🔍 Face monitoring error during countdown:', error);
        // Schedule next check even if error occurred
        if (isCountingDownRef.current && cameraActive) {
          faceDetectionTimerRef.current = setTimeout(monitorFace, 100);
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
    }, 300); // Delay 300ms để countdown chạy từ 3 -> 2 nhưng phản ứng nhanh hơn
  }, [cameraActive, initializeFaceAPI, detectFace, isFaceInFrame, autoCapture.countdown]);

  // Start auto-capture countdown với face monitoring
  const startAutoCapture = useCallback(() => {
    if (!autoCapture.isEnabled || autoCapture.isCountingDown) return;

    console.log('Starting auto-capture countdown...');
    
    // Clear any existing timers first to prevent multiple countdowns
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
    
    // Update both state and ref
    isCountingDownRef.current = true;
    setAutoCapture(prev => ({ ...prev, isCountingDown: true, countdown: 3 }));

    let count = 3;
    countdownTimerRef.current = setInterval(() => {
      // Check if countdown was cancelled
      if (!isCountingDownRef.current) {
        console.log('⏹️ Countdown was cancelled, stopping interval. Current count:', count);
        if (countdownTimerRef.current) {
          clearInterval(countdownTimerRef.current);
          countdownTimerRef.current = null;
        }
        // Ensure countdown is reset to 3
        setAutoCapture(prev => ({ ...prev, countdown: 3 }));
        console.log('⏹️ Countdown reset to 3 due to cancellation');
        return;
      }

      count--;
      console.log('⏰ Countdown timer tick:', count);
      setAutoCapture(prev => ({ ...prev, countdown: count }));
      
      if (count <= 0) {
        if (countdownTimerRef.current) {
          clearInterval(countdownTimerRef.current);
          countdownTimerRef.current = null;
        }
        // Stop face monitoring
        if (faceDetectionTimerRef.current) {
          clearTimeout(faceDetectionTimerRef.current);
          faceDetectionTimerRef.current = null;
        }
        
        // Update both state and ref
        isCountingDownRef.current = false;
        setAutoCapture(prev => ({ ...prev, isCountingDown: false, countdown: 3 }));
        console.log('Auto-capturing photo...');
        capturePhoto();
      }
    }, 1000);

    // Bắt đầu giám sát khuôn mặt trong lúc đếm ngược
    console.log('🚀 About to call startFaceMonitoringDuringCountdown...');
    console.log('🚀 isCountingDownRef.current before call:', isCountingDownRef.current);
    startFaceMonitoringDuringCountdown();
    console.log('🚀 startFaceMonitoringDuringCountdown called');
  }, [autoCapture.isEnabled, autoCapture.isCountingDown, capturePhoto, startFaceMonitoringDuringCountdown]);

  // Real face detection using face-api.js
  const startFaceDetection = useCallback(async () => {
    if (!cameraActive || !autoCapture.isEnabled || autoCapture.isCountingDown) return;

    // Initialize face-api if not already done
    await initializeFaceAPI();

    // Start continuous face detection
    detectionIntervalRef.current = setInterval(async () => {
      if (!cameraActive || !autoCapture.isEnabled || autoCapture.isCountingDown) {
        if (detectionIntervalRef.current) {
          clearInterval(detectionIntervalRef.current);
          detectionIntervalRef.current = null;
        }
        return;
      }

      // Check face detection inline to avoid dependency issues
      try {
        if (!videoRef.current) return;

        const detection = await detectFace(videoRef.current, 0.5);
        
        if (!detection) {
          // Nếu hoàn toàn không phát hiện được mặt, hiện gợi ý
          if (!showManualCaptureHint) {
            console.log('🎭 No face detected, showing manual capture hint...');
            setShowManualCaptureHint(true);
            setFaceQualityWarning(false);
          }
          return;
        }

        // Reset manual hint khi tìm thấy mặt
        setShowManualCaptureHint(false);
        
        // Kiểm tra chất lượng phát hiện khuôn mặt
        const confidence = detection.score;
        const faceSize = detection.box.width * detection.box.height;
        const videoArea = videoRef.current.videoWidth * videoRef.current.videoHeight;
        const faceRatio = faceSize / videoArea;
        
        console.log('🔍 Face quality check:', {
          confidence: confidence.toFixed(3),
          faceSize: Math.round(faceSize),
          faceRatio: (faceRatio * 100).toFixed(1) + '%'
        });
        
        // Cảnh báo chất lượng kém nếu confidence thấp hoặc mặt quá nhỏ
        const lowQuality = confidence < 0.7 || faceRatio < 0.02; // confidence < 0.7 hoặc mặt < 2% video
        if (lowQuality && !faceQualityWarning) {
          console.log('⚠️ Low face quality detected');
          setFaceQualityWarning(true);
        } else if (!lowQuality && faceQualityWarning) {
          console.log('✅ Good face quality restored');
          setFaceQualityWarning(false);
        }

        // Define the face guide frame area (oval nhỏ ở center của video)
        const videoRect = videoRef.current.getBoundingClientRect();
        const frameArea = {
          x: videoRect.width * 0.37, // Center với khung nhỏ hơn (260px / ~700px video)
          y: videoRect.height * 0.37, // Center với khung nhỏ hơn
          width: videoRect.width * 0.26, // ~26% of video width (260px)
          height: videoRect.height * 0.26 // ~26% of video height (260px)
        };

        const faceInFrame = isFaceInFrame(detection, videoRef.current, frameArea);
        
        if (faceInFrame) {
          // Kiểm tra chất lượng trước khi bắt đầu auto-capture
          const confidence = detection.score;
          const faceSize = detection.box.width * detection.box.height;
          const videoArea = videoRef.current.videoWidth * videoRef.current.videoHeight;
          const faceRatio = faceSize / videoArea;
          const goodQuality = confidence >= 0.7 && faceRatio >= 0.02; // Chất lượng tốt
          
          if (goodQuality) {
            console.log('✅ Good quality face detected in frame, starting auto-capture...');
            // Stop detection loop and start countdown
            if (detectionIntervalRef.current) {
              clearInterval(detectionIntervalRef.current);
              detectionIntervalRef.current = null;
            }
            
            // Only start auto-capture if not already counting down
            if (!autoCapture.isCountingDown && !isCountingDownRef.current) {
              startAutoCapture();
            }
          } else {
            console.log('⚠️ Face in frame but quality too low for auto-capture');
            console.log('💡 User can still capture manually with button');
          }
        }
      } catch (error) {
        console.error('Face detection error:', error);
      }
    }, 500); // Check every 500ms
  }, [cameraActive, autoCapture.isEnabled, autoCapture.isCountingDown, initializeFaceAPI, detectFace, isFaceInFrame, startAutoCapture, showManualCaptureHint, faceQualityWarning]);

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
        const response = await fetch(`${API_BASE_URL}/api/v1/ai/analysis/${sessionId}/result/`);
        
        if (!response.ok) {
          throw new Error(`Failed to get results: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.success && data.data) {
          const result = data.data as AnalysisResult;
          
          if (result.status === 'completed') {
            setAnalysisResult(result);
            setIsAnalyzing(false);
            setShowResults(true); // Show results modal
            return;
          } else if (result.status === 'failed') {
            setError('Analysis failed. Please try again.');
            setIsAnalyzing(false);
            return;
          }
        }

        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 1000);
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
  }, [API_BASE_URL]);

  // Analyze captured image
  const analyzeImage = useCallback(async () => {
    if (!capturedImage) {
      setError('No image captured');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setAnalysisResult(null);

    try {
      // Convert captured image to file
      const file = dataURLtoFile(capturedImage, 'face-analysis.jpg');
      
      // Upload image for analysis
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`${API_BASE_URL}/api/v1/ai/analyze-face`, {
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
  }, [capturedImage, API_BASE_URL, pollForResults]);

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
        setCapturedImage(e.target.result as string);
        setError(null);
      }
    };
    reader.readAsDataURL(file);
  }, []);

  // Reset analysis
  const resetAnalysis = useCallback(() => {
    setCapturedImage(null);
    setAnalysisResult(null);
    setShowResults(false);
    setError(null);
    setIsAnalyzing(false);
    setAutoCapture(prev => ({ ...prev, showGuide: true })); // Hiển thị lại face guide
    stopCamera();
  }, [stopCamera]);

  // Close modal handler
  const handleClose = useCallback(() => {
    stopCamera();
    resetAnalysis();
    onClose();
  }, [onClose, stopCamera, resetAnalysis]);

  // Cleanup when modal closes
  useEffect(() => {
    return () => {
      if (!isOpen) {
        console.log('Modal closed, stopping camera...');
        stopCamera();
        stopAutoCapture();
        // Reset face detection states
        setFaceQualityWarning(false);
        setShowManualCaptureHint(false);
      }
    };
  }, [isOpen, stopCamera, stopAutoCapture]);

  // Start real face detection when camera becomes active
  useEffect(() => {
    if (cameraActive && autoCapture.isEnabled && !autoCapture.isCountingDown) {
      console.log('Camera active, starting face detection...');
      startFaceDetection();
    }
    
    return () => {
      // Cleanup detection intervals
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
        detectionIntervalRef.current = null;
      }
      if (faceDetectionTimerRef.current) {
        clearTimeout(faceDetectionTimerRef.current);
        faceDetectionTimerRef.current = null;
      }
    };
  }, [cameraActive, autoCapture.isEnabled, autoCapture.isCountingDown, startFaceDetection]);

  if (!isOpen) return null;

  return (
    <div className="virtual-tryon-modal-overlay">
      <div className={`virtual-tryon-modal ai-analysis-modal ${showResults ? 'with-results' : ''}`}>
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button className="close-button" onClick={handleClose}>
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Main Content */}
        <div className="modal-content-full">
          <div className="p-6">
            
            {/* Main Panel - Camera/Image */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Capture or Upload Image
              </h3>
              
                                {!capturedImage ? (
                <div className="space-y-4">
                  {/* Camera Section */}
                  {cameraActive ? (
                    <div className="relative bg-gray-100 rounded-lg overflow-hidden">
                      <video
                        ref={videoRef}
                        className="w-full h-64 md:h-80 rounded-lg bg-black object-cover camera-video-modal force-visible-video"
                        autoPlay
                        muted
                        playsInline
                      />
                      <canvas ref={canvasRef} className="hidden" />
                      
                      {/* Camera Status Indicator */}
                      <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs">
                        Camera Active
                      </div>
                      
                      {/* Video Stream Debug Info */}
                      <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded text-xs">
                        Stream: {streamRef.current ? 'OK' : 'NO'}
                      </div>

                      {/* Face Guide Overlay */}
                      {autoCapture.showGuide && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className={`face-guide-frame ${!autoCapture.showGuide ? 'hidden' : ''}`}>
                          {/* Face oval guide với màu thay đổi theo trạng thái */}
                          <div className={`face-guide-oval ${autoCapture.isCountingDown ? 'counting-down' : ''}`}></div>
                          
                          {/* Instructions */}
                          <div className="face-guide-instruction">
                            {countdownCancelled ? (
                              <div className="countdown-container">
                                <div className="countdown-text countdown-cancelled">
                                  Cancelled! Keep face in frame
                                </div>
                              </div>
                            ) : autoCapture.isCountingDown ? (
                              <div className="countdown-container">
                                <div className="countdown-number">{autoCapture.countdown}</div>
                                <div className="countdown-text">Get ready!</div>
                              </div>
                            ) : showManualCaptureHint ? (
                              <div className="instruction-text">
                                <div className="text-red-500 font-semibold mb-1">
                                  ❌ No face detected
                                </div>
                                <div className="text-sm">
                                  Position your face in frame or tap 📷 to capture manually
                                </div>
                              </div>
                            ) : faceQualityWarning ? (
                              <div className="instruction-text">
                                <div className="text-orange-500 font-semibold mb-1">
                                  ⚠️ Face partially obscured?
                                </div>
                                <div className="text-sm">
                                  Remove mask/glasses for better analysis or tap 📷 to capture
                                </div>
                              </div>
                            ) : (
                              <div className="instruction-text">
                                Position your face in the oval
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      )}
                      
                      {/* Camera Controls */}
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3">
                        <button
                          onClick={capturePhoto}
                          className="bg-white text-gray-900 p-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                          title="Capture Photo"
                        >
                          <Camera className="w-6 h-6" />
                        </button>
                        <button
                          onClick={stopCamera}
                          className="bg-red-600 text-white p-3 rounded-full shadow-lg hover:bg-red-700 transition-colors"
                          title="Stop Camera"
                        >
                          <X className="w-6 h-6" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <Camera className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <div className="space-y-4">
                        <div className="text-gray-600 mb-4">
                          {cameraActive ? 'Camera is starting...' : 'Click to start camera'}
                        </div>
                        <button
                          onClick={() => {
                            console.log('Manual start camera button clicked');
                            startCamera();
                          }}
                          disabled={cameraActive}
                          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Camera className="mr-2 h-5 w-5" />
                          {cameraActive ? 'Starting Camera...' : 'Start Camera'}
                        </button>
                        
                        <div className="text-gray-500">or</div>
                        
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors inline-flex items-center"
                        >
                          <Upload className="mr-2 h-5 w-5" />
                          Upload Image
                        </button>
                        
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                          className="hidden"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Captured Image Preview */}
                  <div className="relative">
                    <img
                      src={capturedImage}
                      alt="Captured"
                      className="w-full rounded-lg"
                    />
                    <button
                      onClick={resetAnalysis}
                      className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors"
                      title="Retake Photo"
                    >
                      <RotateCcw className="w-5 h-5" />
                    </button>
                  </div>
                  
                  {/* Analyze Button */}
                  {!analysisResult && (
                    <button
                      onClick={analyzeImage}
                      disabled={isAnalyzing}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center"
                    >
                      {isAnalyzing ? (
                        <>
                          <div className="animate-spin -ml-1 mr-3 h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-5 w-5" />
                          Analyze Face
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}

              {/* Debug Info */}
              {process.env.NODE_ENV === 'development' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
                  <div>Camera Active: {cameraActive ? 'Yes' : 'No'}</div>
                  <div>Has Stream: {streamRef.current ? 'Yes' : 'No'}</div>
                  <div>Video Element: {videoRef.current ? 'Available' : 'Not Available'}</div>
                  <div className="mt-2 space-x-2">
                    <button
                      onClick={async () => {
                        try {
                          const devices = await navigator.mediaDevices.enumerateDevices();
                          const videoDevices = devices.filter(device => device.kind === 'videoinput');
                          console.log('Video devices found:', videoDevices);
                          alert(`Found ${videoDevices.length} camera(s). Check console for details.`);
                        } catch (e) {
                          console.error('Error enumerating devices:', e);
                          alert('Error checking camera devices');
                        }
                      }}
                      className="bg-blue-500 text-white px-3 py-1 rounded text-xs"
                    >
                      Test Camera Devices
                    </button>
                    <button
                      onClick={() => {
                        if (videoRef.current) {
                          console.log('Video element info:');
                          console.log('- offsetWidth:', videoRef.current.offsetWidth);
                          console.log('- offsetHeight:', videoRef.current.offsetHeight);
                          console.log('- clientWidth:', videoRef.current.clientWidth);
                          console.log('- clientHeight:', videoRef.current.clientHeight);
                          console.log('- videoWidth:', videoRef.current.videoWidth);
                          console.log('- videoHeight:', videoRef.current.videoHeight);
                          console.log('- readyState:', videoRef.current.readyState);
                          console.log('- paused:', videoRef.current.paused);
                          console.log('- srcObject:', videoRef.current.srcObject);
                          console.log('- Camera Resolution State:', cameraResolution);
                        }
                      }}
                      className="bg-green-500 text-white px-3 py-1 rounded text-xs"
                    >
                      Debug Video
                    </button>
                    
                    {/* Hiển thị độ phân giải camera */}
                    {cameraResolution && (
                      <div className="bg-gray-800 text-white px-3 py-1 rounded text-xs">
                        Camera: {cameraResolution.width} × {cameraResolution.height}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Error Display */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                  {error}
                </div>
              )}

              {/* Analysis Loading State */}
              {isAnalyzing && (
                <div className="mt-6 text-center py-8 bg-blue-50 rounded-lg">
                  <div className="animate-spin mx-auto h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mb-4"></div>
                  <p className="text-blue-700 font-medium">Analyzing your photo...</p>
                  <p className="text-sm text-blue-500 mt-1">This may take a few seconds</p>
                </div>
              )}

              {/* Error Display */}
              {error && (
                <div className="mt-4 p-4 bg-red-100 border border-red-300 rounded-lg text-red-700">
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Results Modal */}
      <AnalysisResultsModal
        isOpen={showResults}
        onClose={() => setShowResults(false)}
        result={analysisResult}
        onRetry={resetAnalysis}
      />
    </div>
  );
};

export default AIFaceAnalysisModal;
