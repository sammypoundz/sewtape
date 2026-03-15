import { useState } from "react";
import { X } from "lucide-react";

interface Props {
  onSubmit: (data: any) => void;
  onClose: () => void;
}

export const MeasurementForm = ({ onSubmit, onClose }: Props) => {
  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    date: new Date().toISOString().split("T")[0],
    measurements: {
      chest: "",
      waist: "",
      length: "",
    },
    notes: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.startsWith("measurements.")) {
      const field = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        measurements: { ...prev.measurements, [field]: value },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...form,
      date: new Date(form.date),
      measurements: Object.fromEntries(
        Object.entries(form.measurements).map(([k, v]) => [k, parseFloat(v) || 0])
      ),
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-yellow-100 p-6 rounded-lg shadow-xl w-full max-w-md transform rotate-1 border-2 border-dashed border-yellow-600">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-handwriting">New Measurement</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 font-handwriting">
          <input
            type="text"
            name="customerName"
            placeholder="Customer name"
            value={form.customerName}
            onChange={handleChange}
            className="w-full p-2 bg-transparent border-b-2 border-dashed border-gray-500 focus:outline-none"
            required
          />
          <input
            type="tel"
            name="customerPhone"
            placeholder="Phone (optional)"
            value={form.customerPhone}
            onChange={handleChange}
            className="w-full p-2 bg-transparent border-b-2 border-dashed border-gray-500 focus:outline-none"
          />
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="w-full p-2 bg-transparent border-b-2 border-dashed border-gray-500 focus:outline-none"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              name="measurements.chest"
              placeholder="Chest (cm)"
              value={form.measurements.chest}
              onChange={handleChange}
              className="p-2 bg-transparent border-b-2 border-dashed border-gray-500 focus:outline-none"
            />
            <input
              type="number"
              name="measurements.waist"
              placeholder="Waist (cm)"
              value={form.measurements.waist}
              onChange={handleChange}
              className="p-2 bg-transparent border-b-2 border-dashed border-gray-500 focus:outline-none"
            />
            <input
              type="number"
              name="measurements.length"
              placeholder="Length (cm)"
              value={form.measurements.length}
              onChange={handleChange}
              className="p-2 bg-transparent border-b-2 border-dashed border-gray-500 focus:outline-none"
            />
          </div>
          <textarea
            name="notes"
            placeholder="Additional notes..."
            value={form.notes}
            onChange={handleChange}
            rows={3}
            className="w-full p-2 bg-transparent border-2 border-dashed border-gray-500 focus:outline-none"
          />
          <button
            type="submit"
            className="w-full py-2 bg-yellow-300 hover:bg-yellow-400 rounded-md border-2 border-yellow-600 transition"
          >
            Save Measurement
          </button>
        </form>
      </div>
    </div>
  );
};