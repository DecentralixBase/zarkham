import React from 'react';
import { motion } from 'framer-motion';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';

interface Activity {
  id: string;
  type: 'swap' | 'deposit' | 'withdraw' | 'borrow' | 'repay';
  wallet: string;
  protocol: string;
  amount: number;
  token: string;
  timestamp: string;
  txHash: string;
}

interface ActivityFeedProps {
  activities: Activity[];
}

const activityColors = {
  swap: 'text-primary',
  deposit: 'text-green-400',
  withdraw: 'text-red-400',
  borrow: 'text-yellow-400',
  repay: 'text-purple-400',
};

const activityIcons = {
  swap: '🔄',
  deposit: '📥',
  withdraw: '📤',
  borrow: '💰',
  repay: '💸',
};

export default function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <div className="glass-effect p-6">
      <h2 className="text-xl font-semibold text-white/90 mb-6">Latest DeFi Moves</h2>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start gap-4 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          >
            <div className="text-2xl">{activityIcons[activity.type]}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className={`font-medium ${activityColors[activity.type]}`}>
                  {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                </span>
                <span className="text-sm text-white/60">on</span>
                <span className="font-medium text-white/90">{activity.protocol}</span>
              </div>
              <div className="mt-1 text-sm text-white/60">
                by {activity.wallet.slice(0, 6)}...{activity.wallet.slice(-4)}
              </div>
              <div className="mt-2 flex items-center gap-2">
                <span className="font-medium">
                  {activity.amount.toLocaleString()} {activity.token}
                </span>
                <span className="text-sm text-white/60">
                  • {new Date(activity.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
            <a
              href={`https://etherscan.io/tx/${activity.txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <ArrowTopRightOnSquareIcon className="w-5 h-5 text-white/60" />
            </a>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 