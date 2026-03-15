import { MobileLayout } from '../layout/MobileLayout';
import { Link } from 'react-router-dom';
import { Ruler, Bell, Package, Users } from 'lucide-react';

export const Dashboard = () => {
  const stats = [
    { label: 'Total Clients', value: 24, icon: Users, color: 'from-blue-500 to-blue-600' },
    { label: 'Pending Orders', value: 8, icon: Package, color: 'from-yellow-500 to-orange-500' },
    { label: 'Upcoming Reminders', value: 3, icon: Bell, color: 'from-red-500 to-pink-500' },
  ];

  return (
    <MobileLayout title="Dashboard">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10">
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
          <h2 className="text-sm font-semibold text-white/70 mb-3">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link
              to="/measurements/new"
              className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 flex flex-col items-center justify-center hover:bg-white/10 transition"
            >
              <div className="bg-indigo-600/30 p-3 rounded-full mb-2">
                <Ruler className="w-5 h-5 text-indigo-400" />
              </div>
              <span className="text-sm font-medium text-white/80">New Measurement</span>
            </Link>
            <Link
              to="/reminders/new"
              className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 flex flex-col items-center justify-center hover:bg-white/10 transition"
            >
              <div className="bg-indigo-600/30 p-3 rounded-full mb-2">
                <Bell className="w-5 h-5 text-indigo-400" />
              </div>
              <span className="text-sm font-medium text-white/80">Set Reminder</span>
            </Link>
          </div>
        </div>

        {/* Recent Measurements */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-sm font-semibold text-white/70">Recent Measurements</h2>
            <Link to="/measurements" className="text-xs text-indigo-400">See all</Link>
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-white/90">Customer {i}</h3>
                    <p className="text-sm text-white/50">Chest: 40cm • Waist: 34cm</p>
                  </div>
                  <span className="text-xs text-white/30">2 days ago</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};