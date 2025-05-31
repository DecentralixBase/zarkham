import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
          <h2 className="text-2xl font-semibold mb-6">Page Not Found</h2>
          <p className="text-gray-400 mb-8">
            We cannot find the page you&apos;re looking for. Let&apos;s get you back on track.
          </p>
          <Link
            href="/"
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            Return Home
          </Link>
        </motion.div>
      </div>
    </div>
  );
} 