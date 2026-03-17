import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

export const useClients = () => {
  const { user } = useAuth();
  const [clients, setClients] = useState<{ name: string; phone: string | null }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const q = query(collection(db, 'measurements'), where('tailorId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const map = new Map<string, { name: string; phone: string | null }>();
      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        const name = data.customerName?.trim();
        const phone = data.customerPhone?.trim() || null;
        if (name && !map.has(name)) {
          map.set(name, { name, phone });
        }
      });
      setClients(Array.from(map.values()));
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  return { clients, loading };
};