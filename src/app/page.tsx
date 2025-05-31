import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background Blobs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/20 rounded-full filter blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          rotate: [0, -90, 0],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear",
          delay: 1,
        }}
        className="absolute bottom-1/4 -right-32 w-96 h-96 bg-secondary/20 rounded-full filter blur-3xl"
      />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent-purple bg-clip-text text-transparent">
              Track DeFi Whales
            </h1>
            <p className="text-xl text-white/70 mb-12">
              Monitor whale wallets, analyze DeFi positions, and discover alpha in real-time
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-gradient-to-r from-primary to-secondary rounded-xl hover:opacity-90 transition-opacity"
            >
              Launch App
            </Link>
            <button
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-primary border-2 border-primary/20 rounded-xl hover:bg-primary/10 transition-colors"
            >
              Learn More
            </button>
          </motion.div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mt-24">
            {[
              {
                title: 'Whale Tracking',
                description: 'Monitor top DeFi wallets and their movements',
                icon: '🐋',
              },
              {
                title: 'Real-time Analytics',
                description: 'Get instant insights on portfolio changes',
                icon: '📊',
              },
              {
                title: 'Protocol Analysis',
                description: 'Track interactions across DeFi protocols',
                icon: '🔍',
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                className="glass-effect p-6 text-center"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-white/60">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 