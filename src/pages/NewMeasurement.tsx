import React, { useState } from 'react';
import { MobileLayout } from '../layout/MobileLayout';
import { useNavigate } from 'react-router-dom';
import { Ruler } from 'lucide-react';

export const NewMeasurement = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    chest: '',
    waist: '',
    length: '',
    shoulder: '',
    notes: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Save logic
    navigate('/measurements');
  };

  return (
    <MobileLayout 
      title="New Measurement" 
      showBackButton 
      onBack={() => navigate(-1)}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
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
          className="w-full bg-indigo-600/80 hover:bg-indigo-600 text-white py-2 px-4 rounded-lg transition flex items-center justify-center gap-2 backdrop-blur-sm"
        >
          <Ruler className="w-4 h-4" />
          Save Measurement
        </button>
      </form>
    </MobileLayout>
  );
};