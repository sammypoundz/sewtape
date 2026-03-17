import { MobileLayout } from '../layout/MobileLayout';
import { Package } from 'lucide-react';

export const Marketplace = () => {
  return (
    <MobileLayout title="Marketplace">
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <Package className="w-16 h-16 text-indigo-400 mb-4 opacity-50" />
        <h2 className="text-2xl font-handwriting text-white/90 mb-2">Coming Soon</h2>
        <p className="text-white/50 max-w-xs">
          We're working on a marketplace where you can buy fabrics and connect with suppliers.
          Stay tuned!
        </p>
      </div>
    </MobileLayout>
  );
};