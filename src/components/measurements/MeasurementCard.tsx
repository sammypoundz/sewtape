import type { Measurement } from "../../lib/types";
import { format } from "date-fns";

export const MeasurementCard = ({ measurement }: { measurement: Measurement }) => {
  return (
    <div className="bg-yellow-50 p-4 rounded-md shadow-md border-l-4 border-yellow-400 transform hover:rotate-1 transition-transform duration-200 font-handwriting">
      <h3 className="text-lg font-bold">{measurement.customerName}</h3>
      <p className="text-sm text-gray-600">{format(measurement.date, "PPP")}</p>
      <div className="mt-2 grid grid-cols-2 gap-1 text-sm">
        {Object.entries(measurement.measurements).map(([key, val]) => (
          <div key={key}>
            <span className="capitalize">{key}:</span> {val} cm
          </div>
        ))}
      </div>
      {measurement.notes && (
        <p className="mt-2 italic text-xs border-t border-dashed pt-2">{measurement.notes}</p>
      )}
    </div>
  );
};