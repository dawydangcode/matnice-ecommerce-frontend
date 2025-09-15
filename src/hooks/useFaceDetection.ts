import { useRef, useCallback } from 'react';
import * as faceapi from 'face-api.js';

export const useFaceDetection = () => {
  const isInitialized = useRef(false);
  const lastDetectionTime = useRef(0);

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

        // Throttle detection to avoid too frequent calls
        const now = Date.now();
        if (now - lastDetectionTime.current < 200) {
          // Max 5 detections per second
          return null;
        }
        lastDetectionTime.current = now;

        const detections = await faceapi.detectAllFaces(
          videoElement,
          new faceapi.TinyFaceDetectorOptions({
            inputSize: 416, // Higher resolution for better accuracy
            scoreThreshold: minConfidence,
          }),
        );

        return detections.length > 0 ? detections[0] : null;
      } catch (error) {
        console.error('Face detection error:', error);
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

      // Convert detection box to relative coordinates
      const faceCenter = {
        x: (box.x + box.width / 2) / videoElement.videoWidth,
        y: (box.y + box.height / 2) / videoElement.videoHeight,
      };

      // Convert frame area to relative coordinates
      const frameCenter = {
        x: (frameArea.x + frameArea.width / 2) / videoRect.width,
        y: (frameArea.y + frameArea.height / 2) / videoRect.height,
      };

      // Check if face is within acceptable range of frame center
      const tolerance = 0.15; // 15% tolerance
      const distanceX = Math.abs(faceCenter.x - frameCenter.x);
      const distanceY = Math.abs(faceCenter.y - frameCenter.y);

      // Also check if face size is appropriate (not too close or too far)
      const faceSize =
        (box.width / videoElement.videoWidth +
          box.height / videoElement.videoHeight) /
        2;
      const idealFaceSize = 0.3; // Face should occupy about 30% of frame
      const sizeRatio = faceSize / idealFaceSize;
      const sizeOk = sizeRatio >= 0.6 && sizeRatio <= 1.4; // Allow 60%-140% of ideal size

      return distanceX < tolerance && distanceY < tolerance && sizeOk;
    },
    [],
  );

  return {
    initializeFaceAPI,
    detectFace,
    isFaceInFrame,
    isInitialized: isInitialized.current,
  };
};
