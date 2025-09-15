import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Camera, Upload, User, Palette, Sparkles, X, Download, RotateCcw } from 'lucide-react';
import { useFaceDetection } from '../hooks/useFaceDetection';
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
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [autoCapture, setAutoCapture] = useState<{
    isEnabled: boolean;
    countdown: number;
    isCountingDown: boolean;
  }>({
    isEnabled: true,
    countdown: 3,
    isCountingDown: false
  });

  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);
  const faceDetectionTimerRef = useRef<NodeJS.Timeout | null>(null);
  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null);
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
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        }
      });
      
      console.log('Camera stream obtained:', stream);
      console.log('Stream tracks:', stream.getTracks());
      
      // Set camera active first to render video element
      setCameraActive(true);
      setError(null);
      streamRef.current = stream;
      
      // Wait for next render cycle to ensure video element exists
      setTimeout(async () => {
        if (videoRef.current) {
          console.log('Assigning stream to video element...');
          videoRef.current.srcObject = stream;
          
          // Add event listeners for debugging
          videoRef.current.onloadedmetadata = () => {
            console.log('Video metadata loaded');
            console.log('Video dimensions:', videoRef.current?.videoWidth, 'x', videoRef.current?.videoHeight);
            console.log('Video element style:', videoRef.current?.style.cssText);
            console.log('Video element classes:', videoRef.current?.className);
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
    }
    setCameraActive(false);
  }, []);

  // Stop auto-capture countdown
  const stopAutoCapture = useCallback(() => {
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
    setAutoCapture(prev => ({ ...prev, isCountingDown: false, countdown: 3 }));
  }, []);

  // Capture photo from camera
  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);

    // Convert to data URL
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedImage(dataUrl);
    stopCamera();
    
    // Stop auto-capture when photo is taken
    stopAutoCapture();
  }, [stopCamera, stopAutoCapture]);

  // Start auto-capture countdown
  const startAutoCapture = useCallback(() => {
    if (!autoCapture.isEnabled || autoCapture.isCountingDown) return;

    console.log('Starting auto-capture countdown...');
    setAutoCapture(prev => ({ ...prev, isCountingDown: true, countdown: 3 }));

    let count = 3;
    countdownTimerRef.current = setInterval(() => {
      count--;
      setAutoCapture(prev => ({ ...prev, countdown: count }));
      
      if (count <= 0) {
        if (countdownTimerRef.current) {
          clearInterval(countdownTimerRef.current);
          countdownTimerRef.current = null;
        }
        setAutoCapture(prev => ({ ...prev, isCountingDown: false, countdown: 3 }));
        console.log('Auto-capturing photo...');
        capturePhoto();
      }
    }, 1000);
  }, [autoCapture.isEnabled, autoCapture.isCountingDown, capturePhoto]);

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

        const detection = await detectFace(videoRef.current, 0.7);
        
        if (!detection) return;

        // Define the face guide frame area (oval in center of video)
        const videoRect = videoRef.current.getBoundingClientRect();
        const frameArea = {
          x: videoRect.width * 0.25, // Center horizontally with some margin
          y: videoRect.height * 0.15, // Center vertically with some margin
          width: videoRect.width * 0.5, // 50% of video width
          height: videoRect.height * 0.7 // 70% of video height
        };

        const faceInFrame = isFaceInFrame(detection, videoRef.current, frameArea);
        
        if (faceInFrame) {
          console.log('Face detected in frame, starting auto-capture...');
          // Stop detection loop and start countdown
          if (detectionIntervalRef.current) {
            clearInterval(detectionIntervalRef.current);
            detectionIntervalRef.current = null;
          }
          startAutoCapture();
        }
      } catch (error) {
        console.error('Face detection error:', error);
      }
    }, 500); // Check every 500ms
  }, [cameraActive, autoCapture.isEnabled, autoCapture.isCountingDown, initializeFaceAPI, detectFace, isFaceInFrame, startAutoCapture]);

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
    setError(null);
    setIsAnalyzing(false);
    stopCamera();
  }, [stopCamera]);

  // Download result image
  const downloadImage = useCallback(() => {
    if (!analysisResult?.s3Url) return;
    
    const link = document.createElement('a');
    link.href = analysisResult.s3Url;
    link.download = `face-analysis-${analysisResult.sessionId}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [analysisResult]);

  // Close modal handler
  const handleClose = useCallback(() => {
    stopCamera();
    resetAnalysis();
    onClose();
  }, [onClose, stopCamera, resetAnalysis]);

  // Initialize camera when modal opens
  useEffect(() => {
    if (isOpen && !capturedImage && !cameraActive) {
      console.log('Modal opened, starting camera...');
      // Add a small delay to ensure DOM is ready
      setTimeout(() => {
        startCamera();
      }, 100);
    }
  }, [isOpen, capturedImage, cameraActive, startCamera]);

  // Cleanup when modal closes
  useEffect(() => {
    return () => {
      if (!isOpen) {
        console.log('Modal closed, stopping camera...');
        stopCamera();
        stopAutoCapture();
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
      <div className="virtual-tryon-modal ai-analysis-modal">
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button className="close-button" onClick={handleClose}>
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Main Content */}
        <div className="modal-content-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
            
            {/* Left Panel - Camera/Image */}
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
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="face-guide-frame">
                          {/* Face oval guide */}
                          <div className="face-guide-oval"></div>
                          
                          {/* Instructions */}
                          <div className="face-guide-instruction">
                            {autoCapture.isCountingDown ? (
                              <div className="countdown-container">
                                <div className="countdown-number">{autoCapture.countdown}</div>
                                <div className="countdown-text">Get ready!</div>
                              </div>
                            ) : (
                              <div className="instruction-text">
                                Position your face in the oval
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
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
                        }
                      }}
                      className="bg-green-500 text-white px-3 py-1 rounded text-xs"
                    >
                      Debug Video
                    </button>
                  </div>
                </div>
              )}

              {/* Error Display */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                  {error}
                </div>
              )}
            </div>

            {/* Right Panel - Results */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Analysis Results
              </h3>
              
              {!analysisResult && !isAnalyzing && (
                <div className="text-center py-12 text-gray-500">
                  <Sparkles className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                  <p>Capture or upload an image to start analysis</p>
                </div>
              )}

              {isAnalyzing && (
                <div className="text-center py-12">
                  <div className="animate-spin mx-auto h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mb-4"></div>
                  <p className="text-gray-700 font-medium">Analyzing your photo...</p>
                  <p className="text-sm text-gray-500 mt-2">This may take a few seconds</p>
                </div>
              )}

              {analysisResult && (
                <div className="space-y-6">
                  {/* Gender Analysis */}
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center mb-3">
                      <User className="h-5 w-5 text-blue-600 mr-2" />
                      <h4 className="font-semibold text-blue-900">Gender Detection</h4>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-blue-800">Detected:</span>
                        <span className="font-semibold text-blue-900 capitalize">
                          {analysisResult.analysis.gender.detected}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-800">Confidence:</span>
                        <span className="font-semibold text-blue-900">
                          {(analysisResult.analysis.gender.confidence * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Skin Color Analysis */}
                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="flex items-center mb-3">
                      <Palette className="h-5 w-5 text-purple-600 mr-2" />
                      <h4 className="font-semibold text-purple-900">Skin Tone Analysis</h4>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-purple-800">Detected:</span>
                        <span className="font-semibold text-purple-900 capitalize">
                          {analysisResult.analysis.SkinColor.detected}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-800">Confidence:</span>
                        <span className="font-semibold text-purple-900">
                          {(analysisResult.analysis.SkinColor.confidence * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Processing Info */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex justify-between">
                        <span>Processing Time:</span>
                        <span>{(analysisResult.analysis.overall.processingTime / 1000).toFixed(1)}s</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Session ID:</span>
                        <span className="font-mono text-xs">{analysisResult.sessionId}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3">
                    {analysisResult.s3Url && (
                      <button
                        onClick={downloadImage}
                        className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors inline-flex items-center justify-center"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </button>
                    )}
                    <button
                      onClick={resetAnalysis}
                      className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      New Analysis
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIFaceAnalysisModal;
