// Initialize API endpoints
const COINGECKO_API = 'https://api.coingecko.com/api/v3';
const ETHERSCAN_API = 'https://api.etherscan.io/api';
const ETHERSCAN_KEY = 'YourApiKey'; // Free tier key

// Cache durations
const CACHE_DURATION = {
  TOKENS: 5 * 60 * 1000, // 5 minutes
  WALLETS: 2 * 60 * 1000, // 2 minutes
  ACTIVITY: 1 * 60 * 1000, // 1 minute
};

// Rate limiting
const RATE_LIMIT = {
  TOKENS: 1000, // ms between requests
  WALLETS: 2000,
  ACTIVITY: 1000,
};

const WHALE_ADDRESSES = [
  '0x47ac0fb4f2d84898e4d9e7b4dab3c24507a6d503', // Binance
  '0x742d35Cc6634C0532925a3b844Bc454e4438f44e', // Binance-2
  '0x28C6c06298d514Db089934071355E5743bf21d60', // Binance-14
  '0x21a31Ee1afC51d94C2eFcCAa2092aD1028285549', // Binance-15
  '0xdfd5293d8e347dfe59e90efd55b2956a1343963d', // Wintermute
  '0x56178a0d5F301bAf6CF3e1Cd53d9863437345Bf9', // Coinbase
];

// Simple cache implementation
const cache = new Map<string, { data: any; timestamp: number }>();

// Rate limiting implementation
const lastRequestTime = new Map<string, number>();

const rateLimit = async (key: string, delay: number) => {
  const last = lastRequestTime.get(key) || 0;
  const now = Date.now();
  const wait = last + delay - now;
  
  if (wait > 0) {
    await new Promise(resolve => setTimeout(resolve, wait));
  }
  
  lastRequestTime.set(key, Date.now());
};

// Fallback data for when API calls fail
const FALLBACK_DATA = {
  tokens: [
    { symbol: 'ETH', name: 'Ethereum', price: 2000, marketCap: 200000000000, priceChange24h: 0, sparkline: Array(7).fill(2000) },
    { symbol: 'BTC', name: 'Bitcoin', price: 30000, marketCap: 600000000000, priceChange24h: 0, sparkline: Array(7).fill(30000) },
  ],
  wallets: WHALE_ADDRESSES.map(address => ({
    address,
    netWorth: 0,
    topTokens: [],
    protocols: [{ name: 'Ethereum', tvl: 0 }],
    historicalBalance: Array(7).fill({ date: new Date().toISOString().split('T')[0], value: 0 }),
  })),
};

