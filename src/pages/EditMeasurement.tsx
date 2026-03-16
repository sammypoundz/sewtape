import React, { useState, useEffect, useRef } from 'react';
import { MobileLayout } from '../layout/MobileLayout';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Ruler } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Measurement } from '../lib/types';

export const EditMeasurement = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const passedMeasurement = location.state?.measurement as Measurement | undefined;
  const mounted = useRef(true);
  const isSavingRef = useRef(false);

  const [loading, setLoading] = useState(!passedMeasurement);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    customerName: passedMeasurement?.customerName || '',
    customerPhone: passedMeasurement?.customerPhone || '',
    chest: passedMeasurement?.measurements?.chest?.toString() || '',
    waist: passedMeasurement?.measurements?.waist?.toString() || '',
    length: passedMeasurement?.measurements?.length?.toString() || '',
    shoulder: passedMeasurement?.measurements?.shoulder?.toString() || '',
    notes: passedMeasurement?.notes || '',
  });

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (passedMeasurement || !id) {
      setLoading(false);
      return;
    }

    const fetchMeasurement = async () => {
      try {
        const docRef = doc(db, 'measurements', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (mounted.current) {
            setFormData({
              customerName: data.customerName || '',
              customerPhone: data.customerPhone || '',
              chest: data.measurements?.chest?.toString() || '',
              waist: data.measurements?.waist?.toString() || '',
              length: data.measurements?.length?.toString() || '',
              shoulder: data.measurements?.shoulder?.toString() || '',
              notes: data.notes || '',
            });
          }
        } else if (mounted.current) {
          setError('Measurement not found');
        }
      } catch (err) {
        console.error('Error fetching measurement:', err);
        if (mounted.current) {
          setError('Failed to load measurement');
        }
      } finally {
        if (mounted.current) {
          setLoading(false);
        }
      }
    };
    fetchMeasurement();
  }, [id, passedMeasurement]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !id) return;

    setSaving(true);
    isSavingRef.current = true;
    setError('');

    // Safety timeout: force navigation after 5 seconds if still saving
    const safetyTimeout = setTimeout(() => {
      if (mounted.current && isSavingRef.current) {
        console.warn('UpdateDoc timeout – assuming success, navigating back');
        navigate('/measurements');
      }
    }, 5000);

    try {
      const measurements = {
        chest: formData.chest ? parseFloat(formData.chest) : 0,
        waist: formData.waist ? parseFloat(formData.waist) : 0,
        length: formData.length ? parseFloat(formData.length) : 0,
        shoulder: formData.shoulder ? parseFloat(formData.shoulder) : 0,
      };
      const docRef = doc(db, 'measurements', id);
      await updateDoc(docRef, {
        customerName: formData.customerName.trim(),
        customerPhone: formData.customerPhone.trim() || null,
        measurements,
        notes: formData.notes.trim() || null,
        date: new Date(),
      });
      clearTimeout(safetyTimeout);
      if (mounted.current) {
        navigate('/measurements');
      }
    } catch (err: any) {
      clearTimeout(safetyTimeout);
      console.error('Error updating measurement:', err);
      if (mounted.current) {
        setError(err.message || 'Failed to update measurement');
        setSaving(false);
        isSavingRef.current = false;
      }
    }
  };

  if (loading) {
    return (
      <MobileLayout title="Edit Measurement" showBackButton onBack={() => navigate(-1)}>
        <div className="space-y-4 animate-pulse mt-4">
          <div className="h-10 bg-white/5 rounded-lg"></div>
          <div className="h-10 bg-white/5 rounded-lg"></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="h-10 bg-white/5 rounded-lg"></div>
            <div className="h-10 bg-white/5 rounded-lg"></div>
            <div className="h-10 bg-white/5 rounded-lg"></div>
            <div className="h-10 bg-white/5 rounded-lg"></div>
          </div>
          <div className="h-20 bg-white/5 rounded-lg"></div>
          <div className="h-10 bg-indigo-600/30 rounded-lg"></div>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout title="Edit Measurement" showBackButton onBack={() => navigate(-1)}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-500/20 border border-red-500/30 text-red-300 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-white/70 mb-1">Customer Name</label>
          <input
            type="text"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white/90 placeholder-white/30"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/70 mb-1">Phone (optional)</label>
          <input
            type="tel"
            name="customerPhone"
            value={formData.customerPhone}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white/90 placeholder-white/30"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1">Chest (cm)</label>
            <input
              type="number"
              name="chest"
              value={formData.chest}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white/90 placeholder-white/30"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1">Waist (cm)</label>
            <input
              type="number"
              name="waist"
              value={formData.waist}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white/90 placeholder-white/30"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1">Length (cm)</label>
            <input
              type="number"
              name="length"
              value={formData.length}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white/90 placeholder-white/30"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1">Shoulder (cm)</label>
            <input
              type="number"
              name="shoulder"
              value={formData.shoulder}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white/90 placeholder-white/30"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-white/70 mb-1">Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white/90 placeholder-white/30"
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="w-full bg-indigo-600/80 hover:bg-indigo-600 text-white py-2 px-4 rounded-lg transition flex items-center justify-center gap-2 backdrop-blur-sm disabled:opacity-50"
        >
          <Ruler className="w-4 h-4" />
          {saving ? 'Updating...' : 'Update Measurement'}
        </button>
      </form>
    </MobileLayout>
  );
};