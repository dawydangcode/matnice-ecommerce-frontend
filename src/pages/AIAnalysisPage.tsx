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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Section Title */}
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Tính Năng Nổi Bật</h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Khám phá những tính năng độc đáo giúp bạn tìm được chiếc kính hoàn hảo nhất
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gray-50 ${feature.color} mb-4`}>
              <feature.icon className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
            <p className="text-gray-600 text-sm">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* How It Works */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">Quy Trình Hoạt Động</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4">
              <Camera className="h-8 w-8" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">1. Chụp hoặc Tải Ảnh Lên</h4>
            <p className="text-gray-600">Sử dụng webcam để chụp ảnh trực tiếp hoặc tải lên một bức ảnh có sẵn.</p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 text-purple-600 mb-4">
              <Brain className="h-8 w-8" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">2. Phân Tích AI</h4>
            <p className="text-gray-600">Hệ thống AI của chúng tôi sẽ phân tích hình dáng khuôn mặt, tông màu da và các đặc điểm nổi bật.</p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
              <Sparkles className="h-8 w-8" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">3. Nhận Gợi Ý Cá Nhân Hóa</h4>
            <p className="text-gray-600">Khám phá danh sách kính mắt và kính râm được thiết kế riêng cho bạn, từ kiểu dáng đến màu sắc.</p>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl shadow-xl p-8 mt-16">
        <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">Tại Sao Chọn Chúng Tôi?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4">
              <User className="h-8 w-8" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Cá Nhân Hóa</h4>
            <p className="text-gray-600">Mỗi gợi ý được tạo ra dựa trên đặc điểm độc đáo của bạn.</p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 text-purple-600 mb-4">
              <Eye className="h-8 w-8" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Trải Nghiệm Thử Kính Ảo</h4>
            <p className="text-gray-600">Xem trước kính trên khuôn mặt bạn với công nghệ AR 3D.</p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
              <Sparkles className="h-8 w-8" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Đa Dạng Sản Phẩm</h4>
            <p className="text-gray-600">Hàng trăm mẫu kính từ các thương hiệu hàng đầu, phù hợp với mọi phong cách.</p>
          </div>
        </div>
        
        {/* Call to Action */}
        <div className="text-center mt-8 p-6 bg-white rounded-xl">
          <h4 className="text-xl font-bold text-gray-900 mb-2">Bắt đầu ngay hôm nay!</h4>
          <p className="text-gray-600 mb-4">Chụp ảnh hoặc tải ảnh lên để nhận gợi ý kính hoàn hảo chỉ trong vài giây!</p>
        </div>
      </div>
    </div>
  );

  // Render different steps
  const renderIntroStep = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-16">
        <div className="flex items-center justify-center mb-6">
          <Brain className="h-12 w-12 text-blue-600 mr-4" />
          <h1 className="text-4xl font-bold text-gray-900">Khám Phá Kính Phù Hợp Với Khuôn Mặt Của Bạn</h1>
        </div>
        <p className="text-xl text-gray-600 mb-8 max-w-4xl mx-auto">
          Chào mừng bạn đến với công nghệ AI Phân Tích Khuôn Mặt tiên tiến của chúng tôi! Chỉ với một bức ảnh, hệ thống AI sẽ phân tích các đặc điểm khuôn mặt của bạn để đưa ra những gợi ý kính mắt và kính râm hoàn hảo, phù hợp với phong cách và cá tính riêng của bạn.
        </p>
        {!showCameraAndResults && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => {
                setShowCameraAndResults(true);
                startCamera();
                scrollToLiveAnalysis();
              }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 inline-flex items-center justify-center"
            >
              <Camera className="mr-3 h-6 w-6" />
              Chụp Ảnh
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 inline-flex items-center justify-center"
            >
              <Upload className="mr-3 h-6 w-6" />
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
    <div ref={liveAnalysisRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header with close button */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Live Analysis</h2>
        <button
          onClick={resetAnalysis}
          className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-full transition-colors"
          title="Close analysis"
        >
          <X size={24} />
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Main Content - Camera and Results Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Left Column - Camera */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Camera</h3>
          
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
                      {/* 
                        Visual Guide Size Options:
                        - w-32 h-32 (128px) - Small circle
                        - w-40 h-40 (160px) - Medium-small circle  
                        - w-48 h-48 (192px) - Standard circle [CURRENT]
                        - w-56 h-56 (224px) - Large circle
                        - w-64 h-64 (256px) - Extra large circle
                        
                        Shape Options:
                        - rounded-full - Circle shape [CURRENT]
                        - rounded-2xl - Rounded rectangle
                        - rounded-lg - Slightly rounded rectangle
                      */}
                      <div className="face-detection-guide"></div>
                      <div className="absolute top-4 left-4 right-4 bg-black bg-opacity-50 text-white text-sm p-2 rounded text-center">
                        Position your face in the circle
                      </div>
                    </div>
                  )}

                  {/* Auto capture countdown */}
                  {autoCapture.isCountingDown && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="bg-black bg-opacity-70 text-white text-6xl font-bold rounded-full w-24 h-24 flex items-center justify-center">
                        {autoCapture.countdown}
                      </div>
                    </div>
                  )}

                  {/* Countdown cancelled notification */}
                  {countdownCancelled && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="bg-red-600 bg-opacity-90 text-white text-lg font-semibold px-6 py-3 rounded-lg text-center">
                        <X size={20} className="inline mr-2" />
                        Cancelled! Keep face in frame
                      </div>
                    </div>
                  )}

                  {/* Face quality warning */}
                  {faceQualityWarning && (
                    <div className="absolute top-4 left-4 right-4 bg-yellow-500 bg-opacity-90 text-white text-sm p-2 rounded text-center">
                      <Eye size={16} className="inline mr-1" />
                      Please look directly at the camera
                    </div>
                  )}

                  {/* Manual capture hint */}
                  {showManualCaptureHint && (
                    <div className="absolute top-16 left-4 right-4 bg-blue-500 bg-opacity-90 text-white text-sm p-2 rounded text-center">
                      <Camera size={16} className="inline mr-1" />
                      Having trouble? Tap the camera button to capture manually
                    </div>
                  )}

                  <button
                    onClick={capturePhoto}
                    aria-label="capture"
                    className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white text-blue-600 p-4 rounded-full shadow-lg hover:bg-gray-50 transition-colors"
                  >
                    <Camera size={24} />
                  </button>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Camera is not active</p>
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
          )}
        </div>

        {/* Right Column - Results */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Analysis Results</h3>
          
          {isAnalyzing ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Analyzing Your Face...</h4>
              <p className="text-gray-600">This may take a few seconds</p>
            </div>
          ) : analysisResult ? (
            <div className="space-y-6">
              {/* Analysis Image */}
              {analysisResult.s3Url && (
                <div className="text-center">
                  <img 
                    src={analysisResult.s3Url} 
                    alt="Analysis Result" 
                    className="mx-auto rounded-lg shadow-lg max-w-xs"
                  />
                </div>
              )}

              {/* Results Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Gender Result */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
                  <div className="flex items-center mb-3">
                    <User className="h-6 w-6 text-blue-600 mr-2" />
                    <h4 className="font-semibold text-gray-900">Gender</h4>
                  </div>
                  <div className="text-xl font-bold text-blue-600 capitalize">
                    {analysisResult.analysis.gender.detected}
                  </div>
                </div>

                {/* Skin Tone Result */}
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
                  <div className="flex items-center mb-3">
                    <Palette className="h-6 w-6 text-purple-600 mr-2" />
                    <h4 className="font-semibold text-gray-900">Skin Tone</h4>
                  </div>
                  <div className="text-xl font-bold text-purple-600 capitalize">
                    {analysisResult.analysis.SkinColor.detected}
                  </div>
                </div>

                {/* Face Shape Result */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
                  <div className="flex items-center mb-3">
                    <Circle className="h-6 w-6 text-green-600 mr-2" />
                    <h4 className="font-semibold text-gray-900">Face Shape</h4>
                  </div>
                  <div className="text-xl font-bold text-green-600 capitalize">
                    {analysisResult.analysis.faceShape.detected}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={resetAnalysis}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center justify-center"
                >
                  <RotateCcw size={16} className="mr-2" />
                  New Analysis
                </button>
                {analysisResult.s3Url && (
                  <button
                    onClick={handleDownload}
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors inline-flex items-center justify-center"
                  >
                    <Download size={16} className="mr-2" />
                    Download
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {/* Gender Result - Empty State */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
                  <div className="flex items-center mb-3">
                    <User className="h-6 w-6 text-blue-600 mr-2" />
                    <h4 className="font-semibold text-gray-900">Gender</h4>
                  </div>
                  <div className="text-lg text-gray-400 mb-1">
                    Waiting for analysis...
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div className="bg-blue-300 h-2 rounded-full w-0 transition-all duration-300" />
                  </div>
                </div>

                {/* Skin Tone Result - Empty State */}
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
                  <div className="flex items-center mb-3">
                    <Palette className="h-6 w-6 text-purple-600 mr-2" />
                    <h4 className="font-semibold text-gray-900">Skin Tone</h4>
                  </div>
                  <div className="text-lg text-gray-400 mb-1">
                    Waiting for analysis...
                  </div>
                  <div className="w-full bg-purple-200 rounded-full h-2">
                    <div className="bg-purple-300 h-2 rounded-full w-0 transition-all duration-300" />
                  </div>
                </div>

                {/* Face Shape Result - Empty State */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
                  <div className="flex items-center mb-3">
                    <Circle className="h-6 w-6 text-green-600 mr-2" />
                    <h4 className="font-semibold text-gray-900">Face Shape</h4>
                  </div>
                  <div className="text-lg text-gray-400 mb-1">
                    Waiting for analysis...
                  </div>
                  <div className="w-full bg-green-200 rounded-full h-2">
                    <div className="bg-green-300 h-2 rounded-full w-0 transition-all duration-300" />
                  </div>
                </div>
              </div>

              <div className="text-center py-4">
                <p className="text-sm text-gray-500">Take a photo to start the analysis</p>
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
