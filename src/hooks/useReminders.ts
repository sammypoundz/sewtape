import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, where, onSnapshot, Timestamp } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import type { Reminder } from '../lib/types';

export const useReminders = () => {
  const { user } = useAuth();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      setReminders([]);
      return;
    }

    const q = query(
      collection(db, 'reminders'),
      where('tailorId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => {
          const docData = doc.data();
          return {
            id: doc.id,
            tailorId: docData.tailorId,
            title: docData.title || '',
            description: docData.description || '',
            remindAt: docData.remindAt instanceof Timestamp ? docData.remindAt.toDate() : new Date(),
            isCompleted: docData.isCompleted || false,
            relatedMeasurementId: docData.relatedMeasurementId || null,
            createdAt: docData.createdAt instanceof Timestamp ? docData.createdAt.toDate() : new Date(),
          } as Reminder;
        });

        // Sort by remindAt (soonest first)
        data.sort((a, b) => a.remindAt.getTime() - b.remindAt.getTime());
        setReminders(data);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching reminders:', error);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [user]);

  return { reminders, loading };
};