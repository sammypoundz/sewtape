import React from 'react';
import { Modal } from '../ui/Modal';
import { Trash2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  customerName: string;
}

export const DeleteConfirmModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onConfirm,
  customerName,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Measurement" maxWidth="sm">
      <div className="space-y-4">
        <p className="text-white/80">
          Are you sure you want to delete the measurement for{' '}
          <span className="font-medium text-white">{customerName}</span>? This action cannot be
          undone.
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/80 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600/80 hover:bg-red-600 text-white rounded-lg flex items-center gap-2 transition"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>
    </Modal>
  );
};