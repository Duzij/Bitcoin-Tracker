import  { BitcoinPrice, NewsEvent } from '../types';

// Generate mock Bitcoin price data for testing
export const generateMockPrices = (): BitcoinPrice[] => {
  const prices: BitcoinPrice[] = [];
  const startDate = new Date('2023-01-01');
  const endDate = new Date('2023-06-30');
  
  let currentDate = new Date(startDate);
  let basePrice = 16500;
  
  while (currentDate <= endDate) {
    // Add some randomness to price
    const randomChange = (Math.random() - 0.5) * 500;
    const price = basePrice + randomChange;
    
    // Calculate percent change (simulated)
    const percentChange = ((randomChange / basePrice) * 100);
    
    // Some dates have associated news (approximately 1 in 5)
    const hasNews = Math.random() < 0.2;
    
    prices.push({
      id: prices.length + 1,
      price: Math.round(price * 100) / 100,
      timestamp: currentDate.toISOString(),
      percent_change: Math.round(percentChange * 100) / 100,
      has_news: hasNews
    });
    
    // Update base price for next iteration
    basePrice = price;
    
    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return prices;
};

// Generate mock news events for testing
export const generateMockNewsForPrice = (priceId: number): NewsEvent[] => {
  const sentiments: Array<'positive' | 'neutral' | 'negative'> = ['positive', 'neutral', 'negative'];
  const newsCount = Math.floor(Math.random() * 3) + 1; // 1-3 news items
  
  const news: NewsEvent[] = [];
  
  for (let i = 0; i < newsCount; i++) {
    const sentiment = sentiments[Math.floor(Math.random() * sentiments.length)];
    
    let title = '';
    let summary = '';
    
    if (sentiment === 'positive') {
      title = `Bitcoin Surges After ${['Major Adoption News', 'Institutional Investment', 'Regulatory Clarity'][Math.floor(Math.random() * 3)]}`;
      summary = `The cryptocurrency market responded positively today as ${['a major financial institution announced Bitcoin investments', 'a country announced Bitcoin as legal tender', 'regulators provided clarity on cryptocurrency taxation'][Math.floor(Math.random() * 3)]}.`;
    } else if (sentiment === 'negative') {
      title = `Bitcoin Drops Following ${['Regulatory Concerns', 'Security Breach', 'Market Volatility'][Math.floor(Math.random() * 3)]}`;
      summary = `Bitcoin prices fell sharply after ${['new regulatory restrictions were announced', 'a major exchange reported security issues', 'market volatility increased due to macroeconomic factors'][Math.floor(Math.random() * 3)]}.`;
    } else {
      title = `Bitcoin Stabilizes ${['Amid Market Uncertainty', 'As Traders Await Data', 'Following Recent Volatility'][Math.floor(Math.random() * 3)]}`;
      summary = `The cryptocurrency market showed signs of stabilization today as ${['traders assessed recent developments', 'investors await key economic data', 'technical indicators suggested consolidation'][Math.floor(Math.random() * 3)]}.`;
    }
    
    news.push({
      id: priceId * 10 + i,
      title,
      summary,
      source: ['CryptoNews', 'BlockchainInsider', 'CoinDesk', 'Bitcoin Magazine'][Math.floor(Math.random() * 4)],
      url: 'https://example.com/news/' + (priceId * 10 + i),
      timestamp: new Date(Date.now() - Math.floor(Math.random() * 86400000)).toISOString(), // Random time in last 24h
      price_id: priceId,
      sentiment
    });
  }
  
  return news;
};
 