export const api = {
  // Get top tokens by market cap
  async getTopTokens() {
    const cacheKey = 'topTokens';
    const cached = cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION.TOKENS) {
      return cached.data;
    }

    try {
      await rateLimit('tokens', RATE_LIMIT.TOKENS);
      
      const response = await fetch(
        `${COINGECKO_API}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&sparkline=true`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch tokens');
      }

      const data = await response.json();
      const processed = data.map((token: any) => ({
        symbol: token.symbol.toUpperCase(),
        name: token.name,
        price: token.current_price,
        marketCap: token.market_cap,
        priceChange24h: token.price_change_percentage_24h,
        sparkline: token.sparkline_in_7d.price,
      }));

      cache.set(cacheKey, { data: processed, timestamp: Date.now() });
      return processed;
    } catch (error) {
      console.error('Error fetching top tokens:', error);
      return cached?.data || FALLBACK_DATA.tokens;
    }
  },

  // Get whale wallet balances using Web3
  async getWhaleWallets() {
    const cacheKey = 'whaleWallets';
    const cached = cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION.WALLETS) {
      return cached.data;
    }

    try {
      await rateLimit('wallets', RATE_LIMIT.WALLETS);
      
      const wallets = await Promise.all(
        WHALE_ADDRESSES.map(async (address) => {
          // Get ETH balance
          const balanceResponse = await fetch(
            `${ETHERSCAN_API}?module=account&action=balance&address=${address}&tag=latest`
          );
          
          if (!balanceResponse.ok) {
            throw new Error(`Failed to fetch wallet ${address}`);
          }

          const balanceData = await balanceResponse.json();
          const ethBalance = Number(balanceData.result) / 1e18; // Convert from wei to ETH

          // Get token transfers for basic activity
          const tokensResponse = await fetch(
            `${ETHERSCAN_API}?module=account&action=tokentx&address=${address}&page=1&offset=5&sort=desc`
          );
          
          const tokensData = await tokensResponse.json();
          const topTokens = (tokensData.result || []).slice(0, 5).map((tx: any) => ({
            symbol: tx.tokenSymbol,
            balance: Number(tx.value) / Math.pow(10, Number(tx.tokenDecimal)),
            value: 0, // We'll need a separate price feed for accurate values
          }));

          return {
            address,
            netWorth: ethBalance * 2000, // Using a fixed ETH price for simplicity
            topTokens,
            protocols: [
              { name: 'Ethereum', tvl: ethBalance * 2000 },
            ],
            historicalBalance: Array(7).fill(0).map((_, i) => ({
              date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              value: ethBalance * 2000 * (1 + Math.random() * 0.1 - 0.05),
            })),
          };
        })
      );

      const processed = wallets.sort((a, b) => b.netWorth - a.netWorth);
      cache.set(cacheKey, { data: processed, timestamp: Date.now() });
      return processed;
    } catch (error) {
      console.error('Error fetching whale wallets:', error);
      return cached?.data || FALLBACK_DATA.wallets;
    }
  },

  // Get recent transactions
  async getWalletActivity(address: string) {
    const cacheKey = `activity_${address}`;
    const cached = cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION.ACTIVITY) {
      return cached.data;
    }

    try {
      await rateLimit('activity', RATE_LIMIT.ACTIVITY);
      
      const response = await fetch(
        `${ETHERSCAN_API}?module=account&action=txlist&address=${address}&page=1&offset=50&sort=desc`
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch activity for ${address}`);
      }

      const data = await response.json();
      const processed = (data.result || []).map((tx: any) => ({
        id: tx.hash,
        type: 'transfer',
        wallet: address,
        protocol: 'Ethereum',
        amount: Number(tx.value) / 1e18,
        token: 'ETH',
        timestamp: new Date(Number(tx.timeStamp) * 1000).toISOString(),
        txHash: tx.hash,
      }));

      cache.set(cacheKey, { data: processed, timestamp: Date.now() });
      return processed;
    } catch (error) {
      console.error('Error fetching wallet activity:', error);
      return cached?.data || [];
    }
  },

  // Get token prices from CoinGecko
  async getTokenPrices(tokens: string[]) {
    const cacheKey = `prices_${tokens.join('_')}`;
    const cached = cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION.TOKENS) {
      return cached.data;
    }

    try {
      await rateLimit('tokens', RATE_LIMIT.TOKENS);
      
      const response = await fetch(
        `${COINGECKO_API}/simple/price?ids=${tokens.join(',')}&vs_currencies=usd&include_24hr_change=true`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch token prices');
      }

      const data = await response.json();
      cache.set(cacheKey, { data, timestamp: Date.now() });
      return data;
    } catch (error) {
      console.error('Error fetching token prices:', error);
      return cached?.data || {};
    }
  },

  // Get global DeFi stats from CoinGecko
  async getDefiStats() {
    try {
      const response = await fetch(`${COINGECKO_API}/global`);
      const data = await response.json();
      return {
        totalMarketCap: data.data.total_market_cap.usd,
        defiDominance: data.data.defi_market_cap / data.data.total_market_cap.usd * 100,
        ethDominance: data.data.market_cap_percentage.eth,
        btcDominance: data.data.market_cap_percentage.btc,
      };
    } catch (error) {
      console.error('Error fetching DeFi stats:', error);
      return null;
    }
  },
}; 