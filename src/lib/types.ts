export type MeasurementFields = {
  chest?: number;
  waist?: number;
  hips?: number;
  length?: number;
  shoulder?: number;
  sleeve?: number;
  // add more fields as needed
};

export type Measurement = {
  id?: string;
  tailorId: string;
  customerName: string;
  customerPhone?: string;
  date: Date;
  measurements: MeasurementFields;
  notes?: string;
  createdAt: Date;
};

export type Reminder = {
  id?: string;
  tailorId: string;
  title: string;
  description?: string | null;
  remindAt: Date;
  isCompleted: boolean;
  relatedClient?: string | null;          // ✅ new field for client name
  relatedMeasurementId?: string | null;   // (optional, if you keep it)
  notificationId?: number | null;         // ✅ for tracking scheduled notification
  createdAt: Date;
};