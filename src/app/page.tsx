'use client';

import * as React from 'react';
import { api } from '@/services/api';
import DashboardLayout from '@/components/DashboardLayout';
import WalletCard from '@/components/WalletCard';
import ActivityFeed from '@/components/ActivityFeed';
import RadarChart from '@/components/RadarChart';
import { motion } from 'framer-motion';
import type { WalletData, ActivityData } from '@/types/wallet';

const Home: React.FC = () => {
  const [whaleWallets, setWhaleWallets] = React.useState<WalletData[]>([]);
  const [activities, setActivities] = React.useState<ActivityData[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const wallets = await api.getWhaleWallets();
        const latestActivities = await api.getWalletActivity(wallets[0]?.address || '');
        setWhaleWallets(wallets);
        setActivities(latestActivities);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const content = (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <h1 className="text-4xl font-bold mb-8">DeFi Alpha Feed</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <WalletCard />
          <ActivityFeed className="mt-6" />
        </div>
        
        <div>
          <RadarChart />
        </div>
      </div>
    </div>
  );

  return <DashboardLayout>{content}</DashboardLayout>;
};

export default Home; 