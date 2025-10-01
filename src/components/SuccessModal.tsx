import React from 'react';
import { CheckCircle, X } from 'lucide-react';
import '../styles/SuccessModal.css';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  onConfirm?: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  onConfirm
}) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  return (
    <div className="success-modal-overlay" onClick={onClose}>
      <div className="success-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="success-modal-close" onClick={onClose}>
          <X size={20} />
        </button>
        
        <div className="success-modal-header">
          <CheckCircle className="success-icon" size={48} />
          <h2 className="success-title">{title}</h2>
        </div>
        
        <div className="success-modal-body">
          <p className="success-message">{message}</p>
        </div>
        
        <div className="success-modal-footer">
          <button className="success-btn-primary" onClick={handleConfirm}>
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
