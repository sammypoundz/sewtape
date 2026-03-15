import React, { useState } from 'react';
import { MobileLayout } from '../layout/MobileLayout';
import { useNavigate } from 'react-router-dom';
import { Bell, Calendar } from 'lucide-react';

export const NewReminder = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [relatedMeasurement, setRelatedMeasurement] = useState('');

  // Mock measurements for dropdown (replace with real data later)
  const measurements = [
    { id: '1', customerName: 'John Doe' },
    { id: '2', customerName: 'Jane Smith' },
    { id: '3', customerName: 'Mike Johnson' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle reminder creation
    console.log({ title, description, date, time, relatedMeasurement });
    // Navigate back to reminders list
    navigate('/reminders');
  };

  return (
    <MobileLayout 
      title="New Reminder" 
      showBackButton 
      onBack={() => navigate(-1)}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
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
            Related Measurement (optional)
          </label>
          <select
            value={relatedMeasurement}
            onChange={(e) => setRelatedMeasurement(e.target.value)}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white/90"
          >
            <option value="" className="bg-gray-800 text-white/90">Select a customer</option>
            {measurements.map((m) => (
              <option key={m.id} value={m.id} className="bg-gray-800 text-white/90">
                {m.customerName}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600/80 hover:bg-indigo-600 text-white py-2 px-4 rounded-lg transition flex items-center justify-center gap-2 backdrop-blur-sm"
        >
          <Bell className="w-4 h-4" />
          Set Reminder
        </button>
      </form>
    </MobileLayout>
  );
};