import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { X } from 'lucide-react';
import userPrescriptionService, {
  CreateUserPrescriptionDto,
  UpdateUserPrescriptionDto,
  UserPrescription,
} from '../services/user-prescription.service';
import toast from 'react-hot-toast';

const prescriptionSchema = z.object({
  rightEyeSph: z.number(),
  rightEyeCyl: z.number(),
  rightEyeAxis: z.number().min(0).max(180),
  rightEyeAdd: z.number().optional(),
  leftEyeSph: z.number(),
  leftEyeCyl: z.number(),
  leftEyeAxis: z.number().min(0).max(180),
  leftEyeAdd: z.number().optional(),
  pdRight: z.number().min(20).max(40),
  pdLeft: z.number().min(20).max(40),
  isDefault: z.boolean().optional(),
  notes: z.string().optional(),
});

type PrescriptionFormValues = z.infer<typeof prescriptionSchema>;

// Define a more specific type for keys that use the select component
type PrescriptionSelectKeys =
  | 'rightEyeSph'
  | 'rightEyeCyl'
  | 'rightEyeAxis'
  | 'rightEyeAdd'
  | 'leftEyeSph'
  | 'leftEyeCyl'
  | 'leftEyeAxis'
  | 'leftEyeAdd'
  | 'pdRight'
  | 'pdLeft';

interface PrescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (prescription: UserPrescription) => void;
  prescriptionToEdit?: UserPrescription | null;
}

const generateOptions = (start: number, end: number, step: number) => {
  const options = [];
  for (let i = start; i <= end; i += step) {
    options.push({
      value: i,
      label: i === 0 ? `±${i.toFixed(2)}` : i > 0 ? `+${i.toFixed(2)}` : i.toFixed(2),
    });
  }
  return options;
};

const axisOptions = Array.from({ length: 181 }, (_, i) => ({
  value: i,
  label: `${i}°`,
}));

const pdOptions = generateOptions(20, 40, 0.5);
const sphOptions = generateOptions(-20, 20, 0.25);
const cylOptions = generateOptions(-6, 6, 0.25);
const addOptions = [{ value: undefined, label: '-' }, ...generateOptions(0.75, 3.5, 0.25)];

const PrescriptionModal: React.FC<PrescriptionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  prescriptionToEdit,
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<PrescriptionFormValues>({
    resolver: zodResolver(prescriptionSchema),
    defaultValues: {
      rightEyeSph: 0.0,
      rightEyeCyl: 0.0,
      rightEyeAxis: 0,
      rightEyeAdd: undefined,
      leftEyeSph: 0.0,
      leftEyeCyl: 0.0,
      leftEyeAxis: 0,
      leftEyeAdd: undefined,
      pdRight: 32.0,
      pdLeft: 32.0,
      isDefault: false,
      notes: '',
    },
  });

  useEffect(() => {
    if (prescriptionToEdit) {
      reset({
        ...prescriptionToEdit,
        rightEyeAdd: prescriptionToEdit.rightEyeAdd ?? undefined,
        leftEyeAdd: prescriptionToEdit.leftEyeAdd ?? undefined,
        notes: prescriptionToEdit.notes ?? '',
      });
    } else {
      // Reset to default values for a new form
      reset({
        rightEyeSph: 0.0,
        rightEyeCyl: 0.0,
        rightEyeAxis: 0,
        rightEyeAdd: undefined,
        leftEyeSph: 0.0,
        leftEyeCyl: 0.0,
        leftEyeAxis: 0,
        leftEyeAdd: undefined,
        pdRight: 32.0,
        pdLeft: 32.0,
        isDefault: false,
        notes: '',
      });
    }
  }, [prescriptionToEdit, reset]);

  const onSubmit = async (data: PrescriptionFormValues) => {
    try {
      let savedPrescription;
      if (prescriptionToEdit) {
        savedPrescription = await userPrescriptionService.updatePrescription(
          prescriptionToEdit.id,
          data as UpdateUserPrescriptionDto,
        );
        toast.success('Prescription updated successfully!');
      } else {
        savedPrescription = await userPrescriptionService.createPrescription(
          data as CreateUserPrescriptionDto,
        );
        toast.success('Prescription added successfully!');
      }
      onSave(savedPrescription);
      onClose();
    } catch (error) {
      console.error('Failed to save prescription:', error);
      toast.error('Failed to save prescription.');
    }
  };

  if (!isOpen) return null;

  const renderSelect = (name: PrescriptionSelectKeys, options: { value: any; label: string }[], label: string) => (
    <div className="flex flex-col">
      <label className="text-center text-sm font-medium text-gray-700 mb-2">{label}</label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <select
            {...field}
            value={field.value ?? ''}
            onChange={(e) => {
              const value = e.target.value;
              // For 'ADD' options, 'undefined' is a valid value if '-' is selected
              if (name.endsWith('Add') && value === 'undefined') {
                field.onChange(undefined);
              } else {
                field.onChange(parseFloat(value));
              }
            }}
            className="w-full border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500"
          >
            {options.map((opt) => (
              <option key={opt.label} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        )}
      />
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {prescriptionToEdit ? 'Edit' : 'New'} glasses prescription values
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-6 gap-x-4 gap-y-6 items-end">
            {/* Headers */}
            <div className="col-span-1"></div>
            <div className="text-center font-bold text-gray-800">Sphere</div>
            <div className="text-center font-bold text-gray-800">Cylinder</div>
            <div className="text-center font-bold text-gray-800">Axis</div>
            <div className="text-center font-bold text-gray-800">Add</div>
            <div className="text-center font-bold text-gray-800">PD</div>

            {/* Right Eye */}
            <div className="font-bold text-gray-800 text-right">Right eye</div>
            {renderSelect('rightEyeSph', sphOptions, 'S / SPH')}
            {renderSelect('rightEyeCyl', cylOptions, 'ZYL / CYL')}
            {renderSelect('rightEyeAxis', axisOptions, 'A / ACH')}
            {renderSelect('rightEyeAdd', addOptions, 'ADD')}
            {renderSelect('pdRight', pdOptions, 'PD')}

            {/* Left Eye */}
            <div className="font-bold text-gray-800 text-right">Left eye</div>
            {renderSelect('leftEyeSph', sphOptions, 'S / SPH')}
            {renderSelect('leftEyeCyl', cylOptions, 'ZYL / CYL')}
            {renderSelect('leftEyeAxis', axisOptions, 'A / ACH')}
            {renderSelect('leftEyeAdd', addOptions, 'ADD')}
            {renderSelect('pdLeft', pdOptions, 'PD')}
          </div>

          <div className="mt-6">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
              Notes
            </label>
            <Controller
              name="notes"
              control={control}
              render={({ field }) => (
                <textarea
                  {...field}
                  id="notes"
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
              )}
            />
          </div>
          
          <div className="mt-4">
            <Controller
              name="isDefault"
              control={control}
              render={({ field }) => (
                <div className="flex items-center">
                  <input
                    id="isDefault"
                    type="checkbox"
                    checked={field.value}
                    onChange={field.onChange}
                    className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-900">
                    Set as default prescription
                  </label>
                </div>
              )}
            />
          </div>
        </form>

        <div className="p-4 border-t bg-gray-50">
          <button
            type="submit"
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 disabled:bg-green-300 transition-colors"
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionModal;
