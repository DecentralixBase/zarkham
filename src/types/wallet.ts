import type { ReactNode } from 'react';

export interface TokenData {
  symbol: string;
  name: string;
  price: number;
  balance: number;
  value: number;
  change24h: number;
}

export interface ProtocolData {
  name: string;
  tvl: number;
}

export interface HistoricalBalance {
  date: string;
  value: number;
}

export interface WalletData {
  address: string;
  ensName?: string;
  balance: number;
  netWorth: number;
  tokens: TokenData[];
  transactions: TransactionData[];
  topTokens: TokenData[];
  protocols: ProtocolData[];
  historicalBalance: HistoricalBalance[];
}

export interface TransactionData {
  hash: string;
  timestamp: number;
  from: string;
  to: string;
  value: number;
  token: string;
  type: 'in' | 'out' | 'swap';
}

export interface NetworkStats {
  totalValueLocked: number;
  dailyVolume: number;
  uniqueWallets: number;
  gasPrice: number;
}

export interface WalletCardProps {
  wallet: WalletData;
}

export interface ActivityData {
  id: string;
  type: string;
  wallet: string;
  protocol: string;
  amount: number;
  token: string;
  timestamp: string;
  txHash: string;
}

export interface ActivityFeedProps {
  activities: ActivityData[];
}

export interface DashboardLayoutProps {
  children: ReactNode;
} 