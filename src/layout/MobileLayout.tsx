import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Menu, User, LogOut } from 'lucide-react';
import { BottomNav } from './BottomNav';

interface MobileLayoutProps {
  children: React.ReactNode;
  title: string;
  showBackButton?: boolean;
  onBack?: () => void;
  action?: React.ReactNode;
}

export const MobileLayout = ({ 
  children, 
  title, 
  showBackButton = false, 
  onBack,
  action 
}: MobileLayoutProps) => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 pb-16">
      {/* Glass Header */}
      <header className="fixed top-0 left-0 right-0 z-20 bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center">
            {showBackButton ? (
              <button onClick={onBack} className="mr-3">
                <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            ) : (
              <Menu className="w-5 h-5 text-white/70 mr-3" />
            )}
            <h1 className="font-semibold text-lg text-white/90">{title}</h1>
          </div>
          <div className="flex items-center space-x-3">
            {action}
            <div className="relative group">
              <button className="p-1 rounded-full bg-white/5 hover:bg-white/10 transition">
                <User className="w-5 h-5 text-white/70" />
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-gray-800/90 backdrop-blur-md rounded-lg shadow-lg py-1 hidden group-hover:block border border-white/10">
                <div className="px-4 py-2 text-sm text-white/80 border-b border-white/10">
                  {user?.email}
                </div>
                <button
                  onClick={logout}
                  className="flex items-center w-full px-4 py-2 text-sm text-white/80 hover:bg-white/10"
                >
                  <LogOut className="w-4 h-4 mr-2" /> Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content (with top padding to avoid header) */}
      <main className="pt-14 p-4">
        {children}
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};