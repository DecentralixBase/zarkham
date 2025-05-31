import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import {
  ChartBarIcon,
  WalletIcon,
  ClockIcon,
  LightBulbIcon,
  HomeIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';

const sidebarItems = [
  { name: 'Dashboard', icon: HomeIcon, href: '/' },
  { name: 'Wallets', icon: WalletIcon, href: '/wallets' },
  { name: 'Activity', icon: ClockIcon, href: '/activity' },
  { name: 'Analytics', icon: ChartBarIcon, href: '/analytics' },
  { name: 'Insights', icon: LightBulbIcon, href: '/insights' },
];

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen">
      {/* Animated Sidebar */}
      <motion.aside
        initial={{ x: -200, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-64 glass-effect m-4 p-4 h-[calc(100vh-2rem)] flex flex-col gap-2"
      >
        <div className="flex items-center gap-2 p-4">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary"
          />
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            ZArkham
          </h1>
        </div>

        <nav className="flex-1 mt-8">
          <ul className="space-y-2">
            {sidebarItems.map((item) => (
              <motion.li
                key={item.name}
                whileHover={{ scale: 1.05, x: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href={item.href}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <item.icon className="w-5 h-5 text-primary" />
                  <span>{item.name}</span>
                </Link>
              </motion.li>
            ))}
          </ul>
        </nav>

        <div className="p-4 glass-effect rounded-lg">
          <p className="text-sm text-white/60">
            Track DeFi Alpha
          </p>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 p-4 overflow-auto">
        {children}
      </main>
    </div>
  );
} 