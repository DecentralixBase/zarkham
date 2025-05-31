'use client'

import React from 'react'
import { api } from '@/services/api'
import { TokenData } from '@/types/wallet'

export default function RadarChart() {
  const [tokens, setTokens] = React.useState<TokenData[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchTokens = async () => {
      try {
        const data = await api.getWalletData('0x47ac0fb4f2d84898e4d9e7b4dab3c24507a6d503')
        setTokens(data.tokens)
      } catch (error) {
        console.error('Error fetching tokens:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTokens()
  }, [])

  if (loading) {
    return <div className="animate-pulse bg-background-lighter rounded-xl h-64 p-6" />
  }

  return (
    <div className="bg-background-lighter rounded-xl p-6">
      <h2 className="text-xl font-semibold mb-4">Token Allocation</h2>
      
      <div className="space-y-4">
        {tokens.map((token: TokenData) => (
          <div key={token.symbol} className="flex items-center justify-between">
            <div>
              <p className="text-sm">{token.name}</p>
              <p className="text-xs text-gray-400">{token.symbol}</p>
            </div>
            <div className="text-right">
              <p className="text-sm">${token.value.toLocaleString()}</p>
              <p className={`text-xs ${token.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {token.change24h >= 0 ? '+' : ''}{token.change24h.toFixed(2)}%
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 