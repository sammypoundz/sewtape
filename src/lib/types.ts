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
  relatedMeasurementId?: string;
  title: string;
  description?: string;
  remindAt: Date;
  isCompleted: boolean;
  createdAt: Date;
};