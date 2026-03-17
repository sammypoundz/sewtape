import { MobileLayout } from '../layout/MobileLayout';
import { Users } from 'lucide-react';

export const Clients = () => {
  return (
    <MobileLayout title="Clients">
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <Users className="w-16 h-16 text-indigo-400 mb-4 opacity-50" />
        <h2 className="text-2xl font-handwriting text-white/90 mb-2">Coming Soon</h2>
        <p className="text-white/50 max-w-xs">
          A dedicated client management view is on its way. You'll be able to see all your clients
          and their history here.
        </p>
      </div>
    </MobileLayout>
  );
};