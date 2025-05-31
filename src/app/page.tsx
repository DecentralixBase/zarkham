'use client'

import React from 'react'
import WalletCard from '@/components/WalletCard'
import ActivityFeed from '@/components/ActivityFeed'
import RadarChart from '@/components/RadarChart'

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
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
    </main>
  )
} 