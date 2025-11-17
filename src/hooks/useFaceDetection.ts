import { useRef, useCallback } from 'react';
import * as faceapi from 'face-api.js';

export const useFaceDetection = () => {
  const isInitialized = useRef(false);
  const lastDetectionTime = useRef(0);
  const cachedDetection = useRef<faceapi.FaceDetection | null>(null);
  const consecutiveFailures = useRef(0);
  const performanceMode = useRef<'high' | 'medium' | 'low'>('high');

  const initializeFaceAPI = useCallback(async (): Promise<boolean> => {
    try {
      if (isInitialized.current) return true;

      console.log('Loading face-api.js models...');

      // Load only the tiny face detector model for better performance
      await faceapi.nets.tinyFaceDetector.loadFromUri('/models');

      console.log('Face-api.js models loaded successfully');
      isInitialized.current = true;
      return true;
    } catch (error) {
      console.error('Error loading face-api models:', error);
      return false;
    }
  }, []);

  const detectFace = useCallback(
    async (videoElement: HTMLVideoElement, minConfidence: number = 0.5) => {
      try {
        if (!isInitialized.current) {
          const initialized = await initializeFaceAPI();
          if (!initialized) return null;
        }

        // Adaptive throttle based on performance mode
        const now = Date.now();
        const throttleTime =
          performanceMode.current === 'high'
            ? 300
            : performanceMode.current === 'medium'
              ? 500
              : 700;

        if (now - lastDetectionTime.current < throttleTime) {
          // Return cached detection if available and recent
          return cachedDetection.current;
        }
        lastDetectionTime.current = now;

        // Adaptive inputSize based on performance
        const inputSize =
          performanceMode.current === 'high'
            ? 320
            : performanceMode.current === 'medium'
              ? 256
              : 224;

        const detectionStart = performance.now();
        const detections = await faceapi.detectAllFaces(
          videoElement,
          new faceapi.TinyFaceDetectorOptions({
            inputSize, // Adaptive input size
            scoreThreshold: minConfidence,
          }),
        );
        const detectionTime = performance.now() - detectionStart;

        // Auto-adjust performance mode based on detection time
        if (detectionTime > 200) {
          performanceMode.current = 'low';
        } else if (detectionTime > 100) {
          performanceMode.current = 'medium';
        } else {
          performanceMode.current = 'high';
        }

        const detection = detections.length > 0 ? detections[0] : null;

        // Cache the detection result
        cachedDetection.current = detection;

        // Track consecutive failures for adaptive behavior
        if (!detection) {
          consecutiveFailures.current++;
        } else {
          consecutiveFailures.current = 0;
        }

        return detection;
      } catch (error) {
        console.error('Face detection error:', error);
        consecutiveFailures.current++;
        return null;
      }
    },
    [initializeFaceAPI],
  );

  const isFaceInFrame = useCallback(
    (
      detection: faceapi.FaceDetection | null,
      videoElement: HTMLVideoElement,
      frameArea: { x: number; y: number; width: number; height: number },
    ): boolean => {
      if (!detection) return false;

      const box = detection.box;
      const videoRect = videoElement.getBoundingClientRect();

      // Optimized: Calculate face center in normalized coordinates (0-1)
      const faceCenterX = (box.x + box.width / 2) / videoElement.videoWidth;
      const faceCenterY = (box.y + box.height / 2) / videoElement.videoHeight;

      // Optimized: Calculate frame center in normalized coordinates (0-1)
      const frameCenterX =
        (frameArea.x + frameArea.width / 2) / videoRect.width;
      const frameCenterY =
        (frameArea.y + frameArea.height / 2) / videoRect.height;

      // Adaptive tolerance based on consecutive failures
      const baseTolerance = 0.15;
      const adaptiveTolerance =
        consecutiveFailures.current > 5
          ? baseTolerance * 1.3 // More forgiving if struggling
          : baseTolerance;

      // Check distance from center
      const distanceX = Math.abs(faceCenterX - frameCenterX);
      const distanceY = Math.abs(faceCenterY - frameCenterY);
      const isInPosition =
        distanceX < adaptiveTolerance && distanceY < adaptiveTolerance;

      // Optimized: Quick face size check
      const faceArea =
        (box.width * box.height) /
        (videoElement.videoWidth * videoElement.videoHeight);
      const idealFaceArea = 0.09; // Approximately 30% width * 30% height
      const sizeRatio = faceArea / idealFaceArea;

      // More lenient size check for better UX
      const sizeOk = sizeRatio >= 0.4 && sizeRatio <= 2.0;

      return isInPosition && sizeOk;
    },
    [],
  );

  // Get current performance mode (useful for debugging)
  const getPerformanceMode = useCallback(() => {
    return performanceMode.current;
  }, []);

  // Reset detection state (useful when restarting)
  const resetDetection = useCallback(() => {
    cachedDetection.current = null;
    consecutiveFailures.current = 0;
    performanceMode.current = 'high';
    lastDetectionTime.current = 0;
  }, []);

  return {
    initializeFaceAPI,
    detectFace,
    isFaceInFrame,
    getPerformanceMode,
    resetDetection,
    isInitialized: isInitialized.current,
  };
};
