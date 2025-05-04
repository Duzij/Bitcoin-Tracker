import  { useState, useEffect } from 'react';
import { fetchBitcoinPrices } from './services/api';
import { BitcoinPrice, DateRange } from './types';
import PriceChart from './components/PriceChart';
import DateRangeFilter from './components/DateRangeFilter';
import ThemeToggle from './components/ThemeToggle';
import { Bitcoin, Github, MessageCircle, Link } from 'lucide-react';

function App() {
  const [bitcoinPrices, setBitcoinPrices] = useState<BitcoinPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange>({
    start: new Date(new Date().setDate(new Date().getDate() - 7)),
    end: new Date(),
  });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await fetchBitcoinPrices(dateRange);
      setBitcoinPrices(data);
      setLoading(false);
    };
    
    loadData();
  }, [dateRange]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Bitcoin className="text-bitcoin-primary" size={28} />
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Bitcoin Timeline</h1>
            </div>
            <div className="flex items-center gap-4">
              <a 
                href="https://github.com/Duzij/Bitcoin-Tracker" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <span className="sr-only">GitHub</span>
                <Github size={20} />
              </a>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="relative rounded-xl overflow-hidden mb-6 h-64 md:h-80">
            <img 
              src="https://images.unsplash.com/photo-1640161704729-cbe966a08476?q=80&w=1472&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Cryptocurrency gold coin on red background"
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-bitcoin-primary/90 to-gray-900/70 flex items-center">
              <div className="px-6 md:px-10 w-full md:max-w-2xl text-white">
                <h2 className="text-3xl md:text-4xl font-bold mb-3">Bitcoin Price Timeline</h2>
                <p className="text-sm md:text-base opacity-90">
                  Track Bitcoin price movements alongside significant news events that shape the market. 
                  Discover how global events influence cryptocurrency values with our interactive timeline.
                </p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            <DateRangeFilter dateRange={dateRange} setDateRange={setDateRange} />
            
            {loading ? (
              <div className="flex justify-center items-center p-12 bg-white dark:bg-gray-800 rounded-lg">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-bitcoin-primary"></div>
              </div>
            ) : bitcoinPrices.length > 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 md:p-6 shadow">
                <PriceChart data={bitcoinPrices} />
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center">
                <p className="text-gray-500 dark:text-gray-400">No data available for the selected date range.</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-12 mb-6">
          <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-medium mb-4">About Bitcoin Timeline</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  Bitcoin Timeline visualizes Bitcoin price changes alongside significant news events, 
                  helping you understand how market news influences cryptocurrency values. 
                  Click on any dot in the timeline to see related news events for that date.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-4">How It Works</h3>
                <ul className="text-gray-600 dark:text-gray-400 text-sm space-y-2">
                  <li className="flex items-start">
                    <span className="text-bitcoin-primary mr-2">•</span>
                    <span>Select a date range to filter the timeline</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-bitcoin-primary mr-2">•</span>
                    <span>Click on dots with events (highlighted in orange) to view related news</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-bitcoin-primary mr-2">•</span>
                    <span>See how news sentiment correlates with price changes</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-1 text-sm">
              <Bitcoin size={16} className="text-bitcoin-primary" />
              <span className="text-gray-600 dark:text-gray-400">Bitcoin Timeline © {new Date().getFullYear()}</span>
            </div>
            <div className="flex space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <a href="#" className="hover:text-bitcoin-primary flex items-center">
                <Link size={14} className="mr-1" />
                API
              </a>
              <a href="#" className="hover:text-bitcoin-primary flex items-center">
                <MessageCircle size={14} className="mr-1" />
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
 