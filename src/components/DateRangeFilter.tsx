import { DateRange } from "../types";
import { Calendar, Search, X } from "lucide-react";

interface DateRangeFilterProps {
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
}

const DateRangeFilter = ({ dateRange, setDateRange }: DateRangeFilterProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="p-4 flex justify-between items-center">
        <h3 className="flex items-center text-sm font-semibold">
          <Calendar size={14} className="mr-2 text-bitcoin-primary" />
          Filter Date Range
        </h3>
      </div>

      <div className="p-4 pt-0 ">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex flex-col">
            <label
              htmlFor="start-date"
              className="text-xs mb-1 text-gray-500 dark:text-gray-400"
            >
              Start Date
            </label>
            <input
              id="start-date"
              type="date"
              value={dateRange.start
                ? dateRange.start.toISOString().split("T")[0]
                : ""}
              onChange={(e) =>
                setDateRange({
                  ...dateRange,
                  start: e.target.value ? new Date(e.target.value) : null,
                })}
              className="px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-bitcoin-primary focus:border-transparent"
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="end-date"
              className="text-xs mb-1 text-gray-500 dark:text-gray-400"
            >
              End Date
            </label>
            <input
              id="end-date"
              type="date"
              value={dateRange.end
                ? dateRange.end.toISOString().split("T")[0]
                : ""}
              onChange={(e) =>
                setDateRange({
                  ...dateRange,
                  end: e.target.value ? new Date(e.target.value) : null,
                })}
              className="px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-bitcoin-primary focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DateRangeFilter;
