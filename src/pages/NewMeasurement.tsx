import React, { useState, useRef, useEffect } from 'react';
import { MobileLayout } from '../layout/MobileLayout';
import { useNavigate } from 'react-router-dom';
import { Ruler, WifiOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { 
  addDoc, 
  collection, 
  serverTimestamp, 
  onSnapshot, 
  query, 
  where 
} from 'firebase/firestore';
import type { QuerySnapshot, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import { db } from '../lib/firebase';

// Custom hook to fetch unique customers from measurements
const useCustomers = () => {
  const { user } = useAuth();
  const [customers, setCustomers] = useState<{ name: string; phone: string | null }[]>([]);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = onSnapshot(
      query(collection(db, 'measurements'), where('tailorId', '==', user.uid)),
      (snapshot: QuerySnapshot<DocumentData>) => {
        const map = new Map<string, { name: string; phone: string | null }>();
        snapshot.docs.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
          const data = doc.data();
          const name = data.customerName?.trim();
          const phone = data.customerPhone?.trim() || null;
          if (name && !map.has(name)) {
            map.set(name, { name, phone });
          }
        });
        setCustomers(Array.from(map.values()));
      }
    );
    return unsubscribe;
  }, [user]);

  return customers;
};

export const NewMeasurement = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const customers = useCustomers();
  const mounted = useRef(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionRef = useRef<HTMLDivElement>(null);
  const isSavingRef = useRef(false); // <-- ref to track saving state

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [offline, setOffline] = useState(!navigator.onLine);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<{ name: string; phone: string | null }[]>([]);
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    chest: '',
    waist: '',
    length: '',
    shoulder: '',
    notes: '',
  });

  // Filter suggestions when name changes
  useEffect(() => {
    const term = formData.customerName.trim().toLowerCase();
    if (term.length === 0) {
      setSuggestions([]);
      return;
    }
    const filtered = customers.filter(
      (c) =>
        c.name.toLowerCase().includes(term) ||
        (c.phone && c.phone.includes(term))
    );
    setSuggestions(filtered);
  }, [formData.customerName, customers]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        suggestionRef.current &&
        !suggestionRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === 'customerName') {
      setShowSuggestions(true);
    }
  };

  const handleSuggestionClick = (customer: { name: string; phone: string | null }) => {
    setFormData((prev) => ({
      ...prev,
      customerName: customer.name,
      customerPhone: customer.phone || '',
    }));
    setShowSuggestions(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('You must be logged in');
      return;
    }
    if (!formData.customerName.trim()) {
      setError('Customer name is required');
      return;
    }

    setSaving(true);
    isSavingRef.current = true;
    setError('');
    setSuccess(false);

    console.log('Submit started, saving set to true');

    // Safety timeout: if still saving after 2 seconds, force success
    const safetyTimeout = setTimeout(() => {
      console.log('Safety timeout triggered, isSavingRef:', isSavingRef.current, 'mounted:', mounted.current);
      if (mounted.current && isSavingRef.current) {
        console.warn('AddDoc timeout – assuming local save worked.');
        setSuccess(true);
        setSaving(false);
        isSavingRef.current = false;
        setTimeout(() => {
          if (mounted.current) navigate('/measurements');
        }, 1500);
      } else {
        console.log('Safety timeout but condition not met');
      }
    }, 2000);

    try {
      const measurements = {
        chest: formData.chest ? parseFloat(formData.chest) : 0,
        waist: formData.waist ? parseFloat(formData.waist) : 0,
        length: formData.length ? parseFloat(formData.length) : 0,
        shoulder: formData.shoulder ? parseFloat(formData.shoulder) : 0,
      };

      console.log('Calling addDoc...');
      const docRef = await addDoc(collection(db, 'measurements'), {
        tailorId: user.uid,
        customerName: formData.customerName.trim(),
        customerPhone: formData.customerPhone.trim() || null,
        measurements,
        notes: formData.notes.trim() || null,
        date: new Date(),
        createdAt: serverTimestamp(),
      });
      console.log('addDoc resolved with ID:', docRef.id);
      clearTimeout(safetyTimeout);
      if (mounted.current) {
        console.log('Setting success true');
        setSuccess(true);
        setSaving(false);
        isSavingRef.current = false;
        setTimeout(() => {
          if (mounted.current) navigate('/measurements');
        }, 1500);
      }
    } catch (err: any) {
      clearTimeout(safetyTimeout);
      console.error('Error saving measurement:', err);
      if (mounted.current) {
        setError(err.message || 'Failed to save measurement');
        setSaving(false);
        isSavingRef.current = false;
      }
    }
  };

  return (
    <MobileLayout title="New Measurement" showBackButton onBack={() => navigate(-1)}>
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
            Measurement saved {offline ? 'offline' : 'successfully'}! Redirecting...
          </div>
        )}

        {/* Customer Name with Autocomplete */}
        <div className="relative">
          <label className="block text-sm font-medium text-white/70 mb-1">Customer Name</label>
          <input
            ref={inputRef}
            type="text"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            onFocus={() => setShowSuggestions(true)}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white/90 placeholder-white/30"
            required
          />
          {showSuggestions && suggestions.length > 0 && (
            <div
              ref={suggestionRef}
              className="absolute z-20 w-full mt-1 bg-gray-800 border border-white/10 rounded-lg shadow-xl max-h-48 overflow-y-auto"
            >
              {suggestions.map((s, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSuggestionClick(s)}
                  className="px-3 py-2 hover:bg-white/10 cursor-pointer text-white/90 text-sm"
                >
                  <div>{s.name}</div>
                  {s.phone && <div className="text-xs text-white/50">{s.phone}</div>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Phone */}
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

        {/* Measurements fields */}
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
          disabled={saving || success}
          className="w-full bg-indigo-600/80 hover:bg-indigo-600 text-white py-2 px-4 rounded-lg transition flex items-center justify-center gap-2 backdrop-blur-sm disabled:opacity-50"
        >
          <Ruler className="w-4 h-4" />
          {saving ? 'Saving...' : success ? 'Saved!' : 'Save Measurement'}
        </button>
      </form>
    </MobileLayout>
  );
};