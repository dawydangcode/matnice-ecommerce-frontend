import React, { useState, useEffect, useCallback } from 'react';
import userPrescriptionService, { UserPrescription } from '../services/user-prescription.service';
import PrescriptionModal from './PrescriptionModal';
import { Plus, Edit, Trash2, Star, Info } from 'lucide-react';
import toast from 'react-hot-toast';
import clsx from 'clsx';

const MyPrescriptions: React.FC = () => {
  const [prescriptions, setPrescriptions] = useState<UserPrescription[]>([]);
  const [selectedPrescription, setSelectedPrescription] =
    useState<UserPrescription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [prescriptionToEdit, setPrescriptionToEdit] = useState<UserPrescription | null>(null);

  const fetchPrescriptions = useCallback(async () => {
    setIsLoading(true);
    try {
      console.log('Fetching prescriptions...');
      const data = await userPrescriptionService.getPrescriptions();
      console.log('Prescriptions response:', data);
      const fetchedPrescriptions = data?.data || [];
      setPrescriptions(fetchedPrescriptions);

      if (fetchedPrescriptions.length > 0) {
        const defaultPrescription =
          fetchedPrescriptions.find((p) => p.isDefault) ||
          fetchedPrescriptions[0];
        setSelectedPrescription(defaultPrescription);
      } else {
        setSelectedPrescription(null);
      }
    } catch (error) {
      console.error('Failed to fetch prescriptions:', error);
      toast.error('Could not load your prescriptions.');
      setPrescriptions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrescriptions();
  }, [fetchPrescriptions]);

  const handleOpenModal = (prescription: UserPrescription | null = null) => {
    setPrescriptionToEdit(prescription);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setPrescriptionToEdit(null);
  };

  const handleSave = (savedPrescription: UserPrescription) => {
    // After saving, refetch the list to get the latest data
    fetchPrescriptions();
    // Optionally, you can set the newly saved prescription as the selected one
    // For now, we just close the modal and let the refetched list update the view.
    handleCloseModal();
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this prescription?')) {
      try {
        await userPrescriptionService.deletePrescription(id);
        toast.success('Prescription deleted.');
        fetchPrescriptions(); // Refetch to update the list
      } catch (error) {
        console.error('Failed to delete prescription:', error);
        toast.error('Failed to delete prescription.');
      }
    }
  };

  const handleSetDefault = async (id: number) => {
    try {
      await userPrescriptionService.setDefaultPrescription(id);
      toast.success('Default prescription updated.');
      fetchPrescriptions(); // Refetch to update the default status everywhere
    } catch (error) {
      console.error('Failed to set default prescription:', error);
      toast.error('Failed to set as default.');
    }
  };

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'pm' : 'am';
    const hour12 = String(hours % 12 || 12).padStart(2, '0');
    return `${day}.${month}.${year} / ${hour12}:${minutes}:${seconds} ${ampm}`;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">My Prescriptions</h2>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Prescription
          </button>
        </div>

        {isLoading ? (
          <p>Loading prescriptions...</p>
        ) : prescriptions && prescriptions.length > 0 ? (
          <>
            <div className="flex space-x-4 mb-6">
              {prescriptions.map((p) => (
                <div
                  key={p.id}
                  onClick={() => setSelectedPrescription(p)}
                  className={clsx(
                    'p-4 rounded-lg cursor-pointer border-b-4',
                    {
                      'bg-white shadow-md border-green-500':
                        selectedPrescription?.id === p.id,
                      'bg-gray-200 border-transparent':
                        selectedPrescription?.id !== p.id,
                    },
                  )}
                >
                  <h3 className="font-semibold text-gray-800">
                    {formatDateTime(p.createdAt)}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Customer account input
                  </p>
                </div>
              ))}
            </div>

            {selectedPrescription && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="grid grid-cols-5 gap-4 text-center mb-4">
                  <div className="font-semibold text-gray-600"></div>
                  <div className="font-semibold text-gray-600 flex items-center justify-center">
                    Sphere <Info className="w-4 h-4 ml-1" />
                    <span className="block text-xs text-gray-400 w-full">
                      S / SPH
                    </span>
                  </div>
                  <div className="font-semibold text-gray-600 flex items-center justify-center">
                    Cylinder <Info className="w-4 h-4 ml-1" />
                    <span className="block text-xs text-gray-400 w-full">
                      ZYL / CYL
                    </span>
                  </div>
                  <div className="font-semibold text-gray-600 flex items-center justify-center">
                    Add <Info className="w-4 h-4 ml-1" />
                    <span className="block text-xs text-gray-400 w-full">
                      ADD
                    </span>
                  </div>
                  <div className="font-semibold text-gray-600 flex items-center justify-center">
                    PD <Info className="w-4 h-4 ml-1" />
                    <span className="block text-xs text-gray-400 w-full">
                      PD
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-5 gap-4 text-center items-center mb-2">
                  <div className="text-left font-medium text-gray-800">
                    Right eye
                  </div>
                  <div>{Number(selectedPrescription.rightEyeSph).toFixed(2)}</div>
                  <div>{Number(selectedPrescription.rightEyeCyl).toFixed(2)}</div>
                  <div>{selectedPrescription.rightEyeAdd ? Number(selectedPrescription.rightEyeAdd).toFixed(2) : '-'}</div>
                  <div>{Number(selectedPrescription.pdRight).toFixed(2)}</div>
                </div>

                <div className="grid grid-cols-5 gap-4 text-center items-center">
                  <div className="text-left font-medium text-gray-800">
                    Left eye
                  </div>
                  <div>{Number(selectedPrescription.leftEyeSph).toFixed(2)}</div>
                  <div>{Number(selectedPrescription.leftEyeCyl).toFixed(2)}</div>
                  <div>{selectedPrescription.leftEyeAdd ? Number(selectedPrescription.leftEyeAdd).toFixed(2) : '-'}</div>
                  <div>{Number(selectedPrescription.pdLeft).toFixed(2)}</div>
                </div>

                {selectedPrescription.notes && (
                  <div className="mt-4 pt-4 border-t">
                    <p>
                      <span className="font-medium">Notes:</span>{' '}
                      {selectedPrescription.notes}
                    </p>
                  </div>
                )}

                <div className="mt-6 pt-4 border-t flex items-center justify-between">
                  <div>
                    {!selectedPrescription.isDefault && (
                      <button
                        onClick={() => handleSetDefault(selectedPrescription.id)}
                        className="text-sm text-green-600 hover:text-green-800 font-medium"
                      >
                        Set as default
                      </button>
                    )}
                     {selectedPrescription.isDefault && (
                        <div className="flex items-center text-sm text-yellow-600">
                          <Star className="w-4 h-4 mr-1" />
                          This is your default prescription
                        </div>
                      )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleOpenModal(selectedPrescription)}
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-full"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(selectedPrescription.id)}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded-full"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <p className="text-gray-500">
              You haven't added any prescriptions yet.
            </p>
            <p className="text-gray-500 mt-2">
              Click 'Add Prescription' to get started.
            </p>
          </div>
        )}

        <PrescriptionModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSave}
          prescriptionToEdit={prescriptionToEdit}
        />
      </div>
    </div>
  );
};

export default MyPrescriptions;
