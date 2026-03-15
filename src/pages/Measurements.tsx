import { MobileLayout } from '..//layout/MobileLayout';
import { Link } from 'react-router-dom';
import { Plus, MoreVertical } from 'lucide-react';

export const Measurements = () => {
  const measurements = [
    { id: 1, name: 'John Doe', chest: 40, waist: 34, length: 72, date: '2024-03-15' },
    { id: 2, name: 'Jane Smith', chest: 36, waist: 28, length: 68, date: '2024-03-14' },
    { id: 3, name: 'Mike Johnson', chest: 42, waist: 36, length: 74, date: '2024-03-13' },
    { id: 4, name: 'Sarah Williams', chest: 34, waist: 26, length: 66, date: '2024-03-12' },
    { id: 5, name: 'David Brown', chest: 38, waist: 32, length: 70, date: '2024-03-11' },
  ];

  return (
    <MobileLayout 
      title="Measurements"
      action={
        <Link to="/measurements/new" className="p-1">
          <Plus className="w-5 h-5 text-white/70" />
        </Link>
      }
    >
      <div className="space-y-3">
        {measurements.map((m) => (
          <div key={m.id} className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-white/90">{m.name}</h3>
                <p className="text-sm text-white/50 mt-1">
                  Chest: {m.chest}cm • Waist: {m.waist}cm • Length: {m.length}cm
                </p>
                <p className="text-xs text-white/30 mt-2">Last updated: {m.date}</p>
              </div>
              <button className="p-1">
                <MoreVertical className="w-4 h-4 text-white/30" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </MobileLayout>
  );
};