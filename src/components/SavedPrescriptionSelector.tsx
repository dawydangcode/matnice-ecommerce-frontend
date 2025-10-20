import React, { useState, useEffect, useCallback } from 'react';
import userPrescriptionService, { UserPrescription } from '../services/user-prescription.service';
import { useAuthStore } from '../stores/auth.store';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import PrescriptionSelectionModal from './PrescriptionSelectionModal';
import './SavedPrescriptionSelector.css';

interface SavedPrescriptionSelectorProps {
  onPrescriptionSelect: (prescription: UserPrescription) => void;
  selectedLensType: string;
}

const SavedPrescriptionSelector: React.FC<SavedPrescriptionSelectorProps> = ({
  onPrescriptionSelect,
  selectedLensType,
}) => {
  const [prescriptions, setPrescriptions] = useState<UserPrescription[]>([]);
  const [selectedPrescription, setSelectedPrescription] = useState<UserPrescription | null>(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isLoggedIn } = useAuthStore();
  const navigate = useNavigate();

  const loadPrescriptions = useCallback(async () => {
    setLoading(true);
    try {
      const response = await userPrescriptionService.getPrescriptions();
      const fetchedPrescriptions = response?.data || [];
      setPrescriptions(fetchedPrescriptions);

      if (fetchedPrescriptions.length > 0) {
        const defaultPrescription =
          fetchedPrescriptions.find((p) => p.isDefault) || fetchedPrescriptions[0];
        setSelectedPrescription(defaultPrescription);
        onPrescriptionSelect(defaultPrescription);
      }
    } catch (error) {
      console.error('Failed to load prescriptions:', error);
      toast.error('Failed to load saved prescriptions');
    } finally {
      setLoading(false);
    }
  }, [onPrescriptionSelect]);

  useEffect(() => {
    if (isLoggedIn) {
      loadPrescriptions();
    }
  }, [isLoggedIn, loadPrescriptions]);

  const handlePrescriptionSelect = (prescription: UserPrescription) => {
    setSelectedPrescription(prescription);
    onPrescriptionSelect(prescription);
    setIsModalOpen(false);
  };

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  if (!isLoggedIn) {
    return (
      <div className="border-2 rounded-lg p-6 saved-prescription-border">
        <h3 className="font-semibold text-gray-900 mb-2">Use saved prescription values</h3>
        <p className="text-gray-600 text-sm mb-4">
          Please sign in to load saved values from your account.
        </p>
        <button
          onClick={() => navigate('/login')}
          className="bg-gray-800 text-white py-2 px-6 rounded-lg font-medium hover:bg-gray-900 transition-colors"
        >
          Login now
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="border-2 rounded-lg p-6 saved-prescription-border">
        <h3 className="font-semibold text-gray-900 mb-2">Use saved prescription values</h3>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading prescriptions...</span>
        </div>
      </div>
    );
  }

  if (prescriptions.length === 0) {
    return (
      <div className="border-2 rounded-lg p-6 saved-prescription-border">
        <h3 className="font-semibold text-gray-900 mb-2">Use saved prescription values</h3>
        <p className="text-gray-600 text-sm mb-4">
          We couldn't load any values from this customer account. Enter your prescription values manually or book a free eye test if you don't have any prescription values yet.
        </p>
      </div>
    );
  }

  return (
    <div className="border-2 rounded-lg p-6 saved-prescription-border">
      <h3 className="font-semibold text-gray-900 mb-4">Use saved prescription values</h3>
      
      {selectedPrescription && (
        <>
          <p className="text-gray-600 text-sm mb-4">
            Values entered in the customer account on {formatDateTime(selectedPrescription.createdAt)}
          </p>

          {/* Prescription Table */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-4">
            <div className="prescription-grid">
              {/* Header Row */}
              <div className="prescription-headers with-add">
                <div className="prescription-spacer"></div>
                <div className="prescription-type-header">
                  Sphere<br />
                  <span className="text-xs text-gray-400">(S / SPH)</span>
                </div>
                <div className="prescription-type-header">
                  Cylinder<br />
                  <span className="text-xs text-gray-400">(ZYL / CYL)</span>
                </div>
                <div className="prescription-type-header">
                  Axis<br />
                  <span className="text-xs text-gray-400">(A/ACH)</span>
                </div>
                <div className="prescription-type-header">
                  Add<br />
                  <span className="text-xs text-gray-400">(ADD)</span>
                </div>
                <div className="prescription-type-header">
                  Pupillary distance<br />
                  <span className="text-xs text-gray-400">(PD)</span>
                </div>
              </div>

              {/* Right Eye Row */}
              <div className="prescription-values-row with-add">
                <div className="prescription-eye-label">Right eye</div>
                <div className="prescription-value-box">{Number(selectedPrescription.rightEyeSph).toFixed(2)} dpt</div>
                <div className="prescription-value-box">{Number(selectedPrescription.rightEyeCyl).toFixed(2)} dpt</div>
                <div className="prescription-value-box">{selectedPrescription.rightEyeAxis}º</div>
                <div className="prescription-value-box">
                  {selectedPrescription.rightEyeAdd ? Number(selectedPrescription.rightEyeAdd).toFixed(2) : '-'} dpt
                </div>
                <div className="prescription-value-box">{Number(selectedPrescription.pdRight).toFixed(2)} mm</div>
              </div>

              {/* Left Eye Row */}
              <div className="prescription-values-row with-add">
                <div className="prescription-eye-label">Left eye</div>
                <div className="prescription-value-box">{Number(selectedPrescription.leftEyeSph).toFixed(2)} dpt</div>
                <div className="prescription-value-box">{Number(selectedPrescription.leftEyeCyl).toFixed(2)} dpt</div>
                <div className="prescription-value-box">{selectedPrescription.leftEyeAxis}º</div>
                <div className="prescription-value-box">
                  {selectedPrescription.leftEyeAdd ? Number(selectedPrescription.leftEyeAdd).toFixed(2) : '-'} dpt
                </div>
                <div className="prescription-value-box">{Number(selectedPrescription.pdLeft).toFixed(2)} mm</div>
              </div>
            </div>
          </div>

          {/* Load Other Prescriptions Button */}
          {prescriptions.length > 1 && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-blue-600 text-sm hover:underline mb-4"
            >
              Load other prescriptions
            </button>
          )}
        </>
      )}

      {/* Prescription Selection Modal */}
      <PrescriptionSelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        prescriptions={prescriptions}
        onSelect={handlePrescriptionSelect}
        selectedLensType={selectedLensType}
      />
    </div>
  );
};

export default SavedPrescriptionSelector;
