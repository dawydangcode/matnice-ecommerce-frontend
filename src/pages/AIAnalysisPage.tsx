import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Camera, Upload, User, Palette, Sparkles, Brain, Eye, Zap, RotateCcw, X, Download, Circle } from 'lucide-react';
import Header from '../components/Header';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import ProductRecommendations from '../components/ProductRecommendations';
import { useFaceDetection } from '../hooks/useFaceDetection';
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

  const { initializeFaceAPI, detectFace, isFaceInFrame } = useFaceDetection();



  // Start camera
  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1920, max: 1920 },
          height: { ideal: 1080, max: 1080 },
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
  }, []);

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
          faceDetectionTimerRef.current = setTimeout(monitorFace, 200);
          return;
        }

        console.log('🔍 Video element found, initializing face-api...');
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
              faceDetectionTimerRef.current = setTimeout(monitorFace, 200);
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
          faceDetectionTimerRef.current = setTimeout(monitorFace, 200);
        }
        
      } catch (error) {
        console.error('🔍 Face monitoring error during countdown:', error);
        // Schedule next check even if error occurred
        if (isCountingDownRef.current && cameraActive) {
          faceDetectionTimerRef.current = setTimeout(monitorFace, 200);
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
    }, 500);
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
      title: "Nhận Diện Giới Tính",
      description: "Thuật toán AI hiện đại phân tích các đặc điểm khuôn mặt để xác định giới tính với độ chính xác cao, giúp gợi ý kiểu kính phù hợp.",
      color: "text-blue-600"
    },
    {
      icon: Palette,
      title: "Phân Tích Tông Màu Da",
      description: "Công nghệ thị giác máy tính tiên tiến xác định chính xác tông màu da của bạn, đảm bảo kính được gợi ý sẽ tôn lên vẻ đẹp tự nhiên.",
      color: "text-purple-600"
    },
    {
      icon: Eye,
      title: "Xử Lý Thời Gian Thực",
      description: "Kết quả được trả về chỉ trong vài giây, giúp bạn tiết kiệm thời gian và có trải nghiệm mượt mà.",
      color: "text-green-600"
    },
    {
      icon: Zap,
      title: "Độ Chính Xác Cao",
      description: "Sử dụng các mô hình máy học tiên tiến, chúng tôi mang đến gợi ý đáng tin cậy, phù hợp với từng người dùng.",
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

  // Capture photo
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
  }, [stopCamera, stopFaceDetection]);

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

  // Reset analysis
  const resetAnalysis = useCallback(() => {
    setCapturedImage(null);
    setAnalysisResult(null);
    setShowCameraAndResults(false);
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
    stopCamera();
  }, [stopCamera]);

  // Handle download
  const handleDownload = () => {
    if (!analysisResult?.s3Url) return;
    
    const link = document.createElement('a');
    link.href = analysisResult.s3Url;
    link.download = `face-analysis-${analysisResult.sessionId}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Render Features Section
  const renderFeaturesSection = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
      {/* Section Title */}
      <div className="text-center mb-8 sm:mb-12 lg:mb-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Tính Năng Nổi Bật</h2>
        <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto px-4">
          Khám phá những tính năng độc đáo giúp bạn tìm được chiếc kính hoàn hảo nhất
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
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 text-center mb-6 sm:mb-8">Quy Trình Hoạt Động</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-blue-100 text-blue-600 mb-3 sm:mb-4">
              <Camera className="h-6 w-6 sm:h-8 sm:w-8" />
            </div>
            <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">1. Chụp hoặc Tải Ảnh Lên</h4>
            <p className="text-sm sm:text-base text-gray-600">Sử dụng webcam để chụp ảnh trực tiếp hoặc tải lên một bức ảnh có sẵn.</p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-purple-100 text-purple-600 mb-3 sm:mb-4">
              <Brain className="h-6 w-6 sm:h-8 sm:w-8" />
            </div>
            <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">2. Phân Tích AI</h4>
            <p className="text-sm sm:text-base text-gray-600">Hệ thống AI của chúng tôi sẽ phân tích hình dáng khuôn mặt, tông màu da và các đặc điểm nổi bật.</p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-green-100 text-green-600 mb-3 sm:mb-4">
              <Sparkles className="h-6 w-6 sm:h-8 sm:w-8" />
            </div>
            <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">3. Nhận Gợi Ý Cá Nhân Hóa</h4>
            <p className="text-sm sm:text-base text-gray-600">Khám phá danh sách kính mắt và kính râm được thiết kế riêng cho bạn, từ kiểu dáng đến màu sắc.</p>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 mt-8 sm:mt-12 lg:mt-16">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 text-center mb-6 sm:mb-8">Tại Sao Chọn Chúng Tôi?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-blue-100 text-blue-600 mb-3 sm:mb-4">
              <User className="h-6 w-6 sm:h-8 sm:w-8" />
            </div>
            <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Cá Nhân Hóa</h4>
            <p className="text-sm sm:text-base text-gray-600">Mỗi gợi ý được tạo ra dựa trên đặc điểm độc đáo của bạn.</p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-purple-100 text-purple-600 mb-3 sm:mb-4">
              <Eye className="h-6 w-6 sm:h-8 sm:w-8" />
            </div>
            <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Trải Nghiệm Thử Kính Ảo</h4>
            <p className="text-sm sm:text-base text-gray-600">Xem trước kính trên khuôn mặt bạn với công nghệ AR 3D.</p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-green-100 text-green-600 mb-3 sm:mb-4">
              <Sparkles className="h-6 w-6 sm:h-8 sm:w-8" />
            </div>
            <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Đa Dạng Sản Phẩm</h4>
            <p className="text-sm sm:text-base text-gray-600">Hàng trăm mẫu kính từ các thương hiệu hàng đầu, phù hợp với mọi phong cách.</p>
          </div>
        </div>
        
        {/* Call to Action */}
        <div className="text-center mt-6 sm:mt-8 p-4 sm:p-6 bg-white rounded-xl">
          <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Bắt đầu ngay hôm nay!</h4>
          <p className="text-sm sm:text-base text-gray-600 mb-4">Chụp ảnh hoặc tải ảnh lên để nhận gợi ý kính hoàn hảo chỉ trong vài giây!</p>
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
            Khám Phá Kính Phù Hợp Với Khuôn Mặt Của Bạn
          </h1>
        </div>
        <p className="text-sm sm:text-base lg:text-xl text-gray-600 mb-6 sm:mb-8 max-w-4xl mx-auto px-2 leading-relaxed">
          Chào mừng bạn đến với công nghệ AI Phân Tích Khuôn Mặt tiên tiến của chúng tôi! Chỉ với một bức ảnh, hệ thống AI sẽ phân tích các đặc điểm khuôn mặt của bạn để đưa ra những gợi ý kính mắt và kính râm hoàn hảo, phù hợp với phong cách và cá tính riêng của bạn.
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
              Trải nghiệm ngay
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-white text-blue-600 border-2 border-blue-600 px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 inline-flex items-center justify-center w-full sm:w-auto"
            >
              <Upload className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6" />
              Tải Ảnh Lên
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
    <div ref={liveAnalysisRef} className="max-w-7xl mx-auto px-0 sm:px-4 lg:px-8 py-0 sm:py-6 lg:py-8">
      {/* Header with close button - Hidden on mobile when camera active */}
      <div className={`flex justify-between items-center mb-4 sm:mb-6 lg:mb-8 px-4 sm:px-0 ${cameraActive && !capturedImage && !analysisResult ? 'hidden sm:flex' : 'flex'}`}>
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
          {analysisResult?.status === 'completed' ? 'Kết Quả Phân Tích' : 'Phân Tích Khuôn Mặt'}
        </h2>
        <button
          onClick={resetAnalysis}
          className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-full transition-colors"
          title="Đóng"
        >
          <X size={20} className="sm:w-6 sm:h-6" />
        </button>
      </div>

      {error && (
        <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg mx-4 sm:mx-0">
          <p className="text-sm sm:text-base text-red-700">{error}</p>
        </div>
      )}

      {/* Main Content - Full screen camera on mobile, side by side on desktop */}
      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-8 mb-6 sm:mb-8 ${
        cameraActive && !capturedImage && !analysisResult ? 'min-h-screen sm:min-h-0' : ''
      }`}>
        {/* Camera Section - Full screen on mobile when active */}
        <div className={`bg-white shadow-xl p-0 sm:p-6 lg:p-8 ${
          cameraActive && !capturedImage && !analysisResult 
            ? 'fixed inset-0 z-50 sm:relative sm:rounded-2xl' 
            : 'rounded-xl sm:rounded-2xl mx-4 sm:mx-0 p-4 sm:p-6 lg:p-8'
        }`}>
          {/* Camera header - only show on mobile fullscreen */}
          {cameraActive && !capturedImage && !analysisResult && (
            <div className="flex justify-between items-center p-4 bg-black bg-opacity-50 absolute top-0 left-0 right-0 z-10 sm:hidden">
              <h3 className="text-white font-semibold text-lg">Chụp ảnh khuôn mặt</h3>
              <button
                onClick={resetAnalysis}
                className="text-white p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>
          )}
          
          <h3 className={`text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 ${
            cameraActive && !capturedImage && !analysisResult ? 'hidden sm:block' : ''
          }`}>Camera</h3>
          
          {analysisResult && analysisResult.status === 'completed' ? (
            // After analysis is complete, show live video without face detection features
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="camera-video mirror-video"
              />
            </div>
          ) : capturedImage && !cameraActive ? (
            <div className="text-center">
              <img
                src={capturedImage}
                alt="Captured"
                className="mx-auto rounded-lg shadow-lg max-w-full w-full"
              />
            </div>
          ) : (
            <div className="relative">
              {cameraActive ? (
                <div className="relative">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="camera-video mirror-video"
                  />
                  
                  {/* Face detection guide overlay */}
                  {autoCapture.showGuide && (
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="face-detection-guide"></div>
                      {/* Guide text - better positioned for mobile */}
                      <div className="absolute top-20 sm:top-4 left-4 right-4 bg-black bg-opacity-70 text-white text-sm sm:text-base p-3 rounded-lg text-center">
                        <span className="block sm:inline">📸 Đặt khuôn mặt vào vòng tròn</span>
                        <span className="block sm:inline mt-1 sm:mt-0 sm:ml-2 text-xs sm:text-sm opacity-90">
                          Hệ thống sẽ tự động chụp
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Auto capture countdown - larger on mobile */}
                  {autoCapture.isCountingDown && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="bg-gradient-to-br from-blue-500 to-purple-600 bg-opacity-90 text-white text-7xl sm:text-6xl font-bold rounded-full w-32 h-32 sm:w-24 sm:h-24 flex items-center justify-center shadow-2xl animate-pulse">
                        {autoCapture.countdown}
                      </div>
                    </div>
                  )}

                  {/* Countdown cancelled notification */}
                  {countdownCancelled && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-4">
                      <div className="bg-red-600 bg-opacity-95 text-white text-base sm:text-lg font-semibold px-6 py-4 rounded-xl text-center shadow-xl max-w-sm">
                        <X size={24} className="inline mr-2" />
                        <span className="block sm:inline">Đã hủy!</span>
                        <span className="block sm:inline text-sm mt-1 sm:mt-0">Giữ khuôn mặt trong khung</span>
                      </div>
                    </div>
                  )}

                  {/* Face quality warning */}
                  {faceQualityWarning && !autoCapture.isCountingDown && (
                    <div className="absolute top-20 sm:top-4 left-4 right-4 bg-yellow-500 bg-opacity-95 text-white text-sm sm:text-base p-3 rounded-lg text-center shadow-lg z-20">
                      <Eye size={18} className="inline mr-2" />
                      Nhìn thẳng vào camera
                    </div>
                  )}

                  {/* Manual capture hint */}
                  {showManualCaptureHint && !autoCapture.isCountingDown && (
                    <div className="absolute bottom-24 sm:bottom-20 left-4 right-4 bg-blue-600 bg-opacity-95 text-white text-sm sm:text-base p-3 rounded-lg text-center shadow-lg">
                      <Camera size={18} className="inline mr-2" />
                      Gặp khó khăn? Nhấn nút camera để chụp thủ công
                    </div>
                  )}

                  {/* Capture button - larger and more prominent on mobile */}
                  <button
                    onClick={capturePhoto}
                    aria-label="Chụp ảnh"
                    className="absolute bottom-6 sm:bottom-4 left-1/2 transform -translate-x-1/2 bg-white text-blue-600 p-5 sm:p-4 rounded-full shadow-2xl hover:bg-gray-50 transition-all hover:scale-110 active:scale-95 z-30"
                  >
                    <Camera size={28} className="sm:w-6 sm:h-6" />
                  </button>
                </div>
              ) : (
                <div className="text-center py-8 sm:py-12">
                  <Camera className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
                  <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">Camera is not active</p>
                  <button
                    onClick={startCamera}
                    className="bg-blue-600 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Start Camera
                  </button>
                </div>
              )}
              <canvas ref={canvasRef} className="hidden" />
            </div>
          )}
        </div>

        {/* Results Section - Full width on mobile when analyzing/completed */}
        <div className={`bg-white shadow-xl ${
          (isAnalyzing || analysisResult) && !cameraActive 
            ? 'mx-0 rounded-none sm:rounded-2xl sm:mx-0 p-6 sm:p-8' 
            : 'rounded-xl sm:rounded-2xl mx-4 sm:mx-0 p-4 sm:p-6 lg:p-8'
        }`}>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
            {isAnalyzing ? '⏳ Đang phân tích...' : analysisResult ? 'Kết quả' : 'Kết quả phân tích'}
          </h3>
          
          {isAnalyzing ? (
            <div className="text-center py-12 sm:py-16">
              <div className="relative mb-6">
                <div className="animate-spin rounded-full h-20 w-20 sm:h-24 sm:w-24 border-4 border-gray-200 border-t-blue-600 mx-auto"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Brain className="h-10 w-10 sm:h-12 sm:w-12 text-blue-600 animate-pulse" />
                </div>
              </div>
              <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Đang phân tích khuôn mặt của bạn</h4>
              <p className="text-sm sm:text-base text-gray-600 mb-4">AI đang xử lý, vui lòng đợi trong giây lát...</p>
              <div className="flex justify-center gap-1 mt-6">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          ) : analysisResult ? (
            <div className="space-y-6">
              {/* Success message - simple and clean */}
              <div className="bg-white border-2 border-gray-200 rounded-lg p-4 text-center">
                <h4 className="text-xl font-bold text-gray-900 mb-1">Phân tích hoàn tất</h4>
                <p className="text-sm text-gray-600">Kết quả phân tích khuôn mặt của bạn</p>
              </div>

              {/* Analysis Image - larger on mobile */}
              {analysisResult.s3Url && (
                <div className="text-center">
                  <img 
                    src={analysisResult.s3Url} 
                    alt="Kết quả phân tích" 
                    className="mx-auto rounded-lg shadow-lg max-w-full sm:max-w-sm border-2 border-gray-200"
                  />
                </div>
              )}

              {/* Results Grid - Clean minimalist design */}
              <div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-4">
                {/* Gender Result */}
                <div className="bg-white border-2 border-gray-200 rounded-lg p-5 hover:border-gray-300 transition-colors">
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Giới tính</h4>
                  <div className="text-2xl font-bold text-gray-900">
                    {analysisResult.analysis.gender.detected.toLowerCase() === 'male' ? 'Nam' : 'Nữ'}
                  </div>
                </div>

                {/* Skin Tone Result */}
                <div className="bg-white border-2 border-gray-200 rounded-lg p-5 hover:border-gray-300 transition-colors">
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Màu da</h4>
                  <div className="text-2xl font-bold text-gray-900 capitalize">
                    {analysisResult.analysis.SkinColor.detected}
                  </div>
                </div>

                {/* Face Shape Result */}
                <div className="bg-white border-2 border-gray-200 rounded-lg p-5 hover:border-gray-300 transition-colors">
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Khuôn mặt</h4>
                  <div className="text-2xl font-bold text-gray-900 capitalize">
                    {analysisResult.analysis.faceShape.detected}
                  </div>
                </div>
              </div>

              {/* Action Buttons - Simple design */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  onClick={resetAnalysis}
                  className="flex-1 bg-gray-900 text-white px-6 py-3.5 sm:py-3 rounded-lg text-base font-semibold hover:bg-gray-800 transition-colors shadow-sm hover:shadow-md active:scale-98 inline-flex items-center justify-center"
                >
                  <RotateCcw size={18} className="mr-2" />
                  Phân tích lại
                </button>
                {analysisResult.s3Url && (
                  <button
                    onClick={handleDownload}
                    className="flex-1 bg-white border-2 border-gray-900 text-gray-900 px-6 py-3.5 sm:py-3 rounded-lg text-base font-semibold hover:bg-gray-50 transition-colors shadow-sm hover:shadow-md active:scale-98 inline-flex items-center justify-center"
                  >
                    <Download size={18} className="mr-2" />
                    Tải ảnh
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div>
              {/* Waiting state - clean and simple */}
              <div className="text-center py-8 mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                  <Camera className="h-8 w-8 text-gray-400" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Sẵn sàng phân tích</h4>
                <p className="text-sm text-gray-600 px-4">
                  Chụp ảnh hoặc tải ảnh lên để bắt đầu
                </p>
              </div>

              <div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-4">
                {/* Gender Result - Empty State */}
                <div className="bg-white border-2 border-gray-200 rounded-lg p-5">
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Giới tính</h4>
                  <div className="text-xl text-gray-300 mb-3">---</div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="bg-gray-300 h-1.5 rounded-full w-0 transition-all duration-300" />
                  </div>
                </div>

                {/* Skin Tone Result - Empty State */}
                <div className="bg-white border-2 border-gray-200 rounded-lg p-5">
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Màu da</h4>
                  <div className="text-xl text-gray-300 mb-3">---</div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="bg-gray-300 h-1.5 rounded-full w-0 transition-all duration-300" />
                  </div>
                </div>

                {/* Face Shape Result - Empty State */}
                <div className="bg-white border-2 border-gray-200 rounded-lg p-5">
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Khuôn mặt</h4>
                  <div className="text-xl text-gray-300 mb-3">---</div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="bg-gray-300 h-1.5 rounded-full w-0 transition-all duration-300" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Product Recommendations - Full Width Below */}
      {analysisResult?.status === 'completed' && (
        <ProductRecommendations analysisResult={analysisResult.analysis} />
      )}
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
