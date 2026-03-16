import { MobileLayout } from '../layout/MobileLayout';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { useMeasurements } from '../hooks/useMeasurements';
import { formatDistanceToNow } from 'date-fns';
import { useState, useEffect, useRef } from 'react';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { MeasurementDetailModal } from '../components/measurements/MeasurementDetailModal';
import { DeleteConfirmModal } from '../components/measurements/DeleteConfirmModal';
import toast from 'react-hot-toast';
import type { Measurement } from '../lib/types';

export const Measurements = () => {
  const { measurements, loading } = useMeasurements();
  const navigate = useNavigate();
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [selectedMeasurement, setSelectedMeasurement] = useState<Measurement | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (activeMenuId && menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeMenuId]);

  const toggleMenu = (id: string) => {
    setActiveMenuId(prev => (prev === id ? null : id));
  };

  const handleEdit = (measurement: Measurement) => {
    setActiveMenuId(null);
    navigate(`/measurements/edit/${measurement.id}`, {
      state: { measurement },
    });
  };

  const handleDeleteClick = (measurement: Measurement) => {
    setSelectedMeasurement(measurement);
    setDeleteModalOpen(true);
    setActiveMenuId(null);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedMeasurement) return;

    // Close modal immediately
    setDeleteModalOpen(false);
    const measurementToDelete = selectedMeasurement;
    setSelectedMeasurement(null);

    // If detail modal is open for this measurement, close it too
    if (detailModalOpen && selectedMeasurement.id === measurementToDelete.id) {
      setDetailModalOpen(false);
    }

    try {
      await deleteDoc(doc(db, 'measurements', measurementToDelete.id!));
      toast.success('Measurement deleted');
    } catch (error) {
      console.error('Error deleting measurement:', error);
      toast.error('Failed to delete measurement. Please try again.');
    }
  };

  const handleCardClick = (measurement: Measurement) => {
    setSelectedMeasurement(measurement);
    setDetailModalOpen(true);
  };

  if (loading) {
    return (
      <MobileLayout
        title="Measurements"
        action={
          <div className="p-1 opacity-50">
            <Plus className="w-5 h-5 text-white/70" />
          </div>
        }
      >
        <div className="space-y-3 animate-pulse mt-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="h-5 w-32 bg-white/10 rounded mb-2"></div>
              <div className="h-4 w-48 bg-white/10 rounded mb-2"></div>
              <div className="h-3 w-24 bg-white/10 rounded"></div>
            </div>
          ))}
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout
      title="Measurements"
      action={
        <Link to="/measurements/new" className="p-1 transition-transform active:scale-90">
          <Plus className="w-5 h-5 text-white/70" />
        </Link>
      }
    >
      <div className="space-y-3 animate-in fade-in duration-500 mt-4">
        {measurements.length > 0 ? (
          measurements.map((m, index) => (
            <div
              key={m.id}
              onClick={() => handleCardClick(m)}
              className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 transform transition-all duration-200 ease-out hover:scale-[1.02] hover:shadow-xl hover:-translate-y-1 relative cursor-pointer"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-white/90">{m.customerName}</h3>
                  <p className="text-sm text-white/50 mt-1">
                    Chest: {m.measurements?.chest || '—'}cm • Waist: {m.measurements?.waist || '—'}cm • Length: {m.measurements?.length || '—'}cm
                  </p>
                  <p className="text-xs text-white/30 mt-2">
                    Last updated: {formatDistanceToNow(m.date, { addSuffix: true })}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleMenu(m.id!);
                  }}
                  className="p-1 opacity-50 hover:opacity-100 transition-opacity"
                >
                  <MoreVertical className="w-4 h-4 text-white/70" />
                </button>
              </div>

              {activeMenuId === m.id && (
                <div
                  ref={menuRef}
                  className="absolute right-4 top-12 bg-gray-800 border border-white/10 rounded-lg shadow-xl py-1 z-20 min-w-[120px]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => handleEdit(m)}
                    className="w-full px-4 py-2 text-left text-sm text-white/80 hover:bg-white/10 flex items-center gap-2"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(m)}
                    className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-white/10 flex items-center gap-2"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-sm text-white/50 text-center py-8 animate-in fade-in duration-300">
            No measurements yet. Create your first one!
          </p>
        )}
      </div>

      <MeasurementDetailModal
        measurement={selectedMeasurement}
        isOpen={detailModalOpen}
        onClose={() => {
          setDetailModalOpen(false);
          setSelectedMeasurement(null);
        }}
        onEdit={(measurement) => {
          setDetailModalOpen(false);
          navigate(`/measurements/edit/${measurement.id}`, {
            state: { measurement },
          });
        }}
      />

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedMeasurement(null);
        }}
        onConfirm={handleDeleteConfirm}
        customerName={selectedMeasurement?.customerName || ''}
      />
    </MobileLayout>
  );
};