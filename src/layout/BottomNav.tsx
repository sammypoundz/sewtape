import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Ruler, Bell, Package, Users } from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Measurements', href: '/measurements', icon: Ruler },
  { name: 'Reminders', href: '/reminders', icon: Bell },
  { name: 'Marketplace', href: '/marketplace', icon: Package, disabled: true },
  { name: 'Clients', href: '/clients', icon: Users, disabled: true },
];

export const BottomNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black/20 backdrop-blur-md border-t border-white/10 flex justify-around items-center h-16 px-2 z-10">
      {navItems.map((item) => {
        const isActive = location.pathname === item.href;
        const Icon = item.icon;

        if (item.disabled) {
          return (
            <div
              key={item.name}
              className="flex flex-col items-center justify-center flex-1 py-1 text-white/30 cursor-not-allowed"
              title="Coming soon"
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs mt-1">{item.name}</span>
            </div>
          );
        }

        return (
          <Link
            key={item.name}
            to={item.href}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition ${
              isActive 
                ? 'text-indigo-400' 
                : 'text-white/50 hover:text-white/80'
            }`}
          >
            <Icon className="h-5 w-5" />
            <span className="text-xs mt-1">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
};