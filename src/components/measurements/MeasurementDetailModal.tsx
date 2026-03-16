import React from 'react';
import { Modal } from '../ui/Modal';
import { Edit } from 'lucide-react';
import type { Measurement } from '../../lib/types';
import { format } from 'date-fns';

interface Props {
  measurement: Measurement | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (measurement: Measurement) => void; // now passes the whole measurement
}

export const MeasurementDetailModal: React.FC<Props> = ({
  measurement,
  isOpen,
  onClose,
  onEdit,
}) => {
  if (!measurement) return null;

  const fields = [
    { label: 'Chest', value: measurement.measurements?.chest },
    { label: 'Waist', value: measurement.measurements?.waist },
    { label: 'Length', value: measurement.measurements?.length },
    { label: 'Shoulder', value: measurement.measurements?.shoulder },
  ];

  const handleEdit = () => {
    onEdit(measurement); // pass the whole object
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Measurement Details" maxWidth="sm">
      <div className="space-y-4 font-handwriting">
        <div>
          <p className="text-sm text-white/50">Customer</p>
          <p className="text-lg text-white/90">{measurement.customerName}</p>
          {measurement.customerPhone && (
            <p className="text-sm text-white/50">{measurement.customerPhone}</p>
          )}
        </div>

        <div className="bg-white/5 p-4 rounded-lg border border-white/10">
          <div className="grid grid-cols-2 gap-3">
            {fields.map((field) => (
              <div key={field.label}>
                <p className="text-xs text-white/50">{field.label}</p>
                <p className="text-lg text-white/90">{field.value || '—'} cm</p>
              </div>
            ))}
          </div>
        </div>

        {measurement.notes && (
          <div>
            <p className="text-sm text-white/50">Notes</p>
            <p className="text-white/80 whitespace-pre-wrap">{measurement.notes}</p>
          </div>
        )}

        <p className="text-xs text-white/30 text-right">
          Taken on {format(measurement.date, 'PPP')}
        </p>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleEdit}
            className="px-4 py-2 bg-indigo-600/80 hover:bg-indigo-600 text-white rounded-lg flex items-center gap-2 transition text-sm"
          >
            <Edit className="w-4 h-4" />
            Edit Measurement
          </button>
        </div>
      </div>
    </Modal>
  );
};