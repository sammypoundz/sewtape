import { useState } from 'react';
import { MobileLayout } from '../layout/MobileLayout';
import { Plus, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Reminders = () => {
  const [reminders, setReminders] = useState([
    { id: 1, title: 'Delivery: John Doe', date: '2024-03-20', completed: false },
    { id: 2, title: 'Delivery: Jane Smith', date: '2024-03-21', completed: false },
    { id: 3, title: 'Fabric order pickup', date: '2024-03-18', completed: true },
  ]);

  const toggleReminder = (id: number) => {
    setReminders(reminders.map(r => 
      r.id === id ? { ...r, completed: !r.completed } : r
    ));
  };

  return (
    <MobileLayout 
      title="Reminders"
      action={
        <Link to="/reminders/new" className="p-1">
          <Plus className="w-5 h-5 text-white/70" />
        </Link>
      }
    >
      <div className="space-y-3">
        {reminders.map((reminder) => (
          <div 
            key={reminder.id} 
            className={`bg-white/5 backdrop-blur-sm rounded-xl p-4 border ${
              reminder.completed 
                ? 'border-green-500/30 bg-green-500/10' 
                : 'border-white/10'
            }`}
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={reminder.completed}
                onChange={() => toggleReminder(reminder.id)}
                className="w-5 h-5 rounded border-white/20 bg-white/5 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-0"
              />
              <div className="flex-1">
                <h3 className={`font-medium ${reminder.completed ? 'line-through text-white/40' : 'text-white/90'}`}>
                  {reminder.title}
                </h3>
                <p className="text-sm text-white/50 flex items-center mt-1">
                  <Bell className="w-3 h-3 mr-1" />
                  {reminder.date}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </MobileLayout>
  );
};