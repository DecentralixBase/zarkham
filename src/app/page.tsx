'use client';

import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import DashboardLayout from '@/components/DashboardLayout';
import WalletCard from '@/components/WalletCard';
import ActivityFeed from '@/components/ActivityFeed';
import { motion } from 'framer-motion';

export default function Home() {
  const [whaleWallets, setWhaleWallets] = useState([]);
  const [topTokens, setTopTokens] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [wallets, tokens] = await Promise.all([
          api.getWhaleWallets(),
          api.getTopTokens()
        ]);
        setWhaleWallets(wallets);
        setTopTokens(tokens);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {isLoading ? (
            Array(6).fill(0).map((_, i) => (
              <div key={i} className="animate-pulse bg-background-lighter rounded-xl h-64" />
            ))
          ) : (
            whaleWallets.slice(0, 6).map((wallet: any) => (
              <WalletCard key={wallet.address} wallet={wallet} />
            ))
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <ActivityFeed />
        </motion.div>
      </div>
    </DashboardLayout>
  );
} 