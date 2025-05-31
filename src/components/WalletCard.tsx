import React from 'react';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

interface WalletCardProps {
  address: string;
  netWorth: number;
  topTokens: Array<{
    symbol: string;
    balance: number;
    value: number;
  }>;
  protocols: Array<{
    name: string;
    tvl: number;
  }>;
  historicalBalance: Array<{
    date: string;
    value: number;
  }>;
}

export default function WalletCard({
  address,
  netWorth,
  topTokens,
  protocols,
  historicalBalance,
}: WalletCardProps) {
  const chartData = {
    labels: historicalBalance.map(item => item.date),
    datasets: [
      {
        fill: true,
        label: 'Portfolio Value',
        data: historicalBalance.map(item => item.value),
        borderColor: '#00f6ff',
        backgroundColor: 'rgba(0, 246, 255, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        display: false,
      },
    },
    elements: {
      point: {
        radius: 0,
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
      className="glass-effect p-6 glow-effect"
    >
      {/* Wallet Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white/90 mb-1">
            {`${address.slice(0, 6)}...${address.slice(-4)}`}
          </h3>
          <p className="text-2xl font-bold text-primary">
            ${netWorth.toLocaleString()}
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm hover:bg-primary/20 transition-colors"
        >
          Track
        </motion.button>
      </div>

      {/* Chart */}
      <div className="h-32 mb-6">
        <Line data={chartData} options={chartOptions} />
      </div>

      {/* Token List */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-white/60 mb-3">Top Tokens</h4>
        <div className="space-y-2">
          {topTokens.slice(0, 3).map((token) => (
            <div key={token.symbol} className="flex justify-between items-center">
              <span className="text-sm">{token.symbol}</span>
              <span className="text-sm text-white/80">
                ${token.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Protocols */}
      <div>
        <h4 className="text-sm font-medium text-white/60 mb-3">Active Protocols</h4>
        <div className="flex flex-wrap gap-2">
          {protocols.map((protocol) => (
            <span
              key={protocol.name}
              className="px-3 py-1 bg-white/5 rounded-full text-xs"
            >
              {protocol.name}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
} 