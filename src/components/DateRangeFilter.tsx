import  { DateRange } from '../types';
import { Calendar, Search, X } from 'lucide-react';
import { useState } from 'react';

interface DateRangeFilterProps {
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
}

const DateRangeFilter = ({ dateRange, setDateRange }: DateRangeFilterProps) => {
  const [expanded, setExpanded] = useState(false);
  
  const clearFilters = () => {
    setDateRange({ start: null, end: null });
  };
  
  const hasActiveFilters = dateRange.start || dateRange.end;
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="p-4 flex justify-between items-center">
        <h3 className="flex items-center text-sm font-semibold">
          <Calendar size={16} className="mr-2 text-bitcoin-primary" />
          Filter Date Range
        </h3>
        
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button 
              onClick={clearFilters}
              className="inline-flex items-center px-2 py-1 text-xs rounded text-gray-700 bg-gray-100 hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
            >
              <X size={12} className="mr-1" />
              Clear
            </button>
          )}
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-bitcoin-primary hover:text-bitcoin-primary/80"
          >
            {expanded ? 'Hide' : 'Show'} Options
          </button>
        </div>
      </div>
      
      {expanded && (
        <div className="p-4 pt-0 border-t border-gray-100 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex flex-col">
              <label htmlFor="start-date" className="text-xs mb-1 text-gray-500 dark:text-gray-400">Start Date</label>
              <input
                id="start-date"
                type="date"
                value={dateRange.start ? dateRange.start.toISOString().split('T')[0] : ''}
                onChange={(e) => setDateRange({
                  ...dateRange,
                  start: e.target.value ? new Date(e.target.value) : null
                })}
                className="px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-bitcoin-primary focus:border-transparent"
              />
            </div>
            
            <div className="flex flex-col">
              <label htmlFor="end-date" className="text-xs mb-1 text-gray-500 dark:text-gray-400">End Date</label>
              <input
                id="end-date"
                type="date"
                value={dateRange.end ? dateRange.end.toISOString().split('T')[0] : ''}
                onChange={(e) => setDateRange({
                  ...dateRange,
                  end: e.target.value ? new Date(e.target.value) : null
                })}
                className="px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-bitcoin-primary focus:border-transparent"
              />
            </div>
            
            <div className="self-end">
              <button 
                className="px-4 py-2 bg-bitcoin-primary text-white rounded hover:bg-bitcoin-primary/90 transition-colors flex items-center"
                onClick={() => setExpanded(false)}
              >
                <Search size={14} className="mr-2" />
                Apply Filter
              </button>
            </div>
          </div>
        </div>
      )}
      
      {hasActiveFilters && !expanded && (
        <div className="px-4 pb-3 text-xs text-gray-500 dark:text-gray-400 flex items-center">
          <span>Active filters:</span>
          <div className="flex flex-wrap gap-2 ml-2">
            {dateRange.start && (
              <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                From: {dateRange.start.toLocaleDateString()}
              </span>
            )}
            {dateRange.end && (
              <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                To: {dateRange.end.toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangeFilter;
 