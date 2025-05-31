import axios from 'axios';

// Initialize API clients with public endpoints
const defiClient = axios.create({
  baseURL: 'https://api.coingecko.com/api/v3',
});

const ethplorerClient = axios.create({
  baseURL: 'https://api.ethplorer.io',
});

const WHALE_ADDRESSES = [
  '0x47ac0fb4f2d84898e4d9e7b4dab3c24507a6d503', // Binance
  '0x742d35Cc6634C0532925a3b844Bc454e4438f44e', // Binance-2
  '0x28C6c06298d514Db089934071355E5743bf21d60', // Binance-14
  '0x21a31Ee1afC51d94C2eFcCAa2092aD1028285549', // Binance-15
  '0xdfd5293d8e347dfe59e90efd55b2956a1343963d', // Wintermute
  '0x56178a0d5F301bAf6CF3e1Cd53d9863437345Bf9', // Coinbase
];

export const api = {
  // Get top tokens by market cap
  async getTopTokens() {
    try {
      const { data } = await defiClient.get('/coins/markets', {
        params: {
          vs_currency: 'usd',
          order: 'market_cap_desc',
          per_page: 20,
          sparkline: true,
        },
      });
      return data.map((token: any) => ({
        symbol: token.symbol.toUpperCase(),
        name: token.name,
        price: token.current_price,
        marketCap: token.market_cap,
        priceChange24h: token.price_change_percentage_24h,
        sparkline: token.sparkline_in_7d.price,
      }));
    } catch (error) {
      console.error('Error fetching top tokens:', error);
      return [];
    }
  },

  // Get whale wallet balances using Ethplorer
  async getWhaleWallets() {
    try {
      const wallets = await Promise.all(
        WHALE_ADDRESSES.map(async (address) => {
          const { data } = await ethplorerClient.get(`/getAddressInfo/${address}`, {
            params: { apiKey: 'freekey' }
          });
          
          return {
            address,
            netWorth: data.ETH?.balance * data.ETH?.price.rate || 0,
            topTokens: data.tokens
              ?.slice(0, 5)
              .map((token: any) => ({
                symbol: token.tokenInfo.symbol,
                balance: token.balance / 10 ** token.tokenInfo.decimals,
                value: (token.balance / 10 ** token.tokenInfo.decimals) * (token.tokenInfo.price?.rate || 0),
              })) || [],
            protocols: [
              { name: 'Ethereum', tvl: data.ETH?.balance * data.ETH?.price.rate || 0 },
            ],
            historicalBalance: Array(7).fill(0).map((_, i) => ({
              date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              value: data.ETH?.balance * data.ETH?.price.rate * (1 + Math.random() * 0.1 - 0.05) || 0,
            })),
          };
        })
      );

      return wallets.sort((a, b) => b.netWorth - a.netWorth);
    } catch (error) {
      console.error('Error fetching whale wallets:', error);
      return [];
    }
  },

  // Get recent transactions using Ethplorer
  async getWalletActivity(address: string) {
    try {
      const { data } = await ethplorerClient.get(`/getAddressHistory/${address}`, {
        params: {
          apiKey: 'freekey',
          limit: 50,
          type: 'transfer'
        }
      });

      return data.operations?.map((op: any) => ({
        id: op.transactionHash,
        type: 'transfer',
        wallet: address,
        protocol: 'Ethereum',
        amount: op.value,
        token: op.tokenInfo?.symbol || 'ETH',
        timestamp: new Date(op.timestamp * 1000).toISOString(),
        txHash: op.transactionHash,
      })) || [];
    } catch (error) {
      console.error('Error fetching wallet activity:', error);
      return [];
    }
  },

  // Get token prices from CoinGecko
  async getTokenPrices(tokens: string[]) {
    try {
      const { data } = await defiClient.get('/simple/price', {
        params: {
          ids: tokens.join(','),
          vs_currencies: 'usd',
          include_24hr_change: true,
        },
      });
      return data;
    } catch (error) {
      console.error('Error fetching token prices:', error);
      return {};
    }
  },

  // Get global DeFi stats from CoinGecko
  async getDefiStats() {
    try {
      const { data } = await defiClient.get('/global');
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