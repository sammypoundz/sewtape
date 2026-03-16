import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, where, onSnapshot, Timestamp } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import type { Measurement } from '../lib/types';

export const useMeasurements = () => {
  const { user } = useAuth();
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      setMeasurements([]);
      return;
    }

    const q = query(
      collection(db, 'measurements'),
      where('tailorId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => {
          const docData = doc.data();

          // Helper to safely convert Firestore timestamps to Date
          const safeToDate = (value: any): Date => {
            if (value instanceof Timestamp) {
              return value.toDate();
            }
            // If it's already a Date (unlikely from Firestore), return as is
            if (value instanceof Date) {
              return value;
            }
            // Fallback: current date
            return new Date();
          };

          const date = safeToDate(docData.date);
          const createdAt = safeToDate(docData.createdAt);
          const measurementsObj = docData.measurements || {};

          return {
            id: doc.id,
            tailorId: docData.tailorId,
            customerName: docData.customerName || '',
            customerPhone: docData.customerPhone || null,
            date,
            measurements: {
              chest: measurementsObj.chest || 0,
              waist: measurementsObj.waist || 0,
              length: measurementsObj.length || 0,
              shoulder: measurementsObj.shoulder || 0,
            },
            notes: docData.notes || null,
            createdAt,
          } as Measurement;
        });

        // Sort newest first
        data.sort((a, b) => b.date.getTime() - a.date.getTime());

        setMeasurements(data);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching measurements:', error);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [user]);

  return { measurements, loading };
};