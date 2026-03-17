import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Ruler, Bell, Package, Users } from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Measurements', href: '/measurements', icon: Ruler },
  { name: 'Reminders', href: '/reminders', icon: Bell },
  { name: 'Marketplace', href: '/marketplace', icon: Package },
  { name: 'Clients', href: '/clients', icon: Users },
];

export const BottomNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black/20 backdrop-blur-md border-t border-white/10 flex justify-center items-center h-14 px-1 z-10">
      <div className="flex items-center gap-1 max-w-md w-full justify-around">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex flex-col items-center justify-center py-1 px-1 transition ${
                isActive ? 'text-indigo-400' : 'text-white/50 hover:text-white/80'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="text-[0.6rem] mt-0.5">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};