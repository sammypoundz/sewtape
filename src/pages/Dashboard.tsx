import { MobileLayout } from '../layout/MobileLayout';
import { Link, useNavigate } from 'react-router-dom';
import { Ruler, Bell, Package, Users } from 'lucide-react';
import { useDashboardStats } from '../hooks/useDashboardStats';
import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';
import { MeasurementDetailModal } from '../components/measurements/MeasurementDetailModal';
import type { Measurement } from '../lib/types';

export const Dashboard = () => {
  const { totalClients, upcomingReminders, recentMeasurements, loading } = useDashboardStats();
  const navigate = useNavigate();
  const [selectedMeasurement, setSelectedMeasurement] = useState<Measurement | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const stats = [
    { label: 'Total Clients', value: totalClients, icon: Users, color: 'from-blue-500 to-blue-600' },
    { label: 'Pending Orders', value: 0, icon: Package, color: 'from-yellow-500 to-orange-500' },
    { label: 'Upcoming Reminders', value: upcomingReminders, icon: Bell, color: 'from-red-500 to-pink-500' },
  ];

  const handleRecentClick = (measurement: Measurement) => {
    setSelectedMeasurement(measurement);
    setDetailModalOpen(true);
  };

  if (loading) {
    return (
      <MobileLayout title="Dashboard">
        <div className="space-y-6 mt-3">
          {/* Skeleton loading state with pulse animation */}
          <div className="grid grid-cols-3 gap-3">
            {[1,2,3].map(i => (
              <div key={i} className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10 animate-pulse">
                <div className="w-8 h-8 bg-white/10 rounded-lg mb-2"></div>
                <div className="h-5 w-12 bg-white/10 rounded mb-1"></div>
                <div className="h-3 w-16 bg-white/10 rounded"></div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[1,2].map(i => (
              <div key={i} className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 animate-pulse">
                <div className="w-12 h-12 bg-white/10 rounded-full mx-auto mb-2"></div>
                <div className="h-4 w-20 bg-white/10 rounded mx-auto"></div>
              </div>
            ))}
          </div>
          <div className="space-y-3">
            {[1,2,3].map(i => (
              <div key={i} className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 animate-pulse">
                <div className="h-4 w-32 bg-white/10 rounded mb-2"></div>
                <div className="h-3 w-24 bg-white/10 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout title="Dashboard">
      <div className="space-y-6 mt-3 animate-in fade-in duration-500">
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10 transform transition-all duration-200 ease-out hover:scale-105 hover:shadow-xl hover:-translate-y-1"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div className={`bg-gradient-to-br ${stat.color} w-8 h-8 rounded-lg flex items-center justify-center mb-2 shadow-lg`}>
                <stat.icon className="w-4 h-4 text-white" />
              </div>
              <p className="text-xl font-bold text-white/90">{stat.value}</p>
              <p className="text-xs text-white/50">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-sm font-semibold text-white/70 mb-3 animate-in slide-in-from-left-4 duration-300">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link
              to="/measurements/new"
              className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 flex flex-col items-center justify-center transform transition-all duration-200 ease-out hover:scale-105 hover:shadow-xl hover:-translate-y-1 group"
            >
              <div className="bg-indigo-600/30 p-3 rounded-full mb-2 transition-transform duration-200 group-hover:scale-110">
                <Ruler className="w-5 h-5 text-indigo-400 transition-colors group-hover:text-indigo-300" />
              </div>
              <span className="text-xs font-medium text-white/80">New Measurement</span>
            </Link>
            <Link
              to="/reminders/new"
              className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 flex flex-col items-center justify-center transform transition-all duration-200 ease-out hover:scale-105 hover:shadow-xl hover:-translate-y-1 group"
            >
              <div className="bg-indigo-600/30 p-3 rounded-full mb-2 transition-transform duration-200 group-hover:scale-110">
                <Bell className="w-5 h-5 text-indigo-400 transition-colors group-hover:text-indigo-300" />
              </div>
              <span className="text-xs font-medium text-white/80">Set Reminder</span>
            </Link>
          </div>
        </div>

        {/* Recent Measurements */}
        <div>
          <div className="flex justify-between items-center mb-3 animate-in slide-in-from-left-4 duration-300 delay-100">
            <h2 className="text-sm font-semibold text-white/70">Recent Measurements</h2>
            <Link to="/measurements" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
              See all
            </Link>
          </div>
          <div className="space-y-3">
            {recentMeasurements.length > 0 ? (
              recentMeasurements.map((m, index) => (
                <div
                  key={m.id}
                  onClick={() => handleRecentClick(m)}
                  className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 transform transition-all duration-200 hover:scale-[1.02] hover:shadow-xl cursor-pointer"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-white/90">{m.customerName}</h3>
                      <p className="text-sm text-white/50">
                        Chest: {m.measurements?.chest || '—'}cm • Waist: {m.measurements?.waist || '—'}cm
                      </p>
                    </div>
                    <span className="text-xs text-white/30">
                      {formatDistanceToNow(m.date, { addSuffix: true })}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-white/50 text-center py-4 animate-in fade-in duration-300">
                No recent measurements
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Detail Modal */}
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
    </MobileLayout>
  );
};