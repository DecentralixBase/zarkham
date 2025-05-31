import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import WalletCard from '@/components/WalletCard';
import RadarChart from '@/components/RadarChart';
import ActivityFeed from '@/components/ActivityFeed';

// Mock data - Replace with actual API calls
const mockWallets = [
  {
    address: '0x1234567890abcdef1234567890abcdef12345678',
    netWorth: 15234567,
    topTokens: [
      { symbol: 'ETH', balance: 1250.45, value: 2345678 },
      { symbol: 'USDC', balance: 500000, value: 500000 },
      { symbol: 'AAVE', balance: 2500, value: 175000 },
    ],
    protocols: [
      { name: 'Aave', tvl: 1000000 },
      { name: 'Uniswap', tvl: 500000 },
    ],
    historicalBalance: [
      { date: '2024-01-01', value: 14000000 },
      { date: '2024-01-02', value: 14500000 },
      { date: '2024-01-03', value: 15234567 },
    ],
  },
  // Add more mock wallets...
];

const mockTokenAllocations = [
  { token: 'ETH', percentage: 45 },
  { token: 'USDC', percentage: 25 },
  { token: 'AAVE', percentage: 15 },
  { token: 'UNI', percentage: 10 },
  { token: 'Others', percentage: 5 },
];

const mockActivities = [
  {
    id: '1',
    type: 'swap' as const,
    wallet: '0x1234567890abcdef1234567890abcdef12345678',
    protocol: 'Uniswap V3',
    amount: 100000,
    token: 'USDC',
    timestamp: new Date().toISOString(),
    txHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
  },
  // Add more mock activities...
];

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search wallet address..."
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <button className="px-4 py-2 bg-primary text-black font-medium rounded-lg hover:bg-primary/90 transition-colors">
              Add Wallet
            </button>
          </div>
        </div>

        {/* Wallet Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockWallets.map((wallet) => (
            <WalletCard key={wallet.address} {...wallet} />
          ))}
        </div>

        {/* Charts and Activity */}
        <div className="grid lg:grid-cols-2 gap-6">
          <RadarChart tokenAllocations={mockTokenAllocations} />
          <ActivityFeed activities={mockActivities} />
        </div>
      </div>
    </DashboardLayout>
  );
} 