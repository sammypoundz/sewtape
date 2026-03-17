import React, { useState, useEffect, useRef } from 'react';
import { MobileLayout } from '../layout/MobileLayout';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Bell, Calendar } from 'lucide-react';                // ✅ Calendar is now used
import { useAuth } from '../contexts/AuthContext';
import { useClients } from '../hooks/useClients';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { LocalNotifications } from '@capacitor/local-notifications';
import toast from 'react-hot-toast';
import type { Reminder } from '../lib/types';                 // make sure this file is updated

export const EditReminder = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const passedReminder = location.state?.reminder as Reminder | undefined;
  const { clients } = useClients();
  const mounted = useRef(true);
  const isSavingRef = useRef(false);

  const [loading, setLoading] = useState(!passedReminder);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: passedReminder?.title || '',
    description: passedReminder?.description || '',
    date: passedReminder?.remindAt ? new Date(passedReminder.remindAt).toISOString().split('T')[0] : '',
    time: passedReminder?.remindAt ? new Date(passedReminder.remindAt).toTimeString().slice(0, 5) : '',
    relatedClient: passedReminder?.relatedClient || '',      // ✅ uses new field
  });

  const [existingNotificationId, setExistingNotificationId] = useState<number | null>(null);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  // Request permissions once
  useEffect(() => {
    LocalNotifications.requestPermissions().then(result => {
      if (result.display !== 'granted') {
        toast('Notifications disabled – you will not be reminded', { icon: '⚠️' });
      }
    });
  }, []);

  // Fetch if no passed data
  useEffect(() => {
    if (passedReminder || !id) {
      setLoading(false);
      return;
    }

    const fetchReminder = async () => {
      try {
        const docRef = doc(db, 'reminders', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          const remindAt = data.remindAt?.toDate ? data.remindAt.toDate() : new Date();
          if (mounted.current) {
            setFormData({
              title: data.title || '',
              description: data.description || '',
              date: remindAt.toISOString().split('T')[0],
              time: remindAt.toTimeString().slice(0, 5),
              relatedClient: data.relatedClient || '',
            });
            setExistingNotificationId(data.notificationId || null);
          }
        } else if (mounted.current) {
          setError('Reminder not found');
        }
      } catch (err) {
        console.error('Error fetching reminder:', err);
        if (mounted.current) setError('Failed to load reminder');
      } finally {
        if (mounted.current) setLoading(false);
      }
    };
    fetchReminder();
  }, [id, passedReminder]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !id) return;

    setSaving(true);
    isSavingRef.current = true;
    setError('');

    const safetyTimeout = setTimeout(() => {
      if (mounted.current && isSavingRef.current) {
        console.warn('Update timeout – assuming success, redirecting');
        navigate('/reminders');
      }
    }, 5000);

    try {
      const remindAt = new Date(`${formData.date}T${formData.time || '00:00'}`);

      // Cancel previous notification
      if (existingNotificationId) {
        await LocalNotifications.cancel({ notifications: [{ id: existingNotificationId }] });
      }

      // Schedule new notification
      let newNotificationId: number | null = null;
      const permStatus = await LocalNotifications.checkPermissions();
      if (permStatus.display === 'granted') {
        newNotificationId = Date.now();
        await LocalNotifications.schedule({
          notifications: [{
            title: 'SewTape Reminder',
            body: formData.title.trim(),
            id: newNotificationId,
            schedule: { at: remindAt },
            sound: 'beep.wav',
            extra: { reminderId: id },
          }],
        });
      }

      // Update Firestore
      await updateDoc(doc(db, 'reminders', id), {
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        remindAt,
        relatedClient: formData.relatedClient || null,
        notificationId: newNotificationId,
      });

      clearTimeout(safetyTimeout);
      if (mounted.current) {
        navigate('/reminders');
      }
    } catch (err: any) {
      clearTimeout(safetyTimeout);
      console.error('Error updating reminder:', err);
      if (mounted.current) {
        setError(err.message || 'Failed to update reminder');
        setSaving(false);
        isSavingRef.current = false;
      }
    }
  };

  if (loading) {
    return (
      <MobileLayout title="Edit Reminder" showBackButton onBack={() => navigate(-1)}>
        <div className="space-y-4 animate-pulse mt-4">
          <div className="h-10 bg-white/5 rounded-lg" />
          <div className="h-10 bg-white/5 rounded-lg" />
          <div className="grid grid-cols-2 gap-3">
            <div className="h-10 bg-white/5 rounded-lg" />
            <div className="h-10 bg-white/5 rounded-lg" />
          </div>
          <div className="h-10 bg-white/5 rounded-lg" />
          <div className="h-10 bg-indigo-600/30 rounded-lg" />
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout title="Edit Reminder" showBackButton onBack={() => navigate(-1)}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-500/20 border border-red-500/30 text-red-300 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-white/70 mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white/90 placeholder-white/30"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white/70 mb-1">Description (optional)</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white/90 placeholder-white/30"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1">Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-4 h-4" />
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white/90 [color-scheme:dark]"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1">Time (optional)</label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white/90 [color-scheme:dark]"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white/70 mb-1">Related Client (optional)</label>
          <select
            name="relatedClient"
            value={formData.relatedClient}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white/90"
          >
            <option value="" className="bg-gray-800">None</option>
            {clients.map((client) => (
              <option key={client.name} value={client.name} className="bg-gray-800">
                {client.name} {client.phone && `(${client.phone})`}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-indigo-600/80 hover:bg-indigo-600 text-white py-2 px-4 rounded-lg transition flex items-center justify-center gap-2 backdrop-blur-sm disabled:opacity-50"
        >
          <Bell className="w-4 h-4" />
          {saving ? 'Updating...' : 'Update Reminder'}
        </button>
      </form>
    </MobileLayout>
  );
};