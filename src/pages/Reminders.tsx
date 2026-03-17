import { useState, useEffect } from 'react';
import { MobileLayout } from '../layout/MobileLayout';
import { Plus, Bell, Edit, Trash2, MoreVertical } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useReminders } from '../hooks/useReminders';
import { format } from 'date-fns';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import toast from 'react-hot-toast';
import { LocalNotifications } from '@capacitor/local-notifications';

export const Reminders = () => {
  const { reminders, loading } = useReminders();
  const navigate = useNavigate();
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const toggleReminder = async (id: string, currentCompleted: boolean) => {
    try {
      await updateDoc(doc(db, 'reminders', id), {
        isCompleted: !currentCompleted,
      });
    } catch (error) {
      console.error('Error toggling reminder:', error);
      toast.error('Failed to update reminder');
    }
  };

  const handleEdit = (id: string) => {
    setActiveMenuId(null);
    navigate(`/reminders/edit/${id}`);
  };

  const handleDelete = async (id: string) => {
    setActiveMenuId(null);
    try {
      await deleteDoc(doc(db, 'reminders', id));
      // Cancel scheduled notification (if any) – requires storing notification ID
      toast.success('Reminder deleted');
    } catch (error) {
      console.error('Error deleting reminder:', error);
      toast.error('Failed to delete reminder');
    }
  };

  // ✅ Correct: request permissions once when component mounts
  useEffect(() => {
    LocalNotifications.requestPermissions().then(result => {
      if (result.display !== 'granted') {
        console.warn('Notification permissions not granted');
      }
    });
  }, []);

  if (loading) {
    return (
      <MobileLayout
        title="Reminders"
        action={
          <div className="p-1 opacity-50">
            <Plus className="w-5 h-5 text-white/70" />
          </div>
        }
      >
        <div className="space-y-3 animate-pulse mt-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="h-5 w-32 bg-white/10 rounded mb-2"></div>
              <div className="h-4 w-40 bg-white/10 rounded"></div>
            </div>
          ))}
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout
      title="Reminders"
      action={
        <Link to="/reminders/new" className="p-1 transition-transform active:scale-90">
          <Plus className="w-5 h-5 text-white/70" />
        </Link>
      }
    >
      <div className="space-y-3 animate-in fade-in duration-500 mt-4">
        {reminders.length > 0 ? (
          reminders.map((reminder, index) => (
            <div
              key={reminder.id}
              className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 transform transition-all duration-200 ease-out hover:scale-[1.02] hover:shadow-xl relative"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={reminder.isCompleted}
                  onChange={() => toggleReminder(reminder.id!, reminder.isCompleted)}
                  className="w-5 h-5 rounded border-white/20 bg-white/5 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-0"
                />
                <div className="flex-1">
                  <h3 className={`font-medium ${reminder.isCompleted ? 'line-through text-white/40' : 'text-white/90'}`}>
                    {reminder.title}
                  </h3>
                  <p className="text-sm text-white/50 flex items-center mt-1">
                    <Bell className="w-3 h-3 mr-1" />
                    {format(reminder.remindAt, 'PPp')}
                  </p>
                  {reminder.description && (
                    <p className="text-xs text-white/30 mt-1">{reminder.description}</p>
                  )}
                </div>
                <button
                  onClick={() => setActiveMenuId(prev => (prev === reminder.id ? null : reminder.id!))}
                  className="p-1 opacity-50 hover:opacity-100 transition-opacity"
                >
                  <MoreVertical className="w-4 h-4 text-white/70" />
                </button>
              </div>

              {/* Dropdown menu */}
              {activeMenuId === reminder.id && (
                <div
                  className="absolute right-4 top-12 bg-gray-800 border border-white/10 rounded-lg shadow-xl py-1 z-20 min-w-[120px]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => handleEdit(reminder.id!)}
                    className="w-full px-4 py-2 text-left text-sm text-white/80 hover:bg-white/10 flex items-center gap-2"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(reminder.id!)}
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
            No reminders yet. Create your first one!
          </p>
        )}
      </div>
    </MobileLayout>
  );
};