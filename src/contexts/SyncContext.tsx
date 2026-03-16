import React, { createContext, useContext, useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { waitForPendingWrites } from 'firebase/firestore';
import toast from 'react-hot-toast';

interface SyncContextType {
  isSyncing: boolean;
}

const SyncContext = createContext<SyncContextType>({ isSyncing: false });

export const useSync = () => useContext(SyncContext);

export const SyncProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [wasOffline, setWasOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = async () => {
      if (wasOffline) {
        setIsSyncing(true);
        const toastId = toast.loading('Syncing offline data to cloud...');
        try {
          await waitForPendingWrites(db);
          toast.success('All offline data synced!', { id: toastId });
        } catch (error) {
          console.error('Sync error:', error);
          toast.error('Sync failed. Will retry later.', { id: toastId });
        } finally {
          setIsSyncing(false);
        }
        setWasOffline(false);
      }
    };

    const handleOffline = () => {
      setWasOffline(true);
      toast('You are offline. Changes will be saved locally.', {
        icon: '📴',
        duration: 3000,
        style: {
          background: '#1F2937',
          color: '#fff',
          border: '1px solid rgba(255,255,255,0.1)',
        },
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [wasOffline]);

  return (
    <SyncContext.Provider value={{ isSyncing }}>
      {children}
    </SyncContext.Provider>
  );
};