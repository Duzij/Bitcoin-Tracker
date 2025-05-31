import { useEffect, useState } from "react";
import {
  CartesianGrid,
  Dot,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from "recharts";
import { BitcoinPrice, NewsEvent } from "../types";
import { fetchNewsForPrice } from "../services/api";
import { format } from "date-fns";
import {
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import NewsComponent from "./NewsComponent";

interface PriceChartProps {
  data: BitcoinPrice[];
}

const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const data = payload[0].payload as BitcoinPrice & {
    news_events?: NewsEvent[];
  };
  const priceChange = data.percent_change;
  const changeColor = priceChange >= 0 ? "#16a34a" : "#dc2626"; // Green for positive, red for negative

  const isDarkMode = document.documentElement.classList.contains("dark");
  const tooltipBg = isDarkMode ? "#1f2937" : "#ffffff"; // Dark: Gray-800, Light: White
  const tooltipBorder = isDarkMode ? "#374151" : "#e5e7eb"; // Dark: Gray-700, Light: Gray-200

  return (
    <div
      style={{
        backgroundColor: tooltipBg,
        padding: "10px",
        borderRadius: "8px",
        border: `1px solid ${tooltipBorder}`,
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        maxWidth: "200px",
        color: isDarkMode ? "#d1d5db" : "#1f2937", // Text color: Light or Dark
      }}
    >
      <p style={{ fontWeight: "bold", marginBottom: "5px" }}>
        {format(new Date(data.timestamp), "MMMM dd, yyyy")}
      </p>
      <p>Price: ${data.price.toLocaleString()}</p>
      <p style={{ color: changeColor }}>
        {priceChange >= 0 ? "+" : ""}
        {priceChange.toFixed(2)}%
      </p>
      {data.news_events && data.news_events.length > 0 && (
        <p
          style={{
            fontSize: "12px",
            marginTop: "5px",
            fontStyle: "italic",
            color: isDarkMode ? "#9ca3af" : "#6b7280", // Gray-400 for dark, Gray-500 for light
          }}
        >
          {data.news_events.length} related news{" "}
          {data.news_events.length === 1 ? "article" : "articles"}
        </p>
      )}
    </div>
  );
};

const ActiveCustomDot = (props: any) => {
  const { cx, cy, payload } = props;

  if (!cx || !cy) return null;

  const hasNews = payload.has_news;

  return (
    <Dot
      cx={cx}
      cy={cy}
      r={hasNews ? 8 : 6}
      strokeWidth={hasNews ? 2 : 0}
      fill="#f7931a"
      className={`timeline-dot`}
    />
  );
};

const CustomDot = (props: any) => {
  const { cx, cy, payload } = props;

  if (!cx || !cy) return null;

  const hasNews = payload.has_news;

  return (
    <Dot
      cx={cx}
      cy={cy}
      r={hasNews ? 7 : 5}
      strokeWidth={hasNews ? 2 : 0}
      className={`timeline-dot`}
    />
  );
};

const PriceChart = ({ data }: PriceChartProps) => {
  const [activePrice, setActivePrice] = useState<BitcoinPrice | null>(null);
  const [newsEvents, setNewsEvents] = useState<NewsEvent[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      if (activePrice?.id && activePrice.has_news) {
        setLoading(true);
        const news = await fetchNewsForPrice(activePrice.id);
        setNewsEvents(news);
        setLoading(false);
      } else {
        setNewsEvents([]);
      }
    };

    fetchNews();
  }, [activePrice]);

  const handleDotClick = (data: BitcoinPrice) => {
    console.log("Clicked data:", data);
    setActivePrice(data);
  };

  const formatYAxis = (value: number) => {
    return `$${value.toLocaleString()}`;
  };

  // Find max and min prices for better visualization
  const maxPrice = Math.max(...data.map((d) => d.price));
  const minPrice = Math.min(...data.map((d) => d.price));

  // Add some padding to the min and max
  const yDomain = [
    minPrice - (maxPrice - minPrice) * 0.05,
    maxPrice + (maxPrice - minPrice) * 0.05,
  ];

  return (
    <div className="space-y-6">
      <div className="h-80 md:h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
            onClick={(e) =>
              e?.activePayload && handleDotClick(e.activePayload[0].payload)}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#ccc"
              strokeOpacity={0.3}
            />
            <XAxis
              dataKey="timestamp"
              tickFormatter={(tick) => format(new Date(tick), "MMM dd")}
              stroke="#888"
              fontSize={12}
            />
            <YAxis
              tickFormatter={formatYAxis}
              stroke="#888"
              fontSize={12}
              domain={yDomain as [number, number]}
            />
            <Tooltip content={<CustomTooltip />} />
            {/* Add a reference line for average price */}
            <ReferenceLine
              y={data.reduce((sum, item) => sum + item.price, 0) / data.length}
              stroke="#888"
              strokeDasharray="3 3"
              label={{
                value: "Avg",
                position: "insideBottomRight",
                fill: "#888",
                fontSize: 10,
              }}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#f7931a"
              strokeWidth={2}
              activeDot={<ActiveCustomDot />}
              dot={<CustomDot />}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {activePrice && (
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <div className="flex flex-col md:flex-row justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold mb-1">
                Bitcoin Price: ${activePrice.price.toLocaleString()}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {format(new Date(activePrice.timestamp), "MMMM dd, yyyy")}
              </p>
            </div>
            <div className="mt-3 md:mt-0 flex items-center">
              <div
                className={`inline-flex items-center px-3 py-1 rounded ${
                  activePrice.percent_change >= 0
                    ? "text-green-800 bg-green-100 dark:bg-green-900 dark:text-green-300"
                    : "text-red-800 bg-red-100 dark:bg-red-900 dark:text-red-300"
                }`}
              >
                {activePrice.percent_change >= 0
                  ? <ChevronUp size={20} />
                  : <ChevronDown size={20} />}
                <span className="font-semibold ml-1">
                  {Math.abs(activePrice.percent_change).toFixed(2)}%
                </span>
                <span className="text-xs ml-1">24h change</span>
              </div>
            </div>
          </div>

          <NewsComponent
            hasNews={activePrice.has_news || newsEvents.length > 0}
            loading={loading}
            newsEvents={newsEvents}
          />
        </div>
      )}
    </div>
  );
};

export default PriceChart;
