import React from 'react';
import { X, Download, RotateCcw, User, Palette, Circle } from 'lucide-react';
import ProductRecommendations from './ProductRecommendations';
import '../styles/AnalysisResultsModal.css';

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

interface AnalysisResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: AnalysisResult | null;
  onRetry: () => void;
}

const AnalysisResultsModal: React.FC<AnalysisResultsModalProps> = ({
  isOpen,
  onClose,
  result,
  onRetry
}) => {
  const handleDownload = () => {
    if (!result?.s3Url) return;
    
    const link = document.createElement('a');
    link.href = result.s3Url;
    link.download = `face-analysis-${result.sessionId}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Set CSS custom properties for animation
  React.useEffect(() => {
    if (result && isOpen) {
      const genderBars = document.querySelectorAll('.gender-fill[data-width]');
      const skinBars = document.querySelectorAll('.skin-tone-fill[data-width]');
      const faceShapeBars = document.querySelectorAll('.face-shape-fill[data-width]');
      
      genderBars.forEach((bar) => {
        (bar as HTMLElement).style.setProperty('--target-width', `${result.analysis.gender.confidence * 100}%`);
      });
      
      skinBars.forEach((bar) => {
        (bar as HTMLElement).style.setProperty('--target-width', `${result.analysis.SkinColor.confidence * 100}%`);
      });

      faceShapeBars.forEach((bar) => {
        (bar as HTMLElement).style.setProperty('--target-width', `${result.analysis.faceShape.confidence * 100}%`);
      });
    }
  }, [result, isOpen]);

  if (!isOpen || !result) return null;

  return (
    <div className="analysis-results-modal">
      <div className="analysis-results-content">
        {/* Header */}
        <div className="analysis-results-header">
          <h2>Analysis Results</h2>
          <button 
            onClick={onClose}
            className="close-button"
            aria-label="Close results"
          >
            <X size={24} />
          </button>
        </div>

        {/* Results Content */}
        <div className="analysis-results-body">
          {/* Analysis Image */}
          {result.s3Url && (
            <div className="analysis-image-container">
              <img 
                src={result.s3Url} 
                alt="Analysis Result" 
                className="analysis-image"
              />
            </div>
          )}

          {/* Results Grid */}
          <div className="results-grid">
            {/* Gender Result */}
            <div className="result-card gender-card">
              <div className="result-icon">
                <User size={32} />
              </div>
              <div className="result-content">
                <h3>Gender Detection</h3>
                <div className="result-value">
                  {result.analysis.gender.detected}
                </div>
                <div className="result-confidence">
                  Confidence: {(result.analysis.gender.confidence * 100).toFixed(1)}%
                </div>
                <div className="confidence-bar">
                  <div 
                    className="confidence-fill gender-fill"
                    data-width={`${result.analysis.gender.confidence * 100}%`}
                  />
                </div>
              </div>
            </div>

            {/* Skin Tone Result */}
            <div className="result-card skin-tone-card">
              <div className="result-icon">
                <Palette size={32} />
              </div>
              <div className="result-content">
                <h3>Skin Tone Analysis</h3>
                <div className="result-value">
                  {result.analysis.SkinColor.detected}
                </div>
                <div className="result-confidence">
                  Confidence: {(result.analysis.SkinColor.confidence * 100).toFixed(1)}%
                </div>
                <div className="confidence-bar">
                  <div 
                    className="confidence-fill skin-tone-fill"
                    data-width={`${result.analysis.SkinColor.confidence * 100}%`}
                  />
                </div>
              </div>
            </div>

            {/* Face Shape Result */}
            <div className="result-card face-shape-card">
              <div className="result-icon">
                <Circle size={32} />
              </div>
              <div className="result-content">
                <h3>Face Shape Analysis</h3>
                <div className="result-value">
                  {result.analysis.faceShape.detected}
                </div>
                <div className="result-confidence">
                  Confidence: {(result.analysis.faceShape.confidence * 100).toFixed(1)}%
                </div>
                <div className="confidence-bar">
                  <div 
                    className="confidence-fill face-shape-fill"
                    data-width={`${result.analysis.faceShape.confidence * 100}%`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Analysis Info */}
          <div className="analysis-info">
            <div className="info-item">
              <strong>Session ID:</strong> {result.sessionId}
            </div>
            <div className="info-item">
              <strong>Analysis Date:</strong> {new Date(result.analyzedAt).toLocaleString()}
            </div>
          </div>

          {/* Product Recommendations */}
          {result.status === 'completed' && (
            <ProductRecommendations analysisResult={result.analysis} />
          )}
        </div>

        {/* Footer Actions */}
        <div className="analysis-results-footer">
          <button 
            onClick={onRetry}
            className="retry-button"
          >
            <RotateCcw size={20} />
            New Analysis
          </button>
          
          {result.s3Url && (
            <button 
              onClick={handleDownload}
              className="download-button"
            >
              <Download size={20} />
              Download Result
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalysisResultsModal;
