import { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { collection, query, where, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import type { Measurement } from "../lib/types";  // <-- Use type-only import
import { useAuth } from "../contexts/AuthContext";

export const useMeasurements = () => {
  const { user } = useAuth();
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "measurements"), where("tailorId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date.toDate(),
        createdAt: doc.data().createdAt.toDate(),
      })) as Measurement[];
      setMeasurements(data);
      setLoading(false);
    });
    return unsubscribe;
  }, [user]);

  const addMeasurement = async (measurement: Omit<Measurement, "id" | "tailorId" | "createdAt">) => {
    if (!user) return;
    await addDoc(collection(db, "measurements"), {
      ...measurement,
      tailorId: user.uid,
      createdAt: new Date(),
    });
  };

  const updateMeasurement = async (id: string, updates: Partial<Measurement>) => {
    await updateDoc(doc(db, "measurements", id), updates);
  };

  const deleteMeasurement = async (id: string) => {
    await deleteDoc(doc(db, "measurements", id));
  };

  return { measurements, loading, addMeasurement, updateMeasurement, deleteMeasurement };
};