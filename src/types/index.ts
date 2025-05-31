export interface Wallet {
  address: string;
  netWorth: number;
  topTokens: Token[];
  protocols: Protocol[];
  historicalBalance: HistoricalBalance[];
}

export interface Token {
  symbol: string;
  balance: number;
  value: number;
}

export interface Protocol {
  name: string;
  tvl: number;
}

export interface HistoricalBalance {
  date: string;
  value: number;
}

export interface Activity {
  id: string;
  type: 'swap' | 'deposit' | 'withdraw' | 'borrow' | 'repay';
  wallet: string;
  protocol: string;
  amount: number;
  token: string;
  timestamp: string;
  txHash: string;
}

export interface TokenAllocation {
  token: string;
  percentage: number;
} 