import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, where, onSnapshot, Timestamp } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import type { Measurement } from '../lib/types';

export interface DashboardStats {
  totalClients: number;
  pendingOrders: number;
  upcomingReminders: number;
  recentMeasurements: Measurement[];
  loading: boolean;
  error: string | null; // optional, for debugging
}

export const useDashboardStats = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalClients: 0,
    pendingOrders: 0,
    upcomingReminders: 0,
    recentMeasurements: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    // If no user, stop loading and return early
    if (!user) {
      setStats(prev => ({ ...prev, loading: false, error: 'No authenticated user' }));
      return;
    }

    let unsubscribeMeasurements: (() => void) | undefined;
    let unsubscribeReminders: (() => void) | undefined;
    let hasError = false;

    // 1. Listen to measurements
    const measurementsQuery = query(
      collection(db, 'measurements'),
      where('tailorId', '==', user.uid)
    );

    unsubscribeMeasurements = onSnapshot(
      measurementsQuery,
      (snapshot) => {
        const measurements: Measurement[] = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            tailorId: data.tailorId,
            customerName: data.customerName,
            customerPhone: data.customerPhone,
            date: data.date instanceof Timestamp ? data.date.toDate() : data.date,
            measurements: data.measurements || {},
            notes: data.notes,
            createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt,
          } as Measurement;
        });

        const uniqueClients = new Set(measurements.map(m => m.customerName)).size;
        const recent = measurements
          .sort((a, b) => b.date.getTime() - a.date.getTime())
          .slice(0, 3);

        setStats(prev => ({
          ...prev,
          totalClients: uniqueClients,
          recentMeasurements: recent,
          loading: false,
          error: null,
        }));
      },
      (error) => {
        console.error('Measurements snapshot error:', error);
        if (!hasError) {
          hasError = true;
          setStats(prev => ({ ...prev, loading: false, error: error.message }));
        }
      }
    );

    // 2. Listen to upcoming reminders
    const now = new Date();
    const remindersQuery = query(
      collection(db, 'reminders'),
      where('tailorId', '==', user.uid),
      where('remindAt', '>=', now),
      where('isCompleted', '==', false)
    );

    unsubscribeReminders = onSnapshot(
      remindersQuery,
      (snapshot) => {
        setStats(prev => ({
          ...prev,
          upcomingReminders: snapshot.size,
        }));
      },
      (error) => {
        console.error('Reminders snapshot error:', error);
        if (!hasError) {
          hasError = true;
          setStats(prev => ({ ...prev, loading: false, error: error.message }));
        }
      }
    );

    return () => {
      if (unsubscribeMeasurements) unsubscribeMeasurements();
      if (unsubscribeReminders) unsubscribeReminders();
    };
  }, [user]);

  return stats;
};