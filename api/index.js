const  express = require('express');
const { createClient } = require('@supabase/supabase-js');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

app.get('/api/prices', async (req, res) => {
  const { start_date, end_date } = req.query;
  
  let query = supabase.from('bitcoin_prices').select('*');
  
  if (start_date) {
    query = query.gte('timestamp', start_date);
  }
  
  if (end_date) {
    query = query.lte('timestamp', end_date);
  }
  
  query = query.order('timestamp', { ascending: true });
  
  const { data, error } = await query;
  
  if (error) {
    return res.status(500).json({ error: error.message });
  }
  
  // Mark prices that have associated news
  const { data: newsData } = await supabase
    .from('news_events')
    .select('price_id');
  
  const priceIdsWithNews = new Set((newsData || []).map(news => news.price_id));
  
  const result = (data || []).map(price => ({
    ...price,
    has_news: priceIdsWithNews.has(price.id)
  }));
  
  return res.json(result);
});

app.get('/api/news/:priceId', async (req, res) => {
  const { priceId } = req.params;
  
  const { data, error } = await supabase
    .from('news_events')
    .select('*')
    .eq('price_id', priceId);
  
  if (error) {
    return res.status(500).json({ error: error.message });
  }
  
  return res.json(data || []);
});

module.exports = app;
 