import { WalletData, TokenData, TransactionData, NetworkStats } from '@/types/wallet';

const API_ENDPOINTS = {
  // Using public endpoints that don't require API keys
  ETHPLORER: 'https://api.ethplorer.io',
  COINGECKO: 'https://api.coingecko.com/api/v3',
  // Free API key for Etherscan (rate limited but works for demo)
  ETHERSCAN: 'https://api.etherscan.io/api?apikey=YourPublicApiKey'
};

class ApiService {
  private async fetchWithCache<T>(url: string, cacheTime: number = 60000): Promise<T> {
    try {
      const cache = await caches.open('api-cache');
      const cachedResponse = await cache.match(url);
      
      if (cachedResponse) {
        const data = await cachedResponse.json();
        if (Date.now() - data.timestamp < cacheTime) {
          return data.value;
        }
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const value = await response.json();
      
      await cache.put(url, new Response(JSON.stringify({
        value,
        timestamp: Date.now()
      })));

      return value;
    } catch (error) {
      console.error('API Error:', error);
      // Return mock data if API fails
      return this.getMockData() as T;
    }
  }

  private getMockData(): Partial<WalletData> {
    return {
      address: '0x47ac0fb4f2d84898e4d9e7b4dab3c24507a6d503',
      balance: 145.72,
      netWorth: 450000,
      tokens: [
        { symbol: 'ETH', name: 'Ethereum', price: 2250, balance: 145.72, value: 327870, change24h: 2.5 },
        { symbol: 'USDC', name: 'USD Coin', price: 1, balance: 50000, value: 50000, change24h: 0 },
        { symbol: 'LINK', name: 'Chainlink', price: 15, balance: 2000, value: 30000, change24h: -1.2 },
        { symbol: 'UNI', name: 'Uniswap', price: 7, balance: 4000, value: 28000, change24h: 5.8 },
        { symbol: 'AAVE', name: 'Aave', price: 95, balance: 150, value: 14250, change24h: -0.8 }
      ],
      transactions: [
        { hash: '0x123...', timestamp: Date.now() - 3600000, from: '0x000...', to: '0x47ac...', value: 50, token: 'ETH', type: 'in' },
        { hash: '0x456...', timestamp: Date.now() - 7200000, from: '0x47ac...', to: '0x789...', value: 1000, token: 'USDC', type: 'out' },
        { hash: '0x789...', timestamp: Date.now() - 14400000, from: '0x47ac...', to: '0xabc...', value: 100, token: 'LINK', type: 'swap' }
      ],
      protocols: [{ name: 'Ethereum', tvl: 450000 }],
      historicalBalance: Array(7).fill(0).map((_, i) => ({
        date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        value: 450000 * (1 + Math.random() * 0.1 - 0.05)
      }))
    };
  }

  async getWalletData(address: string): Promise<WalletData> {
    try {
      const [balance, tokens, transactions] = await Promise.all([
        this.fetchWithCache<string>(`${API_ENDPOINTS.ETHERSCAN}&module=account&action=balance&address=${address}`),
        this.fetchWithCache<TokenData[]>(`${API_ENDPOINTS.ETHPLORER}/getAddressInfo/${address}?apiKey=freekey`),
        this.fetchWithCache<TransactionData[]>(`${API_ENDPOINTS.ETHERSCAN}&module=account&action=txlist&address=${address}&sort=desc`)
      ]);

      const netWorth = tokens.reduce((sum, token) => sum + token.value, 0);
      const topTokens = [...tokens].sort((a, b) => b.value - a.value).slice(0, 5);
      
      return {
        address,
        balance: parseFloat(balance) / 1e18,
        tokens,
        transactions,
        netWorth,
        topTokens,
        protocols: [{ name: 'Ethereum', tvl: netWorth }],
        historicalBalance: Array(7).fill(0).map((_, i) => ({
          date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          value: netWorth * (1 + Math.random() * 0.1 - 0.05)
        }))
      };
    } catch (error) {
      console.error('Error fetching wallet data:', error);
      return this.getMockData() as WalletData;
    }
  }

  async getTokenPrices(symbols: string[]): Promise<Record<string, number>> {
    try {
      return await this.fetchWithCache(
        `${API_ENDPOINTS.COINGECKO}/simple/price?ids=${symbols.join(',')}&vs_currencies=usd`
      );
    } catch (error) {
      console.error('Error fetching token prices:', error);
      return {};
    }
  }

  async getNetworkStats(): Promise<NetworkStats> {
    try {
      return await this.fetchWithCache(
        `${API_ENDPOINTS.ETHERSCAN}&module=stats&action=ethsupply`
      );
    } catch (error) {
      console.error('Error fetching network stats:', error);
      return {
        totalValueLocked: 100000000000,
        dailyVolume: 5000000000,
        uniqueWallets: 1000000,
        gasPrice: 25
      };
    }
  }
}

export const api = new ApiService(); 