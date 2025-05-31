import { NewsEvent } from "../types";
import { AlertCircle, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";

interface NewsComponentProps {
  hasNews: boolean;
  loading: boolean;
  newsEvents: NewsEvent[];
}

const SentimentBadge = ({ sentiment }: { sentiment: string }) => {
  const colors = {
    positive: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    negative: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    neutral: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
  };

  return (
    sentiment === "" ? null : (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          colors[sentiment as keyof typeof colors]
        }`}
      >
        {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
      </span>
    )
  );
};


const NewsItem = ({ news }: { news: NewsEvent }) => {
  return (
    <div
      className={`news-item-${news.sentiment} p-4 mb-4 bg-white dark:bg-gray-800 rounded-lg shadow`}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{news.title}</h3>
          <div className="flex items-center gap-2 mt-1">
            <SentimentBadge sentiment={news.sentiment} />
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {format(new Date(news.timestamp), "MMM dd, yyyy")}
            </span>
          </div>
        </div>
      </div>
      <p className="text-sm mb-3">{news.description}</p>
      <div className="flex justify-between items-center text-xs mt-2">
        <span className="text-gray-500 dark:text-gray-400">
          Source: {news.source}
        </span>
        <a
          href={news.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-bitcoin-primary hover:underline flex items-center"
        >
          Read More
          <ExternalLink size={12} className="ml-1" />
        </a>
      </div>
    </div>
  );
};

const NewsComponent = ({ hasNews, loading, newsEvents }: NewsComponentProps) => {
  const [activeTab, setActiveTab] = useState("global");

  return hasNews ? (
    <>
      <div className="flex flex-col md:flex-row justify-between mb-3">
        {/* Tabs for mobile */}
        <div className="md:hidden flex w-full">
          <button
            className={`w-1/2 px-4 py-2 text-sm font-semibold rounded-l-lg ${
              activeTab === "global"
                ? "bg-bitcoin-primary text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
            }`}
            onClick={() => setActiveTab("global")}
          >
            Global News
          </button>
          <button
            className={`w-1/2 px-4 py-2 text-sm font-semibold rounded-r-lg ${
              activeTab === "crypto"
                ? "bg-bitcoin-primary text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
            }`}
            onClick={() => setActiveTab("crypto")}
          >
            Crypto News
          </button>
        </div>

        {/* Content for wide screens */}
        <div className="hidden md:flex w-full">
          <div className="w-1/2 pr-2">
            <h3 className="text-lg font-semibold mb-3">Global News</h3>
            {loading ? (
              <div className="flex justify-center p-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-bitcoin-primary"></div>
              </div>
            ) : newsEvents.filter((news) => news.type === 0).length > 0 ? (
              <div className="space-y-4">
                {newsEvents.filter((news) => news.type === 0).map((news) => (
                  <NewsItem key={news.id} news={news} />
                ))}
              </div>
            ) : (
              <div className="text-center p-4 text-gray-500 dark:text-gray-400">
                No news events found for this date.
              </div>
            )}
          </div>

          <div className="w-1/2 pl-2">
            <h3 className="text-lg font-semibold mb-3">Crypto News</h3>
            {loading ? (
              <div className="flex justify-center p-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-bitcoin-primary"></div>
              </div>
            ) : newsEvents.filter((news) => news.type === 1).length > 0 ? (
              <div className="space-y-4">
                {newsEvents.filter((news) => news.type === 1).map((news) => (
                  <NewsItem key={news.id} news={news} />
                ))}
              </div>
            ) : (
              <div className="text-center p-4 text-gray-500 dark:text-gray-400">
                No news events found for this date.
              </div>
            )}
          </div>
        </div>

        {/* Content for mobile */}
        <div className="md:hidden">
          {activeTab === "global" ? (
            <>
              {loading ? (
                <div className="flex justify-center p-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-bitcoin-primary"></div>
                </div>
              ) : newsEvents.filter((news) => news.type === 0).length > 0 ? (
                <div className="space-y-4">
                  {newsEvents.filter((news) => news.type === 0).map((news) => (
                    <NewsItem key={news.id} news={news} />
                  ))}
                </div>
              ) : (
                <div className="text-center p-4 text-gray-500 dark:text-gray-400">
                  No news events found for this date.
                </div>
              )}
            </>
          ) : (
            <>
              {loading ? (
                <div className="flex justify-center p-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-bitcoin-primary"></div>
                </div>
              ) : newsEvents.filter((news) => news.type === 1).length > 0 ? (
                <div className="space-y-4">
                  {newsEvents.filter((news) => news.type === 1).map((news) => (
                    <NewsItem key={news.id} news={news} />
                  ))}
                </div>
              ) : (
                <div className="text-center p-4 text-gray-500 dark:text-gray-400">
                  No news events found for this date.
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  ) : (
    <div className="flex items-center justify-center p-4 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700 rounded">
      <AlertCircle size={18} className="mr-2" />
      No news events available for this price point
    </div>
  );
};

export default NewsComponent;