import React, { useState, useRef, useEffect } from 'react';
import { MobileLayout } from '../layout/MobileLayout';
import { useNavigate } from 'react-router-dom';
import { Bell, Calendar, WifiOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useClients } from '../hooks/useClients';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { LocalNotifications } from '@capacitor/local-notifications';
import toast from 'react-hot-toast';

export const NewReminder = () => {
  const { user } = useAuth();
  const { clients } = useClients();
  const navigate = useNavigate();
  const mounted = useRef(true);
  const isSavingRef = useRef(false);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [offline, setOffline] = useState(!navigator.onLine);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [relatedClient, setRelatedClient] = useState('');

  useEffect(() => {
    mounted.current = true;
    const handleOnline = () => setOffline(false);
    const handleOffline = () => setOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      mounted.current = false;
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Request permissions once when the component mounts
  useEffect(() => {
    LocalNotifications.requestPermissions().then(result => {
      if (result.display !== 'granted') {
        toast('Notifications disabled – you will not be reminded', { icon: '⚠️' });
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('You must be logged in');
      return;
    }
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    if (!date) {
      setError('Date is required');
      return;
    }

    setSaving(true);
    isSavingRef.current = true;
    setError('');
    setSuccess(false);

    const safetyTimeout = setTimeout(() => {
      if (mounted.current && isSavingRef.current) {
        console.warn('addDoc timeout – assuming success, redirecting');
        setSuccess(true);
        setSaving(false);
        setTimeout(() => {
          if (mounted.current) navigate('/reminders');
        }, 1500);
      }
    }, 5000);

    try {
      const remindAt = new Date(`${date}T${time || '00:00'}`);

      // Save to Firestore
      const docRef = await addDoc(collection(db, 'reminders'), {
        tailorId: user.uid,
        title: title.trim(),
        description: description.trim() || null,
        remindAt,
        isCompleted: false,
        relatedClient: relatedClient || null, // store client name or id
        createdAt: serverTimestamp(),
      });

      clearTimeout(safetyTimeout);

      // Schedule local notification
      const permStatus = await LocalNotifications.checkPermissions();
      if (permStatus.display === 'granted') {
        await LocalNotifications.schedule({
          notifications: [{
            title: 'SewTape Reminder',
            body: title.trim(),
            id: Date.now(), // unique ID – you might store this in Firestore to cancel later
            schedule: { at: remindAt },
            sound: 'beep.wav',
            extra: { reminderId: docRef.id },
          }],
        });
      }

      if (mounted.current) {
        setSuccess(true);
        setSaving(false);
        isSavingRef.current = false;
        setTimeout(() => {
          if (mounted.current) navigate('/reminders');
        }, 1500);
      }
    } catch (err: any) {
      clearTimeout(safetyTimeout);
      console.error('Error saving reminder:', err);
      if (mounted.current) {
        setError(err.message || 'Failed to save reminder');
        setSaving(false);
        isSavingRef.current = false;
      }
    }
  };

  return (
    <MobileLayout title="New Reminder" showBackButton onBack={() => navigate(-1)}>
      {offline && (
        <div className="flex items-center gap-2 mb-4 bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 p-3 rounded-lg text-sm">
          <WifiOff className="w-4 h-4" />
          <span>You are offline. Data will be saved locally and synced when back online.</span>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-500/20 border border-red-500/30 text-red-300 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-500/20 border border-green-500/30 text-green-300 p-3 rounded-lg text-sm">
            Reminder set {offline ? 'offline' : 'successfully'}! Redirecting...
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-white/70 mb-1">
            Title <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Delivery for John"
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white/90 placeholder-white/30"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white/70 mb-1">
            Description (optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Add details..."
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white/90 placeholder-white/30"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1">
              Date <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-4 h-4" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white/90 [color-scheme:dark]"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1">
              Time (optional)
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white/90 [color-scheme:dark]"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white/70 mb-1">
            Related Client (optional)
          </label>
          <select
            value={relatedClient}
            onChange={(e) => setRelatedClient(e.target.value)}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white/90"
          >
            <option value="" className="bg-gray-800 text-white/90">Select a client</option>
            {clients.map((client) => (
              <option key={client.name} value={client.name} className="bg-gray-800 text-white/90">
                {client.name} {client.phone && `(${client.phone})`}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={saving || success}
          className="w-full bg-indigo-600/80 hover:bg-indigo-600 text-white py-2 px-4 rounded-lg transition flex items-center justify-center gap-2 backdrop-blur-sm disabled:opacity-50"
        >
          <Bell className="w-4 h-4" />
          {saving ? 'Saving...' : success ? 'Saved!' : 'Set Reminder'}
        </button>
      </form>
    </MobileLayout>
  );
};