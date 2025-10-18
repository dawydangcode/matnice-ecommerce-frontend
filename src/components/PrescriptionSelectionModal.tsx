import React, { useState } from 'react';
import { X } from 'lucide-react';
import { UserPrescription } from '../services/user-prescription.service';
import './PrescriptionSelectionModal.css';

interface PrescriptionSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  prescriptions: UserPrescription[];
  onSelect: (prescription: UserPrescription) => void;
  selectedLensType: string;
}

const PrescriptionSelectionModal: React.FC<PrescriptionSelectionModalProps> = ({
  isOpen,
  onClose,
  prescriptions,
  onSelect,
  selectedLensType,
}) => {
  const [selectedPrescriptionId, setSelectedPrescriptionId] = useState<number | null>(null);

  if (!isOpen) return null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const needsAddValue = () => {
    return ['PROGRESSIVE', 'OFFICE'].includes(selectedLensType);
  };

  const handlePrescriptionClick = (prescriptionId: number) => {
    setSelectedPrescriptionId(prescriptionId);
  };

  const handleUseSelected = () => {
    const selected = prescriptions.find(p => p.id === selectedPrescriptionId);
    if (selected) {
      onSelect(selected);
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <h2 className="modal-title">Select the prescription values to be used</h2>
          <button onClick={onClose} className="modal-close-btn">
            <X size={24} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          <div className="prescriptions-grid">
            {prescriptions.map((prescription) => (
              <div
                key={prescription.id}
                className={`prescription-card ${selectedPrescriptionId === prescription.id ? 'selected' : ''}`}
                onClick={() => handlePrescriptionClick(prescription.id)}
              >
                <div className="prescription-card-header">
                  <p className="prescription-date-label">Values entered in the customer account on</p>
                  <p className="prescription-date">{formatDate(prescription.createdAt)}</p>
                </div>

                <div className="prescription-card-body">
                  <div className="prescription-row prescription-header-row">
                    <div></div>
                    <div className="prescription-col-header">Right eye</div>
                    <div className="prescription-col-header">Left eye</div>
                  </div>

                  {/* Sphere */}
                  <div className="prescription-row">
                    <div className="prescription-label">Sphere (S / SPH)</div>
                    <div className="prescription-value">{Number(prescription.rightEyeSph).toFixed(2)} dpt</div>
                    <div className="prescription-value">{Number(prescription.leftEyeSph).toFixed(2)} dpt</div>
                  </div>

                  {/* Cylinder */}
                  <div className="prescription-row">
                    <div className="prescription-label">Cylinder (ZYL / CYL)</div>
                    <div className="prescription-value">{Number(prescription.rightEyeCyl).toFixed(2)} dpt</div>
                    <div className="prescription-value">{Number(prescription.leftEyeCyl).toFixed(2)} dpt</div>
                  </div>

                  {/* Axis */}
                  <div className="prescription-row">
                    <div className="prescription-label">Axis (A/ACH)</div>
                    <div className="prescription-value">{prescription.rightEyeAxis} º</div>
                    <div className="prescription-value">{prescription.leftEyeAxis} º</div>
                  </div>

                  {/* Add (only for Progressive/Office) */}
                  {needsAddValue() && (
                    <div className="prescription-row">
                      <div className="prescription-label">Add (ADD)</div>
                      <div className="prescription-value">
                        {prescription.rightEyeAdd ? Number(prescription.rightEyeAdd).toFixed(2) + ' dpt' : '-'}
                      </div>
                      <div className="prescription-value">
                        {prescription.leftEyeAdd ? Number(prescription.leftEyeAdd).toFixed(2) + ' dpt' : '-'}
                      </div>
                    </div>
                  )}

                  {/* PD */}
                  <div className="prescription-row">
                    <div className="prescription-label">Pupillary distance (PD)</div>
                    <div className="prescription-value">{Number(prescription.pdRight).toFixed(2)} mm</div>
                    <div className="prescription-value">{Number(prescription.pdLeft).toFixed(2)} mm</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button
            onClick={handleUseSelected}
            disabled={!selectedPrescriptionId}
            className={`use-selected-btn ${!selectedPrescriptionId ? 'disabled' : ''}`}
          >
            Use selected prescription values
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionSelectionModal;
